"use client";

import { useState, useMemo, useEffect } from "react";
import { players } from "@/data/players";
import { Player, Position } from "@/types";
import PlayerCard from "./PlayerCard";
import { Search, X, Trash2 } from "lucide-react";
import { useSquadStore } from "@/store/useSquadStore";
import { cn } from "@/lib/utils";

// Normalize Turkish characters to their ASCII equivalents for search
function normalizeTurkish(str: string): string {
    const turkishMap: Record<string, string> = {
        'ç': 'c', 'Ç': 'C',
        'ğ': 'g', 'Ğ': 'G',
        'ı': 'i', 'I': 'I',
        'İ': 'I', 'i': 'i',
        'ö': 'o', 'Ö': 'O',
        'ş': 's', 'Ş': 'S',
        'ü': 'u', 'Ü': 'U',
        'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a',
        'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
        'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
        'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o',
        'ú': 'u', 'ù': 'u', 'û': 'u',
        'ñ': 'n', 'Ñ': 'N',
        'ý': 'y', 'ÿ': 'y',
    };
    return str.split('').map(char => turkishMap[char] || char).join('');
}

interface PlayerSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (player: Player | null) => void;
    position?: string;
    currentPlayer?: Player | null;
    onRemove?: () => void;
}

type Tab = "ALL" | "GK" | "DEF" | "MID" | "FWD";

const TABS: { id: Tab; label: string; positions: Position[] }[] = [
    { id: "ALL", label: "Tümü", positions: [] },
    { id: "GK", label: "Kaleci", positions: ["GK"] },
    { id: "DEF", label: "Defans", positions: ["LB", "RB", "CB", "LWB", "RWB"] },
    { id: "MID", label: "Orta Saha", positions: ["CDM", "CM", "CAM", "LM", "RM"] },
    { id: "FWD", label: "Forvet", positions: ["LW", "RW", "ST"] },
];

const POSITION_MAPPING: Record<string, string[]> = {
    DEF: ["CB", "LB", "RB", "LWB", "RWB"],
    MID: ["CDM", "CM", "CAM", "LM", "RM"],
    FWD: ["ST", "CF", "LW", "RW"],
    GK: ["GK"],
};

function getTabForPosition(pos?: string): Tab {
    if (!pos) return "ALL";
    const p = pos as Position;
    if (["GK"].includes(p)) return "GK";
    if (["LB", "RB", "CB", "LWB", "RWB"].includes(p)) return "DEF";
    if (["CDM", "CM", "CAM", "LM", "RM"].includes(p)) return "MID";
    if (["LW", "RW", "ST"].includes(p)) return "FWD";
    return "ALL";
}

