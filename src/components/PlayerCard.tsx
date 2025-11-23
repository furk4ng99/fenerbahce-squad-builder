import { Player } from "@/types";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { User } from "lucide-react";
import { PlayerAvatar } from "./PlayerAvatar";

interface PlayerCardProps {
    player: Player;
    onClick?: () => void;
    className?: string;
    isSelected?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
    variant?: "white" | "yellow";
    isExport?: boolean;
    positionLabel?: string;
}

export default function PlayerCard({
    player,
    onClick,
    isSelected,
    className,
    positionLabel,
}: PlayerCardProps) {
    const [imageError, setImageError] = useState(false);
    const surname = player.name.trim().split(" ").pop();

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative flex flex-col items-center justify-start rounded-xl border-2 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden p-2",
                "bg-white border-fb-navy/20", // Reverted to White background
                isSelected && "ring-2 ring-fb-navy ring-offset-2",
                className
            )}
            style={{
                aspectRatio: "3/4",
            }}
        >
            {/* Player Avatar & Name */}
            <div className="flex-1 flex flex-col items-center justify-center w-full">
                <PlayerAvatar
                    imageUrl={player.image}
                    name={player.name}
                    size="md"
                    variant="card"
                    className="w-full"
                />
            </div>
        </div>
    );
}
