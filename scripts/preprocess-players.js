const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const CSV_PATH = path.join(__dirname, '../src/data/FOOTBALL_DATA_ACTIVE.csv');
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'fenerbahce-players.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to parse currency string to number
const parseCurrency = (value) => {
    if (!value) return 0;
    return parseFloat(value.replace(/[^0-9.-]+/g, ""));
};

// Helper to map CSV position to our Position type
const mapPosition = (pos) => {
    if (!pos) return "CM"; // Default
    const p = pos.toUpperCase();
    if (p.includes("GOALKEEPER")) return "GK";
    if (p.includes("CENTRE-BACK")) return "CB";
    if (p.includes("LEFT-BACK")) return "LB";
    if (p.includes("RIGHT-BACK")) return "RB";
    if (p.includes("DEFENSIVE MIDFIELD")) return "CDM";
    if (p.includes("CENTRAL MIDFIELD")) return "CM";
    if (p.includes("ATTACKING MIDFIELD")) return "CAM";
    if (p.includes("LEFT WINGER")) return "LW";
    if (p.includes("RIGHT WINGER")) return "RW";
    if (p.includes("CENTRE-FORWARD")) return "ST";
    if (p.includes("SECOND STRIKER")) return "ST";
    return "CM";
};

console.log('Reading CSV file...');
const fileContent = fs.readFileSync(CSV_PATH, 'utf8');

console.log('Parsing CSV...');
Papa.parse(fileContent, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
        const players = results.data;
        console.log(`Total players found: ${players.length}`);

        // Filter Fenerbahçe players
        const fenerbahcePlayers = players.filter(p =>
            p.current_club_name && p.current_club_name.toLowerCase().includes('fenerbahce')
        );

        console.log(`Fenerbahçe players found: ${fenerbahcePlayers.length}`);

        // Map to our optimized format
        const mappedPlayers = fenerbahcePlayers.map(p => {
            // Clean name: "Name (ID)" -> "Name"
            let name = p.player_name;
            if (name && name.includes("(") && name.includes(")")) {
                name = name.replace(/\s*\(\d+\)$/, "").trim();
            }

            return {
                id: p.player_id || Math.random().toString(36).substr(2, 9),
                name: name,
                position: mapPosition(p.position),
                rating: 75, // Default rating
                value: parseCurrency(p.market_value_in_eur),
                image: p.player_image_url || "https://via.placeholder.com/150",
                club: p.current_club_name
            };
        });

        // Sort by value
        mappedPlayers.sort((a, b) => b.value - a.value);

        // Write to JSON
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ players: mappedPlayers }, null, 2));
        console.log(`Successfully wrote ${mappedPlayers.length} players to ${OUTPUT_FILE}`);
    },
    error: (err) => {
        console.error('Error parsing CSV:', err);
    }
});