export default function PlayerSelector({
    isOpen,
    onClose,
    onSelect,
    position,
    currentPlayer,
    onRemove,
}: PlayerSelectorProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<Tab>("ALL");
    const [apiPlayers, setApiPlayers] = useState<Player[]>([]);
    const [globalPlayers, setGlobalPlayers] = useState<Player[]>([]);
    const [isSearchingAPI, setIsSearchingAPI] = useState(false);
    const [globalPlayersLoaded, setGlobalPlayersLoaded] = useState(false);

    // Set initial tab based on the requested position
    useEffect(() => {
        if (isOpen && position) {
            setActiveTab(getTabForPosition(position));
        } else {
            setActiveTab("ALL");
        }
        setSearchTerm("");
    }, [isOpen, position]);

    // Load Fenerbahce squad on mount
    useEffect(() => {
        setIsSearchingAPI(true);
        fetch('/data/fenerbahce-players.json')
            .then(res => res.json())
            .then(data => {
                if (data.players) {
                    setApiPlayers(data.players);
                }
            })
            .catch(error => console.error("Failed to fetch players:", error))
            .finally(() => setIsSearchingAPI(false));
    }, []);

    // Load global players when user searches (3+ characters)
    useEffect(() => {
        if (searchTerm.length >= 3 && !globalPlayersLoaded) {
            setIsSearchingAPI(true);
            fetch('/data/global-players.json')
                .then(res => res.json())
                .then(data => {
                    if (data.players) {
                        setGlobalPlayers(data.players);
                        setGlobalPlayersLoaded(true);
                    }
                })
                .catch(error => console.error("Failed to fetch global players:", error))
                .finally(() => setIsSearchingAPI(false));
        }
    }, [searchTerm, globalPlayersLoaded]);


    const { primaryMatches, otherMatches, isSearching } = useMemo(() => {
        // Combine players based on search mode
        const hasSearchTerm = searchTerm.length > 0;
        const isGlobalSearch = searchTerm.length >= 3;

        // When searching globally (3+ chars), include global players
        let source: Player[];
        if (isGlobalSearch) {
            source = [...players, ...apiPlayers, ...globalPlayers];
        } else if (hasSearchTerm) {
            source = [...players, ...apiPlayers];
        } else {
            source = [...apiPlayers];
        }

        // Remove duplicates
        source = Array.from(new Map(source.map(p => [p.id, p])).values());

        const isSearching = hasSearchTerm;

        // 1. Filter by Search Term
        if (isSearching) {
            const normalizedSearch = normalizeTurkish(searchTerm.toLowerCase());
            source = source.filter((p) => {
                const normalizedName = normalizeTurkish(p.name.toLowerCase());
                const normalizedClub = p.club ? normalizeTurkish(p.club.toLowerCase()) : '';
                return normalizedName.includes(normalizedSearch) ||
                    normalizedClub.includes(normalizedSearch);
            });
        }

        // 2. Filter by Tab
        if (activeTab !== "ALL") {
            const tabPositions = TABS.find((t) => t.id === activeTab)?.positions || [];
            source = source.filter((p) => tabPositions.includes(p.position));
        }

        // 3. Split into Primary (Exact Position) and Others
        const primary: Player[] = [];
        const others: Player[] = [];

        // Add "Transfer Lazım" option if not searching or if it matches search
        const transferLazimPlayer: Player = {
            id: "transfer-lazim",
            name: "Transfer Lazım",
            position: (position as Position) || "ST", // Adapt to current position
            rating: 0,
            value: 0,
            image: "/transfer-lazim.png",
            club: "Fenerbahçe"
        };

        const showTransferLazim = !isSearching ||
            "transfer lazım".includes(searchTerm.toLowerCase()) ||
            "transfer lazim".includes(searchTerm.toLowerCase());

        if (showTransferLazim) {
            // Always add to primary if it's shown
            primary.push(transferLazimPlayer);
        }

        source.forEach((p) => {
            if (position && p.position === position) {
                primary.push(p);
            } else {
                others.push(p);
            }
        });

        return { primaryMatches: primary, otherMatches: others, isSearching };
    }, [searchTerm, activeTab, position, apiPlayers, globalPlayers]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-center items-center md:items-start md:pt-[5vh] bg-black/80 backdrop-blur-sm p-2 md:p-4 animate-in fade-in duration-200">
            <div className="bg-[#f0f2f5] w-full max-w-5xl rounded-xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] md:h-[85vh]">
                {/* Header */}
                <div className="bg-fb-navy p-4 flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white font-bebas tracking-wide flex items-center gap-2">
                            OYUNCU SEÇ {position && <span className="text-fb-yellow">({position})</span>}
                        </h3>
                        <p className="text-xs text-blue-200 mt-0.5">
                            {isSearching ? "Tüm veritabanında aranıyor" : "Fenerbahçe kadrosu görüntüleniyor"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {currentPlayer && onRemove && (
                            <button
                                onClick={() => {
                                    if (window.confirm("Oyuncuyu kaldırmak istediğinize emin misiniz?")) {
                                        onRemove();
                                    }
                                }}
                                className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors mr-2 shadow-md border border-red-500"
                            >
                                <Trash2 size={14} />
                                <span className="hidden sm:inline">KALDIR</span>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Controls: Search & Tabs */}
                <div className="bg-white border-b border-gray-200 shrink-0 shadow-sm z-10">
                    <div className="p-4 pb-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Oyuncu ara... (Global arama için en az 3 karakter)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-fb-navy focus:ring-2 focus:ring-fb-navy/20 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400 bg-gray-50"
                                autoFocus
                            />
                            {isSearchingAPI && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-fb-navy border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex px-4 overflow-x-auto hide-scrollbar gap-2 pb-3">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all",
                                    activeTab === tab.id
                                        ? "bg-fb-navy text-white shadow-md"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Player List */}
                <div className="flex-1 overflow-y-auto min-h-0 p-4 bg-[#f0f2f5] custom-scrollbar">
                    {primaryMatches.length === 0 && otherMatches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <Search size={48} className="mb-4 opacity-20" />
                            <p className="text-lg font-medium">Oyuncu bulunamadı</p>
                            <p className="text-sm text-gray-400 mt-1">
                                {searchTerm.length > 0 && searchTerm.length < 3
                                    ? "Global arama için en az 3 karakter yazın."
                                    : "Arama kriterlerinizi değiştirin."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8 pb-8">
                            {/* Primary Matches (Exact Position) */}
                            {primaryMatches.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3 px-1">
                                        <div className="h-4 w-1 bg-fb-yellow rounded-full" />
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                            Bu Pozisyon İçin ({position})
                                        </h4>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                        {primaryMatches.map((player) => (
                                            <PlayerCard
                                                key={player.id}
                                                player={player}
                                                onClick={() => onSelect(player)}
                                                isSelected={currentPlayer?.id === player.id}
                                                positionLabel={player.position}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other Matches (Out of Position / Suggestions) */}
                            {otherMatches.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-3 px-1">
                                        <div className="h-4 w-1 bg-gray-300 rounded-full" />
                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                                            {primaryMatches.length > 0 ? "Diğer Seçenekler / Pozisyon Dışı" : "Tüm Oyuncular"}
                                        </h4>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                        {otherMatches.map((player) => (
                                            <div key={player.id} className="opacity-90 hover:opacity-100 transition-opacity">
                                                <PlayerCard
                                                    player={player}
                                                    onClick={() => onSelect(player)}
                                                    isSelected={currentPlayer?.id === player.id}
                                                    positionLabel={player.position}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
