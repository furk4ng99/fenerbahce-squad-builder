import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerAvatarProps {
    imageUrl?: string;
    imageSprite?: {
        column: number;
        row: number;
        columns: number;
        rows: number;
    };
    name: string;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    showName?: boolean;
    variant?: "default" | "card"; // default for pitch (white text), card for modal (dark text)
}

export function PlayerAvatar({
    imageUrl,
    imageSprite,
    name,
    className,
    size = "md",
    showName = true,
    variant = "default"
}: PlayerAvatarProps) {
    const [imageError, setImageError] = useState(false);

    // Reset state when imageUrl changes
    useEffect(() => {
        setImageError(false);
    }, [imageUrl, imageSprite]);

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
                {imageUrl && imageSprite && !imageError ? (
                    <div
                        role="img"
                        aria-label={name}
                        className="w-full h-full bg-no-repeat"
                        style={{
                            backgroundImage: `url(${imageUrl})`,
                            backgroundSize: `${imageSprite.columns * 100}% ${imageSprite.rows * 100}%`,
                            backgroundPositionX: imageSprite.columns === 1
                                ? "0%"
                                : `${(imageSprite.column / (imageSprite.columns - 1)) * 100}%`,
                            backgroundPositionY: imageSprite.rows === 1
                                ? "0%"
                                : `${(imageSprite.row / (imageSprite.rows - 1)) * 100}%`,
                        }}
                    />
                ) : imageUrl && !imageError ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover"
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
