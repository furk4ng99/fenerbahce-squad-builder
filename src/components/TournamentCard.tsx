'use client';

import { useState, useRef, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { DuelPlayer } from '@/data/duelPlayers';

interface TournamentCardProps {
    player: DuelPlayer;
    onSelect: () => void;
    isSelected: boolean;
    isEliminated: boolean;
    disabled: boolean;
}

export default function TournamentCard({
    player,
    onSelect,
    isSelected,
    isEliminated,
    disabled,
}: TournamentCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [isHovering, setIsHovering] = useState(false);

    // Track mouse position for 3D tilt
    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || disabled) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
        setIsHovering(false);
        setMousePosition({ x: 0.5, y: 0.5 });
    };

    // Calculate 3D rotation based on mouse position
    const rotateX = isHovering ? (mousePosition.y - 0.5) * -15 : 0;
    const rotateY = isHovering ? (mousePosition.x - 0.5) * 15 : 0;

    return (
        <motion.div
            ref={cardRef}
            className={`
        tournament-card relative flex flex-col items-center justify-start
        w-full max-w-[300px] md:max-w-[340px] lg:max-w-[360px]
        rounded-2xl overflow-visible cursor-pointer
        ${isEliminated ? 'opacity-30 grayscale pointer-events-none' : ''}
        ${disabled && !isSelected ? 'pointer-events-none' : ''}
      `}
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
            }}
            onClick={disabled ? undefined : onSelect}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            whileTap={disabled ? {} : { scale: 0.97 }}
            animate={
                isSelected
                    ? {
                        scale: [1, 1.08, 1.03],
                    }
                    : {}
            }
            transition={{ duration: 0.3 }}
        >


            {/* Card Inner */}
            <motion.div
                className="relative z-10 w-full h-full rounded-2xl overflow-hidden glass-card-tournament"
                style={{
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    transition: 'transform 0.1s ease-out',
                }}
            >
                {/* Spotlight Effect - REMOVED per user request */}

                {/* Card Gradient Overlay - Static */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-fb-navy/95 z-10 pointer-events-none" />

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
                <div className="relative z-20 w-full p-4 md:p-5 -mt-24 flex flex-col items-center text-center">
                    {/* Name */}
                    <h3 className="font-bebas text-2xl md:text-3xl text-white tracking-wider drop-shadow-lg">
                        {player.name.toUpperCase()}
                    </h3>

                    {/* Position & Era */}
                    <p className="text-fb-yellow font-bold text-sm md:text-base tracking-wide mt-1">
                        {player.position} – {player.era}
                    </p>

                    {/* Stats Line */}
                    <div className="flex items-center justify-center gap-3 md:gap-4 mt-3 text-white/80 text-xs md:text-sm">
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-white text-base md:text-lg">{player.apps}</span>
                            <span className="uppercase tracking-wider opacity-70 text-[10px]">Maç</span>
                        </div>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-white text-base md:text-lg">{player.goals}</span>
                            <span className="uppercase tracking-wider opacity-70 text-[10px]">Gol</span>
                        </div>
                        <div className="w-px h-6 bg-white/20" />
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-white text-base md:text-lg">{player.trophies}</span>
                            <span className="uppercase tracking-wider opacity-70 text-[10px]">Kupa</span>
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
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', damping: 12 }}
                        >
                            KAZANDI!
                        </motion.div>
                    </motion.div>
                )}

                {/* Eliminated Overlay */}
                {isEliminated && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60">
                        <span className="font-bebas text-2xl text-red-500 rotate-[-15deg]">ELENDİ</span>
                    </div>
                )}
            </motion.div>

            {/* Floating Shadow */}
            <div
                className={`
          absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-8 rounded-full
          bg-black/40 blur-xl transition-all duration-300 -z-10
          ${isHovering ? 'opacity-80 scale-110' : 'opacity-40 scale-100'}
        `}
            />
        </motion.div>
    );
}
