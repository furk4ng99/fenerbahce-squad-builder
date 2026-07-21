const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");
const sharp = require("sharp");

const ROOT_DIR = path.join(__dirname, "..");
const CSV_PATH = path.join(ROOT_DIR, "src", "data", "FOOTBALL_DATA_ACTIVE.csv");
const GLOBAL_DATA_PATH = path.join(ROOT_DIR, "public", "data", "global-players.json");
const FENERBAHCE_DATA_PATH = path.join(ROOT_DIR, "public", "data", "fenerbahce-players.json");
const OUTPUT_DIR = path.join(ROOT_DIR, "public", "player-images");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "manifest.json");

const TILE_SIZE = 128;
const MAX_COLUMNS = 16;
const BUCKET_CONCURRENCY = Number(process.env.PLAYER_IMAGE_BUCKET_CONCURRENCY || 4);
const DOWNLOAD_CONCURRENCY = Number(process.env.PLAYER_IMAGE_DOWNLOAD_CONCURRENCY || 12);
const REQUEST_TIMEOUT_MS = Number(process.env.PLAYER_IMAGE_TIMEOUT_MS || 20_000);
const MAX_ATTEMPTS = 3;
const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");
const ONLY_BUCKET = process.argv
    .find((argument) => argument.startsWith("--bucket="))
    ?.split("=")[1]
    ?.toLowerCase();
const DEFAULT_IMAGE_PATTERN = /\/default\.[a-z0-9]+(?:\?|$)/i;

function sha256(value) {
    return crypto.createHash("sha256").update(value).digest("hex");
}

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJsonAtomic(filePath, value) {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    if (fs.existsSync(filePath)) fs.rmSync(filePath);
    fs.renameSync(tempPath, filePath);
}

function loadCsvImageUrls() {
    const csv = fs.readFileSync(CSV_PATH, "utf8");
    const parsed = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
        const fatalError = parsed.errors.find((error) => error.type !== "FieldMismatch");
        if (fatalError) throw new Error(`CSV parse error: ${fatalError.message}`);
    }

    return new Map(
        parsed.data
            .filter((row) => row.player_id && row.player_image_url)
            .map((row) => [String(row.player_id), row.player_image_url.trim()])
    );
}

function getSourceUrl(player, csvImageUrls) {
    if (typeof player.image === "string" && /^https?:\/\//i.test(player.image)) {
        return player.image;
    }

    const playerId = String(player.id).replace(/^global-/, "");
    return csvImageUrls.get(playerId) || "";
}

function isUsableSourceUrl(url) {
    return /^https?:\/\//i.test(url) && !DEFAULT_IMAGE_PATTERN.test(url);
}

function createBuckets(urls) {
    const buckets = new Map();

    for (const url of urls) {
        const hash = sha256(url);
        const bucketName = hash.slice(0, 2);
        if (!buckets.has(bucketName)) buckets.set(bucketName, []);
        buckets.get(bucketName).push({ url, hash });
    }

    for (const entries of buckets.values()) {
        entries.sort((left, right) => left.hash.localeCompare(right.hash));
    }

    return buckets;
}

async function fetchBuffer(url) {
    let lastError;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const response = await fetch(url, {
                headers: {
                    Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                    "User-Agent": "Mozilla/5.0 (compatible; FenerbahceSquadBuilder/1.0)",
                },
                signal: controller.signal,
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const contentType = response.headers.get("content-type") || "";
            if (contentType && !contentType.startsWith("image/") && contentType !== "application/octet-stream") {
                throw new Error(`Unexpected content type: ${contentType}`);
            }

            return Buffer.from(await response.arrayBuffer());
        } catch (error) {
            lastError = error;
            if (attempt < MAX_ATTEMPTS) {
                await new Promise((resolve) => setTimeout(resolve, attempt * 500));
            }
        } finally {
            clearTimeout(timer);
        }
    }

    throw lastError;
}

async function createTile(url) {
    const source = await fetchBuffer(url);
    return sharp(source)
        .rotate()
        .resize(TILE_SIZE, TILE_SIZE, {
            fit: "cover",
            position: "top",
        })
        .png()
        .toBuffer();
}

