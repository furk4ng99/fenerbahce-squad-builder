"use client";

import {
    useDeferredValue,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Command } from "cmdk";
import {
    AlertCircle,
    Database,
    Loader2,
    Search,
    Shirt,
    Trash2,
    Users,
    X,
} from "lucide-react";
import type { Player, Position } from "@/types";
import styles from "./PlannerPlayerDatabase.module.css";

type PositionFilter = "ALL" | "GK" | "DEF" | "MID" | "FWD";

const FILTERS: Array<{
    id: PositionFilter;
    label: string;
    positions: Position[];
}> = [
    { id: "ALL", label: "Tümü", positions: [] },
    { id: "GK", label: "Kaleci", positions: ["GK"] },
    { id: "DEF", label: "Defans", positions: ["LB", "RB", "CB", "LWB", "RWB"] },
    { id: "MID", label: "Orta saha", positions: ["CDM", "CM", "CAM", "LM", "RM"] },
    { id: "FWD", label: "Hücum", positions: ["LW", "RW", "ST"] },
];

function filterForPosition(position?: string): PositionFilter {
    if (position === "GK") return "GK";
    if (["LB", "RB", "CB", "LWB", "RWB"].includes(position ?? "")) return "DEF";
    if (["CDM", "CM", "CAM", "LM", "RM"].includes(position ?? "")) return "MID";
    if (["LW", "RW", "ST"].includes(position ?? "")) return "FWD";
    return "ALL";
}

function normalize(value: string) {
    return value
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ı/g, "i");
}

function PlayerJersey({ player }: { player: Player }) {
    return (
        <span className={styles.portraitFallback} aria-hidden="true">
            <Shirt size={31} strokeWidth={1.7} />
            <span>{player.position}</span>
        </span>
    );
}

