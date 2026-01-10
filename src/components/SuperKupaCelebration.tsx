'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const STORAGE_KEY = 'superkupa2025_celebration_seen_v1';
const POSTER_PATH = '/assets/superkupa-2025-sampiyon.jpg';

export default function SuperKupaCelebration() {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Check if we should show the celebration
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const hasSeenCelebration = localStorage.getItem(STORAGE_KEY);
        if (!hasSeenCelebration) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                localStorage.setItem(STORAGE_KEY, '1');
                triggerConfetti();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, []);

    // Focus trap and ESC key handler
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        // Focus the close button when modal opens
        closeButtonRef.current?.focus();

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const triggerConfetti = useCallback(async () => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const confetti = (await import('canvas-confetti')).default;
        const duration = 1800;
        const end = Date.now() + duration;
        const colors = ['#f6eb16', '#002d72', '#ffffff', '#ffd700'];

        const frame = () => {
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

    const handleOpenImage = () => {
        window.open(POSTER_PATH, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="celebration-title"
                >
                    {/* Overlay */}
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        ref={modalRef}
                        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div className="relative bg-gradient-to-br from-fb-navy via-fb-dark to-fb-navy rounded-2xl shadow-2xl border border-fb-yellow/30 overflow-hidden">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-fb-yellow/20 via-fb-yellow/10 to-fb-yellow/20 blur-xl opacity-50 pointer-events-none" />

                            {/* Close button */}
                            <button
                                ref={closeButtonRef}
                                onClick={handleClose}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white/70 hover:text-white hover:bg-black/70 transition-all"
                                aria-label="Kapat"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Content - 2 column on desktop, stacked on mobile */}
                            <div className="relative flex flex-col md:flex-row">
                                {/* Poster Image */}
                                <div className="md:w-1/2 relative">
                                    <div className="relative aspect-[3/4] md:aspect-auto md:h-full min-h-[300px] md:min-h-[500px]">
                                        <Image
                                            src={POSTER_PATH}
                                            alt="Fenerbahçe 2025 Turkcell Süper Kupa Şampiyonu"
                                            fill
                                            className="object-cover object-top"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority={false}
                                        />
                                        {/* Gradient overlay for text readability on mobile */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-fb-navy/80 via-transparent to-transparent md:hidden" />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                                    {/* Title */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <h2
                                            id="celebration-title"
                                            className="font-bebas text-2xl md:text-3xl text-white tracking-wider mb-1"
                                        >
                                            2025 Turkcell Süper Kupa
                                        </h2>
                                        <h1 className="font-bebas text-4xl md:text-5xl lg:text-6xl text-fb-yellow tracking-wider mb-4">
                                            ŞAMPİYONU!
                                        </h1>
                                    </motion.div>

                                    {/* Score */}
                                    <motion.div
                                        className="mb-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <p className="text-white/80 text-base font-medium">
                                            Fenerbahçe
                                        </p>
                                        <p className="text-fb-yellow font-bold text-xl md:text-2xl mt-1">
                                            Galatasaray 0 - 2 Fenerbahçe
                                        </p>
                                    </motion.div>

                                    {/* Buttons */}
                                    <motion.div
                                        className="flex flex-col sm:flex-row gap-3"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Link
                                            href="/kadro-olusturucu"
                                            onClick={handleClose}
                                            className="flex items-center justify-center gap-2 bg-fb-yellow text-fb-navy font-bold px-6 py-3 rounded-full
                                                       shadow-lg shadow-fb-yellow/30 hover:shadow-fb-yellow/50 hover:scale-105
                                                       transition-all duration-300"
                                        >
                                            <Users className="w-5 h-5" />
                                            Kadroya Geç
                                        </Link>

                                        <button
                                            onClick={handleOpenImage}
                                            className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-full
                                                       border border-white/20 hover:bg-white/20 hover:scale-105
                                                       transition-all duration-300"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                            Görseli Aç
                                        </button>
                                    </motion.div>

                                    {/* Close text */}
                                    <motion.div
                                        className="mt-6 text-center md:text-left"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <button
                                            onClick={handleClose}
                                            className="text-white/40 hover:text-white/80 transition-colors text-sm uppercase tracking-widest"
                                        >
                                            veya ESC ile kapat
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
