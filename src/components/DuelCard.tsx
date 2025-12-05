'use client';

import { motion } from 'framer-motion';
import { DuelPlayer } from '@/data/duelPlayers';

interface DuelCardProps {
    player: DuelPlayer;
    side: 'left' | 'right';
    onSelect: () => void;
    isSelected: boolean;
    disabled: boolean;
}

export default function DuelCard({
    player,
    side,
    onSelect,
    isSelected,
    disabled,
}: DuelCardProps) {
    return (
        <motion.div
            className={`
        relative flex flex-col items-center justify-start
        w-full max-w-[320px] md:max-w-[360px]
        rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-300
        glass-card
        ${isSelected ? 'neon-border-active ring-4 ring-fb-yellow/60' : 'neon-border'}
        ${disabled && !isSelected ? 'opacity-50 pointer-events-none' : ''}
      `}
            onClick={disabled ? undefined : onSelect}
            whileHover={disabled ? {} : { scale: 1.03, y: -4 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            animate={
                isSelected
                    ? {
                        scale: [1, 1.05, 1.02],
                        boxShadow: [
                            '0 0 0 rgba(246, 235, 22, 0)',
                            '0 0 40px rgba(246, 235, 22, 0.6)',
                            '0 0 20px rgba(246, 235, 22, 0.4)',
                        ],
                    }
                    : {}
            }
            transition={{ duration: 0.4 }}
            layout
        >
            {/* Card Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-fb-navy/90 z-10 pointer-events-none" />

            {/* Player Image */}
            <div className="relative w-full aspect-[3/4] overflow-hidden">
                <img
                    src={player.image}
                    alt={player.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/bull-icon.png';
                    }}
                />
            </div>

            {/* Player Info */}
            <div className="relative z-20 w-full p-4 md:p-5 -mt-20 flex flex-col items-center text-center">
                {/* Name */}
                <h3 className="font-bebas text-2xl md:text-3xl text-white tracking-wider drop-shadow-lg">
                    {player.name.toUpperCase()}
                </h3>

                {/* Position & Era */}
                <p className="text-fb-yellow font-bold text-sm md:text-base tracking-wide mt-1">
                    {player.position} – {player.era}
                </p>

                {/* Stats Line */}
                <div className="flex items-center justify-center gap-4 mt-3 text-white/80 text-xs md:text-sm">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-white text-lg md:text-xl">{player.apps}</span>
                        <span className="uppercase tracking-wider opacity-70">Maç</span>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-white text-lg md:text-xl">{player.goals}</span>
                        <span className="uppercase tracking-wider opacity-70">Gol</span>
                    </div>
                    <div className="w-px h-8 bg-white/20" />
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-white text-lg md:text-xl">{player.trophies}</span>
                        <span className="uppercase tracking-wider opacity-70">Kupa</span>
                    </div>
                </div>
            </div>

            {/* Selection Overlay */}
            {isSelected && (
                <motion.div
                    className="absolute inset-0 z-30 flex items-center justify-center bg-fb-yellow/20 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="bg-fb-yellow text-fb-navy font-bebas text-xl md:text-2xl px-6 py-2 rounded-full shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12 }}
                    >
                        SEÇİLDİ!
                    </motion.div>
                </motion.div>
            )}

            {/* VS Badge - only show on right card */}
            {side === 'right' && (
                <div className="absolute -left-6 md:-left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex">
                    <div className="bg-fb-yellow text-fb-navy font-bebas text-xl md:text-2xl w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg border-2 border-fb-navy/20">
                        VS
                    </div>
                </div>
            )}
        </motion.div>
    );
}
