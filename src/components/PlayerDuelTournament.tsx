'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TournamentCard from './TournamentCard';
import ChampionCelebration from './ChampionCelebration';
import { DuelPlayer, duelPlayers } from '@/data/duelPlayers';
import { RotateCcw } from 'lucide-react';

interface DuelHistory {
    winner: DuelPlayer;
    loser: DuelPlayer;
    duelNumber: number;
}

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get round name
function getRoundName(playersRemaining: number): string {
    if (playersRemaining === 2) return 'FİNAL';
    if (playersRemaining <= 4) return 'YARI FİNAL';
    if (playersRemaining <= 8) return 'ÇEYREK FİNAL';
    if (playersRemaining <= 16) return 'SON 16';
    if (playersRemaining <= 32) return 'SON 32';
    return 'ELEME TURU';
}

export default function PlayerDuelTournament() {
    const [activePlayers, setActivePlayers] = useState<DuelPlayer[]>([]);
    const [eliminatedIds, setEliminatedIds] = useState<Set<string>>(new Set());
    const [currentPair, setCurrentPair] = useState<[DuelPlayer, DuelPlayer] | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [duelsCompleted, setDuelsCompleted] = useState(0);
    const [history, setHistory] = useState<DuelHistory[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [champion, setChampion] = useState<DuelPlayer | null>(null);

    const TOTAL_PLAYERS = 40;
    const TOTAL_DUELS = TOTAL_PLAYERS - 1; // 39 duels needed

    // Initialize tournament
    const initTournament = useCallback(() => {
        // Get 40 players (use full list or duplicate if needed)
        let players = [...duelPlayers];
        while (players.length < TOTAL_PLAYERS) {
            players = [...players, ...duelPlayers.slice(0, TOTAL_PLAYERS - players.length)];
        }
        players = shuffleArray(players.slice(0, TOTAL_PLAYERS));

        setActivePlayers(players);
        setEliminatedIds(new Set());
        setCurrentPair([players[0], players[1]]);
        setSelectedId(null);
        setDuelsCompleted(0);
        setHistory([]);
        setChampion(null);
        setIsTransitioning(false);
    }, []);

    // Initialize on mount
    useEffect(() => {
        initTournament();
    }, [initTournament]);

    // Get next pair from remaining players
    const getNextPair = useCallback(
        (remainingPlayers: DuelPlayer[], excludeIds: string[] = []): [DuelPlayer, DuelPlayer] | null => {
            const pool = remainingPlayers.filter((p) => !excludeIds.includes(p.id));
            if (pool.length < 2) return null;
            const shuffled = shuffleArray(pool);
            return [shuffled[0], shuffled[1]];
        },
        []
    );

    // Handle player selection
    const handleSelect = (player: DuelPlayer) => {
        if (isTransitioning || !currentPair) return;

        const winner = player;
        const loser = currentPair[0].id === player.id ? currentPair[1] : currentPair[0];

        setSelectedId(player.id);
        setIsTransitioning(true);

        // Add to history
        setHistory((prev) => [
            {
                winner,
                loser,
                duelNumber: duelsCompleted + 1,
            },
            ...prev.slice(0, 3),
        ]);

        // Update game state after animation
        setTimeout(() => {
            const newEliminated = new Set(eliminatedIds);
            newEliminated.add(loser.id);
            setEliminatedIds(newEliminated);

            const remaining = activePlayers.filter((p) => !newEliminated.has(p.id));
            setActivePlayers(remaining);

            const newDuelsCompleted = duelsCompleted + 1;
            setDuelsCompleted(newDuelsCompleted);

            // Check for champion - the WINNER of this duel is the champion
            if (remaining.length === 1) {
                setChampion(winner);
                return;
            }

            // Get next pair
            const nextPair = getNextPair(remaining, [winner.id]);
            if (nextPair) {
                setCurrentPair(nextPair);
            }

            setSelectedId(null);
            setIsTransitioning(false);
        }, 1000); // Wait for card animation
    };

    // Progress percentage - cap at 100%
    const progress = Math.min((duelsCompleted / TOTAL_DUELS) * 100, 100);
    const playersRemaining = TOTAL_PLAYERS - eliminatedIds.size;
    const roundName = getRoundName(playersRemaining);

    // Show champion celebration
    if (champion) {
        return <ChampionCelebration champion={champion} onPlayAgain={initTournament} />;
    }

    return (
        <div className="min-h-[calc(100vh-140px)] flex flex-col items-center px-4 py-6 md:py-10">
            {/* Header */}
            <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="font-bebas text-3xl md:text-5xl lg:text-6xl text-white tracking-wider drop-shadow-lg">
                    OYUNCU DÜELLO TURNUVASI
                </h1>
                <p className="text-fb-yellow/90 text-sm md:text-base mt-2 tracking-wide">
                    Sadece bir FenerAjans şampiyonu kalana kadar favorini seç.
                </p>
            </motion.div>

            {/* Progress Info */}
            <motion.div
                className="w-full max-w-2xl mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {/* Round Name */}
                <div className="text-center mb-3">
                    <span className="bg-fb-yellow/20 text-fb-yellow px-4 py-1 rounded-full text-sm font-bold tracking-wider">
                        {roundName}
                    </span>
                </div>

                {/* Stats Row */}
                <div className="flex justify-center gap-6 text-white/70 text-sm mb-3">
                    <span>
                        Düello: <span className="text-fb-yellow font-bold">{Math.min(duelsCompleted + 1, TOTAL_DUELS)}</span> / {TOTAL_DUELS}
                    </span>
                    <span>
                        Oyuncular: <span className="text-fb-yellow font-bold">{playersRemaining}</span> / {TOTAL_PLAYERS}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-fb-yellow to-fb-light rounded-full"
                        style={{ width: `${progress}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                </div>
            </motion.div>

            {/* Duel Cards */}
            <AnimatePresence mode="wait">
                {currentPair && (
                    <motion.div
                        key={`${currentPair[0].id}-${currentPair[1].id}`}
                        className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full max-w-5xl px-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                    >
                        <TournamentCard
                            player={currentPair[0]}
                            onSelect={() => handleSelect(currentPair[0])}
                            isSelected={selectedId === currentPair[0].id}
                            isEliminated={false}
                            disabled={isTransitioning}
                        />

                        {/* VS Badge */}
                        <div className="flex-shrink-0">
                            <motion.div
                                className="bg-gradient-to-br from-fb-yellow to-fb-light text-fb-navy font-bebas text-2xl md:text-3xl
                           w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center
                           shadow-lg shadow-fb-yellow/30 border-2 border-white/20"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                VS
                            </motion.div>
                        </div>

                        <TournamentCard
                            player={currentPair[1]}
                            onSelect={() => handleSelect(currentPair[1])}
                            isSelected={selectedId === currentPair[1].id}
                            isEliminated={false}
                            disabled={isTransitioning}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Helper Text */}
            <motion.p
                className="text-white/50 text-sm mt-6 tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Diğerini elemek için bir oyuncuya dokun.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
                className="flex items-center gap-4 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <button
                    onClick={initTournament}
                    className="flex items-center gap-2 text-white/40 hover:text-red-400 text-sm
                     transition-colors"
                >
                    <RotateCcw className="w-4 h-4" />
                    Turnuvayı Yeniden Başlat
                </button>
            </motion.div>

            {/* History Strip */}
            {history.length > 0 && (
                <motion.div
                    className="mt-8 w-full max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-3 text-center">
                        Son Elenenler
                    </p>
                    <div className="flex justify-center gap-3 md:gap-4 overflow-x-auto pb-2">
                        {history.map((duel, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 bg-white/5 rounded-lg p-2 shrink-0"
                            >
                                {/* Winner */}
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 border-fb-yellow">
                                    <img
                                        src={duel.winner.image}
                                        alt={duel.winner.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/bull-icon.png';
                                        }}
                                    />
                                </div>

                                <span className="text-fb-yellow text-xs font-bold">✓</span>

                                {/* Loser */}
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 border-white/10 opacity-40 grayscale">
                                    <img
                                        src={duel.loser.image}
                                        alt={duel.loser.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/bull-icon.png';
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
