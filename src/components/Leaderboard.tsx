'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DuelPlayer, duelPlayers } from '@/data/duelPlayers';
import { getStats, DuelStats } from '@/utils/statsStorage';

export default function Leaderboard() {
    const [stats, setStats] = useState<DuelStats>({ totalPicks: 0, playerPicks: {} });

    const updateStats = () => {
        setStats(getStats());
    };

    useEffect(() => {
        updateStats();

        // Listen for updates from other components
        window.addEventListener('statsUpdated', updateStats);
        // Also update on storage event (cross-tab)
        window.addEventListener('storage', updateStats);

        return () => {
            window.removeEventListener('statsUpdated', updateStats);
            window.removeEventListener('storage', updateStats);
        };
    }, []);

    // Calculate top players
    const topPlayers = Object.entries(stats.playerPicks)
        .map(([id, picks]) => {
            const player = duelPlayers.find(p => p.id === id);
            return {
                ...player,
                picks,
                pickRate: stats.totalPicks > 0 ? (picks / stats.totalPicks) * 100 : 0
            };
        })
        .filter((p): p is DuelPlayer & { picks: number; pickRate: number } => p !== undefined && !!p.name)
        .sort((a, b) => b.picks - a.picks)
        .slice(0, 6);

    if (topPlayers.length === 0) return null;

    return (
        <motion.div
            className="w-full bg-fb-navy/80 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="p-4 border-b border-white/10 bg-fb-navy/50">
                <h3 className="font-bebas text-xl md:text-2xl text-fb-yellow tracking-wider flex items-center gap-2">
                    <span className="text-white">🏆</span> EN ÇOK SEÇİLENLER
                </h3>
            </div>

            <div className="p-2">
                <div className="flex flex-col gap-1">
                    <AnimatePresence>
                        {topPlayers.map((player, index) => (
                            <motion.div
                                key={player.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                            >
                                {/* Rank */}
                                <div className={`
                                    w-6 h-6 flex items-center justify-center rounded text-xs font-bold
                                    ${index === 0 ? 'bg-fb-yellow text-fb-navy' :
                                        index === 1 ? 'bg-gray-300 text-fb-navy' :
                                            index === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white/60'}
                                `}>
                                    {index + 1}
                                </div>

                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                                    <img
                                        src={player.image}
                                        alt={player.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/bull-icon.png';
                                        }}
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white font-bold text-sm truncate">{player.name}</span>
                                        <span className="text-xs text-white/50 bg-white/10 px-1.5 py-0.5 rounded">{player.position}</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden w-full">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-fb-yellow to-yellow-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${player.pickRate}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="text-right min-w-[50px]">
                                    <div className="text-fb-yellow font-bold text-sm">{player.picks}</div>
                                    <div className="text-[10px] text-white/40">%{player.pickRate.toFixed(1)}</div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <div className="p-3 text-center border-t border-white/10">
                <p className="text-[10px] text-white/40 uppercase tracking-widest">
                    Toplam {stats.totalPicks} seçim yapıldı
                </p>
            </div>
        </motion.div>
    );
}