async function mapWithConcurrency(items, concurrency, mapper) {
    const results = new Array(items.length);
    let nextIndex = 0;

    async function worker() {
        while (nextIndex < items.length) {
            const index = nextIndex;
            nextIndex += 1;
            results[index] = await mapper(items[index], index);
        }
    }

    await Promise.all(
        Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
    );

    return results;
}

async function createPlaceholderTile() {
    const svg = Buffer.from(`
        <svg width="${TILE_SIZE}" height="${TILE_SIZE}" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <rect width="128" height="128" fill="#d1d5db"/>
            <circle cx="64" cy="45" r="24" fill="#9ca3af"/>
            <path d="M20 128c3-31 20-48 44-48s41 17 44 48" fill="#9ca3af"/>
        </svg>
    `);
    return sharp(svg).png().toBuffer();
}

async function buildBucket(bucketName, entries, previousBucket, placeholderTile) {
    const columns = Math.min(MAX_COLUMNS, entries.length);
    const rows = Math.ceil(entries.length / columns);
    const signature = sha256(entries.map((entry) => entry.url).join("\n"));
    const fileName = `sprite-${bucketName}.webp`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    const metadata = {
        file: fileName,
        signature,
        count: entries.length,
        columns,
        rows,
        failures: 0,
    };

    if (!FORCE && previousBucket?.signature === signature && fs.existsSync(filePath)) {
        return { metadata: { ...previousBucket, ...metadata }, failures: [], skipped: true };
    }

    const failures = [];
    const tiles = await mapWithConcurrency(entries, DOWNLOAD_CONCURRENCY, async (entry) => {
        try {
            return await createTile(entry.url);
        } catch (error) {
            failures.push({
                source: sha256(entry.url).slice(0, 16),
                error: error instanceof Error ? error.message : String(error),
            });
            return placeholderTile;
        }
    });

    const composites = tiles.map((tile, index) => ({
        input: tile,
        left: (index % columns) * TILE_SIZE,
        top: Math.floor(index / columns) * TILE_SIZE,
    }));
    const tempPath = `${filePath}.tmp`;

    await sharp({
        create: {
            width: columns * TILE_SIZE,
            height: rows * TILE_SIZE,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
    })
        .composite(composites)
        .webp({ quality: 80, effort: 4 })
        .toFile(tempPath);

    if (fs.existsSync(filePath)) fs.rmSync(filePath);
    fs.renameSync(tempPath, filePath);

    metadata.failures = failures.length;
    return { metadata, failures, skipped: false };
}

function buildSpriteLookup(buckets) {
    const lookup = new Map();

    for (const [bucketName, entries] of buckets) {
        const columns = Math.min(MAX_COLUMNS, entries.length);
        const rows = Math.ceil(entries.length / columns);

        entries.forEach((entry, index) => {
            lookup.set(entry.url, {
                image: `/player-images/sprite-${bucketName}.webp`,
                imageSprite: {
                    column: index % columns,
                    row: Math.floor(index / columns),
                    columns,
                    rows,
                },
            });
        });
    }

    return lookup;
}

function localizePlayers(players, csvImageUrls, spriteLookup) {
    let localized = 0;
    let placeholders = 0;

    for (const player of players) {
        const sourceUrl = getSourceUrl(player, csvImageUrls);
        const sprite = spriteLookup.get(sourceUrl);

        if (sprite) {
            player.image = sprite.image;
            player.imageSprite = sprite.imageSprite;
            localized += 1;
        } else {
            delete player.image;
            delete player.imageSprite;
            placeholders += 1;
        }
    }

    return { localized, placeholders };
}

function removeStaleSprites(expectedFiles) {
    for (const fileName of fs.readdirSync(OUTPUT_DIR)) {
        if (/^sprite-[a-f0-9]{2}\.webp$/i.test(fileName) && !expectedFiles.has(fileName)) {
            fs.rmSync(path.join(OUTPUT_DIR, fileName));
        }
    }
}

async function main() {
    console.log("Loading player data and CSV image URLs...");
    const globalData = readJson(GLOBAL_DATA_PATH);
    const fenerbahceData = readJson(FENERBAHCE_DATA_PATH);
    const csvImageUrls = loadCsvImageUrls();

    const allPlayers = [...globalData.players, ...fenerbahceData.players];
    const sourceUrls = allPlayers
        .map((player) => getSourceUrl(player, csvImageUrls))
        .filter(isUsableSourceUrl);
    const uniqueUrls = [...new Set(sourceUrls)];
    const buckets = createBuckets(uniqueUrls);

    console.log(`Players: ${allPlayers.length}`);
    console.log(`Unique downloadable images: ${uniqueUrls.length}`);
    console.log(`Sprite files: ${buckets.size}`);

    if (DRY_RUN) return;

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    const previousManifest = fs.existsSync(MANIFEST_PATH)
        ? readJson(MANIFEST_PATH)
        : { buckets: {} };
    if (ONLY_BUCKET && !buckets.has(ONLY_BUCKET)) {
        throw new Error(`Unknown sprite bucket: ${ONLY_BUCKET}`);
    }

    const manifest = {
        version: 1,
        generatedAt: new Date().toISOString(),
        tileSize: TILE_SIZE,
        maxColumns: MAX_COLUMNS,
        uniqueImages: uniqueUrls.length,
        buckets: ONLY_BUCKET ? { ...previousManifest.buckets } : {},
    };
    const placeholderTile = await createPlaceholderTile();
    const allBucketEntries = [...buckets.entries()].sort(([left], [right]) => left.localeCompare(right));
    const bucketEntries = ONLY_BUCKET
        ? allBucketEntries.filter(([bucketName]) => bucketName === ONLY_BUCKET)
        : allBucketEntries;
    const allFailures = [];
    let completed = 0;
    let generated = 0;
    let skipped = 0;

    for (let index = 0; index < bucketEntries.length; index += BUCKET_CONCURRENCY) {
        const group = bucketEntries.slice(index, index + BUCKET_CONCURRENCY);
        const results = await Promise.all(
            group.map(([bucketName, entries]) =>
                buildBucket(
                    bucketName,
                    entries,
                    previousManifest.buckets?.[bucketName],
                    placeholderTile
                ).then((result) => ({ bucketName, ...result }))
            )
        );

        for (const result of results) {
            manifest.buckets[result.bucketName] = result.metadata;
            allFailures.push(...result.failures);
            if (result.skipped) skipped += 1;
            else generated += 1;
        }

        completed += results.length;
        writeJsonAtomic(MANIFEST_PATH, manifest);
        console.log(
            `[${completed}/${bucketEntries.length}] sprite buckets complete ` +
            `(generated: ${generated}, reused: ${skipped}, failures: ${allFailures.length})`
        );
    }

    const spriteLookup = buildSpriteLookup(buckets);
    const globalStats = localizePlayers(globalData.players, csvImageUrls, spriteLookup);
    const fenerbahceStats = localizePlayers(fenerbahceData.players, csvImageUrls, spriteLookup);

    writeJsonAtomic(GLOBAL_DATA_PATH, globalData);
    writeJsonAtomic(FENERBAHCE_DATA_PATH, fenerbahceData);

    const failuresPath = path.join(OUTPUT_DIR, "failures.json");
    const totalFailureCount = Object.values(manifest.buckets)
        .reduce((total, bucket) => total + (bucket.failures || 0), 0);
    writeJsonAtomic(failuresPath, {
        count: totalFailureCount,
        items: allFailures,
    });

    if (!ONLY_BUCKET) {
        removeStaleSprites(new Set(allBucketEntries.map(([bucketName]) => `sprite-${bucketName}.webp`)));
    }

    console.log("Localization complete.");
    console.log("Global players:", globalStats);
    console.log("Fenerbahce players:", fenerbahceStats);
    console.log(`Failed downloads replaced with local placeholders: ${totalFailureCount}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
