'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';

const STORAGE_KEY = 'superkupa2025_celebration_seen_v1';

export default function SuperKupaCelebration() {
    const [isOpen, setIsOpen] = useState(false);

    // Check if we should show the celebration
    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return;

        const hasSeenCelebration = localStorage.getItem(STORAGE_KEY);
        if (!hasSeenCelebration) {
            // Small delay to let the splash screen finish
            const timer = setTimeout(() => {
                setIsOpen(true);
                localStorage.setItem(STORAGE_KEY, '1');
                triggerConfetti();
            }, 5000); // After 4.5s splash + 0.5s buffer

            return () => clearTimeout(timer);
        }
    }, []);

    const triggerConfetti = useCallback(async () => {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        // Lazy load canvas-confetti
        const confetti = (await import('canvas-confetti')).default;

        const duration = 1800; // ~1.8 seconds
        const end = Date.now() + duration;

        // Fenerbahçe colors
        const colors = ['#f6eb16', '#002d72', '#ffffff', '#ffd700'];

        const frame = () => {
            // Left side burst
            confetti({
                particleCount: 6,
                angle: 60,
                spread: 70,
                startVelocity: 35,
                origin: { x: 0.15, y: 0.25 },
                colors: colors,
                gravity: 1.2,
                scalar: 1.1,
            });

            // Right side burst
            confetti({
                particleCount: 6,
                angle: 120,
                spread: 70,
                startVelocity: 35,
                origin: { x: 0.85, y: 0.25 },
                colors: colors,
                gravity: 1.2,
                scalar: 1.1,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };

        frame();
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Overlay */}
                    <motion.div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="relative z-10 w-full max-w-md"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    >
                        <div className="relative bg-gradient-to-br from-fb-navy via-fb-dark to-fb-navy rounded-2xl shadow-2xl border border-fb-yellow/30 overflow-hidden">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-fb-yellow/20 via-fb-yellow/10 to-fb-yellow/20 blur-xl opacity-50" />

                            {/* Content */}
                            <div className="relative p-8 md:p-10">
                                {/* Close button */}
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                {/* Trophy icon with animation */}
                                <motion.div
                                    className="flex justify-center mb-6"
                                    animate={{
                                        y: [0, -8, 0],
                                        rotate: [0, 3, -3, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                >
                                    <div className="relative">
                                        <Trophy className="w-20 h-20 md:w-24 md:h-24 text-fb-yellow drop-shadow-lg" />
                                        <div className="absolute inset-0 animate-ping">
                                            <Trophy className="w-20 h-20 md:w-24 md:h-24 text-fb-yellow/30" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    className="font-bebas text-2xl md:text-3xl text-center text-white tracking-wider mb-1"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    2025 Turkcell Süper Kupa
                                </motion.h2>
                                <motion.h1
                                    className="font-bebas text-4xl md:text-6xl text-center text-fb-yellow tracking-wider mb-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    ŞAMPİYONU!
                                </motion.h1>

                                {/* Subtitle / Score */}
                                <motion.div
                                    className="text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <p className="text-white/80 text-base md:text-lg font-medium">
                                        Fenerbahçe
                                    </p>
                                    <p className="text-fb-yellow font-bold text-xl md:text-2xl mt-2">
                                        Galatasaray 0 - 2 Fenerbahçe
                                    </p>
                                </motion.div>

                                {/* Simple close text */}
                                <motion.div
                                    className="text-center mt-8"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <button
                                        onClick={handleClose}
                                        className="text-white/50 hover:text-white transition-colors text-sm uppercase tracking-widest font-medium"
                                    >
                                        Kapat
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
