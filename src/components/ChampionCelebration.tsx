'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DuelPlayer } from '@/data/duelPlayers';
import { Trophy, Share2, RotateCcw } from 'lucide-react';

interface ChampionCelebrationProps {
    champion: DuelPlayer;
    onPlayAgain: () => void;
}

// Generate confetti pieces
const generateConfetti = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        size: 8 + Math.random() * 12,
        color: ['#f6eb16', '#002d72', '#00d4ff', '#ffffff', '#ffd700'][Math.floor(Math.random() * 5)],
        rotation: Math.random() * 360,
    }));
};

export default function ChampionCelebration({ champion, onPlayAgain }: ChampionCelebrationProps) {
    const [confetti, setConfetti] = useState<ReturnType<typeof generateConfetti>>([]);
    const [showShare, setShowShare] = useState(false);

    useEffect(() => {
        setConfetti(generateConfetti(50));
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            {/* Animated Background */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-fb-navy via-fb-dark to-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            />

            {/* Pulsing Glow Background */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(246, 235, 22, 0.15) 0%, transparent 60%)',
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Confetti */}
            {confetti.map((piece) => (
                <motion.div
                    key={piece.id}
                    className="absolute top-0 pointer-events-none"
                    style={{
                        left: `${piece.x}%`,
                        width: piece.size,
                        height: piece.size,
                        backgroundColor: piece.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    }}
                    initial={{ y: -50, rotate: 0, opacity: 1 }}
                    animate={{
                        y: '100vh',
                        rotate: piece.rotation + 720,
                        opacity: [1, 1, 0],
                    }}
                    transition={{
                        duration: piece.duration,
                        delay: piece.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            ))}

            {/* Content Container */}
            <motion.div
                className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
                {/* Trophy Icon */}
                <motion.div
                    className="mb-6"
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <Trophy className="w-16 h-16 md:w-20 md:h-20 text-fb-yellow drop-shadow-lg" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    className="font-bebas text-4xl md:text-6xl lg:text-7xl text-white tracking-wider mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, delay: 0.5 }}
                >
                    FENERAJANS
                </motion.h1>
                <motion.h2
                    className="font-bebas text-5xl md:text-7xl lg:text-8xl text-fb-yellow tracking-wider mb-8"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, delay: 0.7 }}
                >
                    ŞAMPİYONUN!
                </motion.h2>

                {/* Champion Card */}
                <motion.div
                    className="relative mb-8"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                >
                    {/* Glow Ring */}
                    <motion.div
                        className="absolute -inset-4 rounded-2xl"
                        style={{
                            background: 'linear-gradient(135deg, #f6eb16, #002d72, #00d4ff, #f6eb16)',
                            filter: 'blur(20px)',
                        }}
                        animate={{
                            opacity: [0.5, 0.8, 0.5],
                            rotate: [0, 360],
                        }}
                        transition={{
                            opacity: { duration: 2, repeat: Infinity },
                            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                        }}
                    />

                    {/* Card */}
                    <div className="relative glass-card-tournament rounded-2xl overflow-hidden p-1">
                        <div className="relative w-48 md:w-56 aspect-[3/4] rounded-xl overflow-hidden">
                            <img
                                src={champion.image}
                                alt={champion.name}
                                className="w-full h-full object-cover object-top"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/bull-icon.png';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-fb-navy/90 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                                <h3 className="font-bebas text-xl md:text-2xl text-white tracking-wider">
                                    {champion.name.toUpperCase()}
                                </h3>
                                <p className="text-fb-yellow text-sm font-bold">
                                    {champion.position} – {champion.era}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="flex items-center justify-center gap-6 mb-8 text-white/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <div className="text-center">
                        <span className="block font-bold text-2xl text-fb-yellow">{champion.apps}</span>
                        <span className="text-xs uppercase tracking-wider">Maç</span>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="text-center">
                        <span className="block font-bold text-2xl text-fb-yellow">{champion.goals}</span>
                        <span className="text-xs uppercase tracking-wider">Gol</span>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="text-center">
                        <span className="block font-bold text-2xl text-fb-yellow">{champion.trophies}</span>
                        <span className="text-xs uppercase tracking-wider">Kupa</span>
                    </div>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                >
                    <button
                        onClick={onPlayAgain}
                        className="flex items-center gap-2 bg-fb-yellow text-fb-navy font-bold px-8 py-3 rounded-full
                       shadow-lg shadow-fb-yellow/30 hover:shadow-fb-yellow/50 hover:scale-105
                       transition-all duration-300"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Tekrar Oyna
                    </button>

                    <button
                        onClick={() => setShowShare(true)}
                        className="flex items-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-full
                       border border-white/20 hover:bg-white/20 hover:scale-105
                       transition-all duration-300"
                    >
                        <Share2 className="w-5 h-5" />
                        Şampiyonu Paylaş
                    </button>
                </motion.div>

                {/* Share Tooltip */}
                {showShare && (
                    <motion.p
                        className="mt-4 text-white/60 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        Paylaşım özelliği yakında! 🏆
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
}
