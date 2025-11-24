import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerAvatarProps {
    imageUrl?: string;
    name: string;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    showName?: boolean;
    variant?: "default" | "card"; // default for pitch (white text), card for modal (dark text)
}

export function PlayerAvatar({
    imageUrl,
    name,
    className,
    size = "md",
    showName = true,
    variant = "default"
}: PlayerAvatarProps) {
    // Helper to get proxy URL
    const getProxiedUrl = (url?: string) => {
        if (!url) return undefined;
        if (url.startsWith('data:') || url.startsWith('/') || url.includes('wsrv.nl')) return url;
        return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=200&h=200&fit=cover`;
    };

    const [imageError, setImageError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(getProxiedUrl(imageUrl));

    // Reset state when imageUrl changes
    useEffect(() => {
        setCurrentSrc(getProxiedUrl(imageUrl));
        setImageError(false);
    }, [imageUrl]);

    // Size mappings
    const sizeClasses = {
        sm: "w-10 h-10",
        md: "w-16 h-16 md:w-20 md:h-20", // Pitch default
        lg: "w-24 h-24",
        xl: "w-32 h-32"
    };

    return (
        <div className={cn("flex flex-col items-center gap-1", className)}>
            {/* Avatar Circle */}
            <div className={cn(
                "relative rounded-full overflow-hidden border-[3px] border-white shadow-lg bg-gray-200 flex items-center justify-center shrink-0",
                sizeClasses[size]
            )}>
                {imageUrl && !imageError ? (
                    <img
                        src={currentSrc}
                        alt={name}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <User className="w-1/2 h-1/2 text-gray-400" />
                )}
            </div>

            {/* Player Name */}
            {showName && (
                <div className={cn(
                    "text-xs font-bold text-center leading-tight px-1 z-10",
                    variant === "default"
                        ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] whitespace-nowrap"
                        : "text-gray-900"
                )}>
                    {name}
                </div>
            )}
        </div>
    );
}
