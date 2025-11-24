import { Player } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { PlayerAvatar } from "./PlayerAvatar";

interface PlayerChipProps {
    player: Player;
    onClick?: () => void;
    className?: string;
    positionLabel?: string;
}

export default function PlayerChip({
    player,
    onClick,
    className,
    positionLabel,
}: PlayerChipProps) {
    const [imageError, setImageError] = useState(false);

    // Extract surname for display, but show full name for "Transfer Lazim"
    const displayName = player.id === 'transfer-lazim'
        ? player.name
        : (player.name.split(' ').pop() || player.name);

    return (
        <div
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-start cursor-pointer group relative",
                "w-[75px] md:w-[95px]", // Target sizes: ~75px mobile, ~95px desktop
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
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
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
                        size="md"
                        variant="default"
                        showName={false}
                    />
                )}
            </div>

            {/* Player Name (Below Avatar) */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[120px] md:w-[140px] flex justify-center z-20 pointer-events-none">
                <p
                    className="text-white text-[10px] md:text-[12px] font-bold text-center leading-relaxed truncate px-1 py-1"
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
