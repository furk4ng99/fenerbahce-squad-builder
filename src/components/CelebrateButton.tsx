'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper } from 'lucide-react';

export default function CelebrateButton() {
    const [showToast, setShowToast] = useState(false);

    const triggerConfetti = useCallback(async () => {
        // Check for reduced motion preference
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Still show toast even with reduced motion
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return;
        }

        // Lazy load canvas-confetti
        const confetti = (await import('canvas-confetti')).default;

        // Fenerbahçe colors
        const colors = ['#f6eb16', '#002d72', '#ffffff', '#ffd700'];

        const duration = 1800;
        const end = Date.now() + duration;

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
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    }, []);

    return (
        <>
            {/* Floating Celebrate Button */}
            <motion.button
                onClick={triggerConfetti}
                className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-fb-yellow text-fb-navy font-bold px-4 py-3 rounded-full
                           shadow-lg shadow-fb-yellow/30 hover:shadow-fb-yellow/50 hover:scale-110
                           transition-all duration-300 text-sm md:text-base"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 5.5, type: 'spring', damping: 15 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Celebrate - trigger confetti"
            >
                <PartyPopper className="w-5 h-5" />
                <span className="hidden sm:inline">Kutla 🎉</span>
            </motion.button>

            {/* Toast notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        className="fixed bottom-24 right-6 z-50 bg-fb-navy text-white px-4 py-2 rounded-lg shadow-lg border border-fb-yellow/30"
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    >
                        <span className="text-fb-yellow font-bold">🏆 Şampiyon Fenerbahçe!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
