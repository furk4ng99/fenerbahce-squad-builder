'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Link2, Users } from 'lucide-react';

const STORAGE_KEY = 'superkupa2025_celebration_seen_v1';

export default function SuperKupaCelebration() {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

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

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    >
                        <div className="relative bg-gradient-to-br from-fb-navy via-fb-dark to-fb-navy rounded-2xl shadow-2xl border border-fb-yellow/30 overflow-hidden">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-fb-yellow/20 via-fb-yellow/10 to-fb-yellow/20 blur-xl opacity-50" />

                            {/* Content */}
                            <div className="relative p-6 md:p-8">
                                {/* Close button */}
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 p-1 text-white/60 hover:text-white transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Trophy icon with animation */}
                                <motion.div
                                    className="flex justify-center mb-4"
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
                                        <Trophy className="w-16 h-16 md:w-20 md:h-20 text-fb-yellow drop-shadow-lg" />
                                        <div className="absolute inset-0 animate-ping">
                                            <Trophy className="w-16 h-16 md:w-20 md:h-20 text-fb-yellow/30" />
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
                                    className="font-bebas text-4xl md:text-5xl text-center text-fb-yellow tracking-wider mb-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    ŞAMPİYONU!
                                </motion.h1>

                                {/* Subtitle / Score */}
                                <motion.div
                                    className="text-center mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <p className="text-white/80 text-sm md:text-base font-medium">
                                        Fenerbahçe
                                    </p>
                                    <p className="text-fb-yellow font-bold text-lg md:text-xl mt-1">
                                        Galatasaray 0 - 2 Fenerbahçe
                                    </p>
                                </motion.div>

                                {/* Buttons */}
                                <motion.div
                                    className="flex flex-col sm:flex-row gap-3 justify-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <button
                                        onClick={handleClose}
                                        className="flex items-center justify-center gap-2 bg-fb-yellow text-fb-navy font-bold px-6 py-3 rounded-full
                                                   shadow-lg shadow-fb-yellow/30 hover:shadow-fb-yellow/50 hover:scale-105
                                                   transition-all duration-300"
                                    >
                                        <Users className="w-5 h-5" />
                                        Kadroya Git
                                    </button>

                                    <button
                                        onClick={handleCopyLink}
                                        className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-full
                                                   border border-white/20 hover:bg-white/20 hover:scale-105
                                                   transition-all duration-300"
                                    >
                                        <Link2 className="w-5 h-5" />
                                        {copied ? 'Kopyalandı!' : 'Linki Kopyala'}
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