export function PlannerPlayerDatabase({
    open,
    position,
    currentPlayerId,
    canRemove,
    onClose,
    onSelect,
    onRemove,
}: {
    open: boolean;
    position?: string;
    currentPlayerId?: string | number;
    canRemove: boolean;
    onClose: () => void;
    onSelect: (player: Player) => void;
    onRemove: () => void;
}) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<PositionFilter>("ALL");
    const [loading, setLoading] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const deferredQuery = useDeferredValue(query);

    useEffect(() => {
        if (!open) return;

        setQuery("");
        setFilter(filterForPosition(position));
    }, [open, position]);

    useEffect(() => {
        if (!open || players.length > 0) return;

        let cancelled = false;
        setLoading(true);
        setLoadError(false);

        Promise.all([
            fetch("/data/fenerbahce-players.json").then((response) => {
                if (!response.ok) throw new Error("Fenerbahçe oyuncuları yüklenemedi");
                return response.json() as Promise<{ players: Player[] }>;
            }),
            fetch("/data/global-players.json").then((response) => {
                if (!response.ok) throw new Error("Global oyuncular yüklenemedi");
                return response.json() as Promise<{ players: Player[] }>;
            }),
        ])
            .then(([fenerbahce, global]) => {
                if (cancelled) return;
                const unique = new Map<string, Player>();
                [...fenerbahce.players, ...global.players].forEach((player) => {
                    const identity = [
                        normalize(player.name),
                        player.position,
                        normalize(player.club ?? ""),
                    ].join("|");
                    if (!unique.has(identity)) unique.set(identity, player);
                });
                setPlayers(Array.from(unique.values()));
            })
            .catch(() => {
                if (!cancelled) setLoadError(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [open, players.length]);

    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", closeOnEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [onClose, open]);

    const { results, matchCount } = useMemo(() => {
        const normalizedQuery = normalize(deferredQuery.trim());
        const activePositions =
            FILTERS.find((item) => item.id === filter)?.positions ?? [];

        const matches = players.filter((player) => {
            if (
                activePositions.length > 0 &&
                !activePositions.includes(player.position)
            ) {
                return false;
            }

            if (!normalizedQuery) return true;
            return normalize(`${player.name} ${player.club ?? ""}`).includes(normalizedQuery);
        });

        matches.sort((first, second) => {
            const firstExact = first.position === position ? 1 : 0;
            const secondExact = second.position === position ? 1 : 0;
            if (firstExact !== secondExact) return secondExact - firstExact;

            const firstFener = normalize(first.club ?? "").includes("fenerbahce") ? 1 : 0;
            const secondFener = normalize(second.club ?? "").includes("fenerbahce") ? 1 : 0;
            if (firstFener !== secondFener) return secondFener - firstFener;

            return (second.rating ?? 0) - (first.rating ?? 0);
        });

        return {
            results: matches.slice(0, 60),
            matchCount: matches.length,
        };
    }, [deferredQuery, filter, players, position]);

    if (!open) return null;

    return (
        <div className={styles.overlay} role="presentation">
            <button
                type="button"
                className={styles.backdrop}
                onClick={onClose}
                aria-label="Oyuncu veritabanını kapat"
            />

            <Command
                className={styles.dialog}
                shouldFilter={false}
                label="Oyuncu veritabanı"
            >
                <header className={styles.header}>
                    <div className={styles.headerIcon}>
                        <Database size={21} />
                    </div>
                    <div>
                        <span>GLOBAL OYUNCU VERİTABANI</span>
                        <h2>
                            {position ? `${position} pozisyonuna oyuncu ekle` : "Oyuncu seç"}
                        </h2>
                        <p>
                            İsme veya kulübe göre ara; seçtiğin oyuncu aktif saha
                            konumuna yerleşir.
                        </p>
                    </div>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Kapat"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className={styles.searchArea}>
                    <div className={styles.searchBox}>
                        <Search size={19} />
                        <Command.Input
                            value={query}
                            onValueChange={setQuery}
                            placeholder="Oyuncu veya kulüp ara..."
                            autoFocus
                        />
                        {loading && <Loader2 className={styles.spinner} size={18} />}
                    </div>

                    <div className={styles.filters} aria-label="Pozisyon filtreleri">
                        {FILTERS.map((item) => (
                            <button
                                type="button"
                                key={item.id}
                                className={filter === item.id ? styles.filterActive : styles.filter}
                                onClick={() => setFilter(item.id)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.resultMeta}>
                    <span>
                        <Users size={15} />
                        {loading
                            ? "Oyuncular hazırlanıyor..."
                            : `${matchCount.toLocaleString("tr-TR")} eşleşme`}
                    </span>
                    {!loading && matchCount > 60 && (
                        <small>En uygun ilk 60 sonuç gösteriliyor</small>
                    )}
                </div>

                <Command.List className={styles.list}>
                    {loadError && (
                        <div className={styles.stateMessage}>
                            <AlertCircle size={28} />
                            <strong>Veritabanı açılamadı</strong>
                            <span>Sayfayı yenileyip tekrar deneyebilirsin.</span>
                        </div>
                    )}

                    {loading && (
                        <div className={styles.loadingGrid} aria-label="Oyuncular yükleniyor">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <span key={index} />
                            ))}
                        </div>
                    )}

                    {!loading && !loadError && results.length === 0 && (
                        <Command.Empty className={styles.stateMessage}>
                            <Search size={28} />
                            <strong>Oyuncu bulunamadı</strong>
                            <span>Arama metnini veya pozisyon filtresini değiştir.</span>
                        </Command.Empty>
                    )}

                    {!loading &&
                        results.map((player) => {
                            const selected = String(player.id) === String(currentPlayerId);
                            return (
                                <Command.Item
                                    key={player.id}
                                    value={String(player.id)}
                                    className={
                                        selected ? styles.playerResultSelected : styles.playerResult
                                    }
                                    onSelect={() => onSelect(player)}
                                >
                                    <PlayerJersey player={player} />
                                    <span className={styles.playerCopy}>
                                        <strong>{player.name}</strong>
                                        <small>{player.club || "Kulüp bilgisi yok"}</small>
                                    </span>
                                    <span className={styles.positionBadge}>{player.position}</span>
                                    <span className={styles.rating}>
                                        <small>GEN</small>
                                        <strong>{player.rating || "—"}</strong>
                                    </span>
                                </Command.Item>
                            );
                        })}
                </Command.List>

                <footer className={styles.footer}>
                    <span>
                        Yerel görseller · {players.length.toLocaleString("tr-TR")} oyuncu
                    </span>
                    {canRemove && (
                        <button type="button" className={styles.removeButton} onClick={onRemove}>
                            <Trash2 size={16} />
                            Seçili oyuncuyu kaldır
                        </button>
                    )}
                </footer>
            </Command>
        </div>
    );
}
