"use client";

import { useEffect, useState } from "react";

export default function LoadingSplash() {
    const [isVisible, setIsVisible] = useState(true);
    const [showFener, setShowFener] = useState(false);
    const [showAjans, setShowAjans] = useState(false);
    const [visibleStars, setVisibleStars] = useState(0);

    useEffect(() => {
        // Animation timeline
        const fenerTimer = setTimeout(() => setShowFener(true), 300);
        const ajansTimer = setTimeout(() => setShowAjans(true), 1000);

        // Stars appear one by one from left to right
        const star1Timer = setTimeout(() => setVisibleStars(1), 1700);
        const star2Timer = setTimeout(() => setVisibleStars(2), 1900);
        const star3Timer = setTimeout(() => setVisibleStars(3), 2100);
        const star4Timer = setTimeout(() => setVisibleStars(4), 2300);
        const star5Timer = setTimeout(() => setVisibleStars(5), 2500);

        // Fade out after 4.5 seconds total
        const fadeTimer = setTimeout(() => setIsVisible(false), 4500);

        return () => {
            clearTimeout(fenerTimer);
            clearTimeout(ajansTimer);
            clearTimeout(star1Timer);
            clearTimeout(star2Timer);
            clearTimeout(star3Timer);
            clearTimeout(star4Timer);
            clearTimeout(star5Timer);
            clearTimeout(fadeTimer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            style={{ backgroundColor: "#0B1F87" }}
        >
            <div className="flex flex-col items-center justify-center">
                {/* Stars - positioned above text with proper spacing */}
                <div className="flex gap-4 md:gap-6 mb-8 md:mb-12">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <div
                            key={star}
                            className={`transition-all duration-500 ${visibleStars >= star
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-0"
                                }`}
                        >
                            <svg
                                width="50"
                                height="50"
                                viewBox="0 0 24 24"
                                className="md:w-[70px] md:h-[70px]"
                            >
                                {/* Star with outline */}
                                <path
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                    fill="#FFD700"
                                    stroke="#0B1F87"
                                    strokeWidth="0.5"
                                />
                            </svg>
                        </div>
                    ))}
                </div>

                {/* Text container */}
                <div className="flex flex-col items-center -mt-4">
                    {/* FENER text */}
                    <div
                        className={`text-7xl md:text-[140px] lg:text-[180px] font-black leading-none transition-all duration-700 ${showFener
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-8"
                            }`}
                        style={{
                            fontFamily: "var(--font-bebas)",
                            color: "#FFD700",
                            letterSpacing: "0.05em",
                            fontWeight: 900,
                        }}
                    >
                        FENER
                    </div>

                    {/* AJANS text - minimal spacing below FENER */}
                    <div
                        className={`text-7xl md:text-[140px] lg:text-[180px] font-black leading-none -mt-2 md:-mt-4 transition-all duration-700 ${showAjans
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-8"
                            }`}
                        style={{
                            fontFamily: "var(--font-bebas)",
                            color: "#FFD700",
                            letterSpacing: "0.05em",
                            fontWeight: 900,
                        }}
                    >
                        AJANS
                    </div>
                </div>
            </div>
        </div>
    );
}
