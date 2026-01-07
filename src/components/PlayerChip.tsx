import { Player } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PlayerAvatar } from "./PlayerAvatar";

interface PlayerChipProps {
    player: Player;
    onClick?: () => void;
    className?: string;
    positionLabel?: string;
    size?: "sm" | "md";
}

export default function PlayerChip({
    player,
    onClick,
    className,
    positionLabel,
    size = "md",
}: PlayerChipProps) {
    const [imageError, setImageError] = useState(false);

    // Extract surname for display, but show full name for "Transfer Lazim"
    const displayName = player.id === 'transfer-lazim'
        ? player.name
        : (player.name.split(' ').pop() || player.name);

    const sizeClasses = {
        sm: "w-[55px] md:w-[65px]",
        md: "w-[75px] md:w-[95px]",
    };

    const avatarSizeClasses = {
        sm: "w-10 h-10 md:w-12 md:h-12",
        md: "w-16 h-16 md:w-20 md:h-20",
    };

    const nameClasses = {
        sm: "w-[80px] md:w-[100px] text-[8px] md:text-[10px]",
        md: "w-[120px] md:w-[140px] text-[10px] md:text-[12px]",
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-start cursor-pointer group relative",
                sizeClasses[size],
                className
            )}
            style={{
                // Ensure overflow is visible for name/pill
                overflow: 'visible'
            }}
        >
            {/* Player Avatar & Name */}
            <div className="relative z-10 transition-transform group-hover:scale-105">
                {player.id === 'transfer-lazim' ? (
                    <div className={avatarSizeClasses[size] + " flex items-center justify-center"}>
                        <img
                            src={player.image}
                            alt={player.name}
                            className="w-full h-full object-contain drop-shadow-md"
                        />
                    </div>
                ) : (
                    <PlayerAvatar
                        imageUrl={player.image}
                        name={player.name}
                        size={size === "sm" ? "sm" : "md"}
                        variant="default"
                        showName={false}
                    />
                )}
            </div>

            {/* Player Name (Below Avatar) */}
            <div className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-1 flex justify-center z-20 pointer-events-none",
                nameClasses[size]
            )}>
                <p
                    className={cn(
                        "text-white font-bold text-center leading-relaxed truncate px-1 py-1",
                        size === "sm" ? "text-[8px] md:text-[10px]" : "text-[10px] md:text-[12px]"
                    )}
                    style={{
                        textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.5)',
                    }}
                >
                    {displayName}
                </p>
            </div>
        </div>
    );
}
