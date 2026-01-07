"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSquadStore } from "@/store/useSquadStore";
import { Player, Position } from "@/types";
import PlayerChip from "./PlayerChip";
import PlayerSelector from "./PlayerSelector";
import { Plus, X, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const BENCH_SIZE = 7;

interface BenchSlotProps {
    player: Player | null;
    index: number;
    onClick: () => void;
    onRemove: () => void;
}

function BenchSlot({ player, index, onClick, onRemove }: BenchSlotProps) {
    return (
        <div className="relative group flex flex-col items-center">
            {player ? (
                <div
                    onClick={onClick}
                    className="cursor-pointer transition-transform hover:scale-105 relative"
                >
                    <PlayerChip player={player} positionLabel={player.position} size="sm" />
                    {/* Remove button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                        <X className="w-3 h-3 text-white" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={onClick}
                    className={cn(
                        "rounded-full bg-white/10 hover:bg-fb-yellow/60 border-2 border-dashed border-white/30 hover:border-fb-navy flex items-center justify-center transition-all duration-300 group/btn",
                        "w-12 h-12 md:w-14 md:h-14"
                    )}
                >
                    <Plus className="text-white/50 group-hover/btn:text-fb-navy transition-colors w-5 h-5" />
                </button>
            )}
        </div>
    );
}

interface SubstituteBenchProps {
    isExport?: boolean;
    layout?: "horizontal" | "vertical";
}

export function SubstituteBench({ isExport, layout = "horizontal" }: SubstituteBenchProps) {
    const { bench, addPlayerToBench, removePlayerFromBench } = useSquadStore();
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    // Ensure we're on the client
    useEffect(() => {
        setMounted(true);
    }, []);

    const benchCount = bench.filter(p => p !== null).length;

    const handleSelectPlayer = (player: Player | null) => {
        if (player && selectedSlotIndex !== null) {
            addPlayerToBench(player, selectedSlotIndex);
        }
        setSelectedSlotIndex(null);
    };

    // Player Selector Modal - render via portal to body to ensure fullscreen
    const renderPlayerSelector = () => {
        if (selectedSlotIndex === null || isExport || !mounted) return null;

        return createPortal(
            <PlayerSelector
                isOpen={selectedSlotIndex !== null}
                onClose={() => setSelectedSlotIndex(null)}
                onSelect={handleSelectPlayer}
                onRemove={() => {
                    removePlayerFromBench(selectedSlotIndex);
                    setSelectedSlotIndex(null);
                }}
                position={undefined}
                currentPlayer={bench[selectedSlotIndex]}
                isBenchMode={true}
            />,
            document.body
        );
    };

    const isVertical = layout === "vertical";

    return (
        <>
            <div className={cn(
                "bg-fb-navy/80 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl",
                isVertical ? "w-full" : "w-full"
            )}>
                {/* Header */}
                <div className={cn(
                    "flex items-center justify-between mb-4",
                    isVertical && "flex-col gap-2"
                )}>
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-fb-yellow" />
                        <h3 className="text-white font-bold text-sm uppercase tracking-wide">
                            Yedek Kulübesi
                        </h3>
                    </div>
                    <span className="text-fb-yellow font-bold text-sm">
                        {benchCount} / {BENCH_SIZE}
                    </span>
                </div>

                {/* Bench Slots */}
                <div className={cn(
                    "flex gap-3",
                    isVertical
                        ? "flex-col items-center"
                        : "flex-wrap justify-center md:gap-4"
                )}>
                    {bench.map((player, index) => (
                        <BenchSlot
                            key={`bench-${index}`}
                            player={player}
                            index={index}
                            onClick={() => setSelectedSlotIndex(index)}
                            onRemove={() => removePlayerFromBench(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Render modal via portal to ensure fullscreen */}
            {renderPlayerSelector()}
        </>
    );
}
