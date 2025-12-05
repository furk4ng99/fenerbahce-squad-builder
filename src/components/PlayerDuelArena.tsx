'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DuelCard from './DuelCard';
import {
    DuelPlayer,
    getRandomDuelPair,
} from '@/data/duelPlayers';
import Leaderboard from './Leaderboard';
import { recordPick } from '@/utils/statsStorage';

interface DuelHistory {
    left: DuelPlayer;
    right: DuelPlayer;
    winnerId: string | null;
}

export default function PlayerDuelArena() {
    const [currentDuel, setCurrentDuel] = useState<[DuelPlayer, DuelPlayer] | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [duelsPlayed, setDuelsPlayed] = useState(0);
    const [leftChosen, setLeftChosen] = useState(0);
    const [rightChosen, setRightChosen] = useState(0);
    const [history, setHistory] = useState<DuelHistory[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Initialize first duel
    useEffect(() => {
        const pair = getRandomDuelPair();
        if (pair) setCurrentDuel(pair);
    }, []);

    // Load next duel
    const loadNextDuel = useCallback(
        (currentIds: string[] = []) => {
            const pair = getRandomDuelPair(undefined, currentIds);
            if (pair) {
                setCurrentDuel(pair);
                setSelectedId(null);
                setIsTransitioning(false);
            }
        },
        []
    );

    // Handle player selection
    const handleSelect = (player: DuelPlayer, side: 'left' | 'right') => {
        if (isTransitioning || !currentDuel) return;

        // Record the pick globally
        recordPick(player.id);

        setSelectedId(player.id);
        setIsTransitioning(true);
        setDuelsPlayed((p) => p + 1);

        if (side === 'left') {
            setLeftChosen((c) => c + 1);
        } else {
            setRightChosen((c) => c + 1);
        }

        // Add to history
        setHistory((prev) => [
            {
                left: currentDuel[0],
                right: currentDuel[1],
                winnerId: player.id,
            },
            ...prev.slice(0, 3),
        ]);

        // Load next duel after animation
        setTimeout(() => {
            loadNextDuel([currentDuel[0].id, currentDuel[1].id]);
        }, 800);
    };

    return (
        <div className="min-h-[calc(100vh-140px)] flex flex-col items-center px-4 py-8 md:py-12">
            {/* Header */}
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="font-bebas text-4xl md:text-6xl lg:text-7xl text-white tracking-wider drop-shadow-lg">
                    OYUNCU DÜELLO ARENASI
                </h1>
                <p className="text-fb-yellow/90 text-sm md:text-lg mt-2 tracking-wide">
                    Hangi Fenerbahçe efsanesini seçiyorsun?
                </p>
            </motion.div>

            {/* Duel Cards */}
            <AnimatePresence mode="wait">
                {currentDuel && (
                    <motion.div
                        key={`${currentDuel[0].id}-${currentDuel[1].id}`}
                        className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 w-full max-w-5xl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                    >
                        <DuelCard
                            player={currentDuel[0]}
                            side="left"
                            onSelect={() => handleSelect(currentDuel[0], 'left')}
                            isSelected={selectedId === currentDuel[0].id}
                            disabled={isTransitioning}
                        />

                        {/* VS Badge for mobile/tablet */}
                        <div className="lg:hidden flex items-center justify-center">
                            <div className="bg-fb-yellow text-fb-navy font-bebas text-2xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-fb-navy/20">
                                VS
                            </div>
                        </div>

                        <DuelCard
                            player={currentDuel[1]}
                            side="right"
                            onSelect={() => handleSelect(currentDuel[1], 'right')}
                            isSelected={selectedId === currentDuel[1].id}
                            disabled={isTransitioning}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Helper Text */}
            <motion.p
                className="text-white/60 text-sm md:text-base mt-8 tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Favorini seçmek için dokun
            </motion.p>

            {/* Stats Counter */}
            <motion.div
                className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8 text-white/70 text-xs md:text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <div className="bg-white/5 px-4 py-2 rounded-lg">
                    <span className="font-bold text-fb-yellow">{duelsPlayed}</span> Düello oynandı
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-lg">
                    Sol seçim: <span className="font-bold text-fb-yellow">{leftChosen}</span>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-lg">
                    Sağ seçim: <span className="font-bold text-fb-yellow">{rightChosen}</span>
                </div>
            </motion.div>

            {/* History Strip */}
            {history.length > 0 && (
                <motion.div
                    className="mt-10 w-full max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-3 text-center">
                        Son Düellolar
                    </p>
                    <div className="flex justify-center gap-3 md:gap-4 overflow-x-auto pb-4">
                        {history.map((duel, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 bg-white/5 rounded-lg p-2 shrink-0"
                            >
                                {/* Left Player Thumbnail */}
                                <div
                                    className={`
                    w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2
                    ${duel.winnerId === duel.left.id ? 'border-fb-yellow' : 'border-white/10 opacity-50'}
                  `}
                                >
                                    <img
                                        src={duel.left.image}
                                        alt={duel.left.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/bull-icon.png';
                                        }}
                                    />
                                </div>

                                <span className="text-white/30 text-xs font-bold">vs</span>

                                {/* Right Player Thumbnail */}
                                <div
                                    className={`
                    w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2
                    ${duel.winnerId === duel.right.id ? 'border-fb-yellow' : 'border-white/10 opacity-50'}
                  `}
                                >
                                    <img
                                        src={duel.right.image}
                                        alt={duel.right.name}
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

            {/* Global Leaderboard - Placed at bottom */}
            <div className="mt-16 w-full max-w-2xl">
                <Leaderboard />
            </div>
        </div>
    );
}
