"use client";

import { useState, useRef } from "react";
import { useSquadStore } from "@/store/useSquadStore";
import { formations } from "@/data/formations";
import { Position, Player } from "@/types";
import PlayerCard from "./PlayerCard";
import PlayerChip from "./PlayerChip";
import PlayerSelector from "./PlayerSelector";
import PlayerActionMenu from "./PlayerActionMenu";
import { Plus, X, Shirt, User } from "lucide-react";
import {
    DndContext,
    useDraggable,
    DragEndEvent,
    useSensor,
    useSensors,
    PointerSensor,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";

// Position detection based on Y coordinate (top to bottom: attack to defense)
function detectPositionFromY(yPercent: number): Position {
    if (yPercent < 20) return "ST"; // Striker zone
    if (yPercent < 35) return "LW"; // Wing/Attack zone  
    if (yPercent < 50) return "CAM"; // Attacking mid zone
    if (yPercent < 65) return "CM"; // Central mid zone
    if (yPercent < 80) return "CDM"; // Defensive mid/back zone
    return "CB"; // Defense zone
}

// All available positions for dropdown
const ALL_POSITIONS: Position[] = ["GK", "LB", "CB", "RB", "LWB", "RWB", "CDM", "CM", "CAM", "LM", "RM", "LW", "RW", "ST"];

interface DraggableSlotProps {
    slot: { id: string; position: string; x: number; y: number };
    player: Player | null;
    customPosition?: { x: number; y: number; label?: string };
    onRemove: () => void;
    onClick: () => void;
    onLabelChange: (newLabel: string) => void;
    isExport?: boolean;
}

function DraggableSlot({
    slot,
    player,
    customPosition,
    onRemove,
    onClick,
    onLabelChange,
    isExport,
}: DraggableSlotProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: slot.id,
        });

    const [isEditingLabel, setIsEditingLabel] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [labelText, setLabelText] = useState(
        customPosition?.label || slot.position
    );

    // Use custom position if available, otherwise default slot position
    const left = customPosition?.x ?? slot.x;
    const top = customPosition?.y ?? slot.y;

    const style = {
        left: `${left}%`,
        top: `${top}%`,
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0) translate(-50%, -50%)`
            : undefined,
        position: "absolute" as const,
        zIndex: isDragging ? 50 : 10,
    };

    const handleLabelClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDropdown(true);
    };

    const handlePositionSelect = (pos: Position) => {
        setLabelText(pos);
        onLabelChange(pos);
        setShowDropdown(false); // Close dropdown after selection
    };

    const handleManualInput = () => {
        setShowDropdown(false);
        setIsEditingLabel(true);
    };

    const handleLabelSubmit = () => {
        setIsEditingLabel(false);
        onLabelChange(labelText);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleLabelSubmit();
        } else if (e.key === "Escape") {
            setIsEditingLabel(false);
            setLabelText(customPosition?.label || slot.position);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex flex-col items-center justify-center touch-none",
                !transform && "-translate-x-1/2 -translate-y-1/2",
                isDragging && "opacity-80 scale-105 cursor-grabbing"
            )}
            {...listeners}
            {...attributes}
        >
            {/* Player Chip or Empty Slot */}
            <div className="relative group flex items-center justify-center">
                {player ? (
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            onClick(); // Open modal/sheet
                        }}
                        className="cursor-pointer transition-transform hover:scale-105 relative"
                    >
                        <PlayerChip
                            player={player}
                            positionLabel={labelText}
                        />
                    </div>
                ) : (
                    <button
                        onClick={(e) => { e.stopPropagation(); onClick(); }}
                        className={cn(
                            "rounded-full bg-white/20 hover:bg-fb-yellow/80 border-2 border-white/40 hover:border-fb-navy flex items-center justify-center transition-all duration-300 group shadow-lg backdrop-blur-sm",
                            "w-16 h-16 md:w-20 md:h-20"
                        )}
                    >
                        <Plus className="text-white group-hover:text-fb-navy transition-colors w-8 h-8" />
                    </button>
                )}
            </div>

            {/* Position Label with Dropdown (Only show if NO player) */}
            {/* If player exists, the token has the label inside it */}
            {!player && (
                <div className="absolute top-[85%] left-1/2 -translate-x-1/2 z-20">
                    {isEditingLabel ? (
                        <input
                            type="text"
                            value={labelText}
                            onChange={(e) => setLabelText(e.target.value.toUpperCase())}
                            onBlur={handleLabelSubmit}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            maxLength={4}
                            className="w-12 text-center text-[0.7rem] font-bold text-fb-navy bg-white rounded px-1 py-0.5 outline-none border-2 border-fb-yellow shadow-sm"
                        />
                    ) : showDropdown ? (
                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl border-2 border-fb-navy/20 p-2 z-50 w-32">
                            <div className="max-h-48 overflow-y-auto space-y-1 custom-scrollbar">
                                {ALL_POSITIONS.map((pos) => (
                                    <button
                                        key={pos}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePositionSelect(pos);
                                        }}
                                        className="w-full text-left px-2 py-1 text-xs font-bold text-fb-navy hover:bg-fb-yellow/30 rounded transition-colors"
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleManualInput();
                                }}
                                className="w-full mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600 hover:text-fb-navy font-semibold"
                            >
                                Özel...
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDropdown(false);
                                }}
                                className="w-full mt-1 text-xs text-gray-400 hover:text-gray-600"
                            >
                                İptal
                            </button>
                        </div>
                    ) : (
                        <div
                            onClick={handleLabelClick}
                            className="bg-fb-navy/90 backdrop-blur-sm text-white font-bold px-[0.5em] py-[0.1em] rounded shadow-[0_2px_4px_rgba(0,0,0,0.3)] border border-white/20 cursor-pointer hover:bg-fb-yellow hover:text-fb-navy transition-all select-none text-[0.7rem] whitespace-nowrap"
                        >
                            {labelText}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

interface PitchProps {
    readonly?: boolean;
    isExport?: boolean;
}

export function Pitch({ readonly, isExport }: PitchProps) {
    const {
        formation,
        squad,
        customPositions,
        addPlayerToSlot,
        removePlayerFromSlot,
        updateSlotPosition,
        updateSlotLabel,
        squadName,
    } = useSquadStore();
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [actionMenuSlot, setActionMenuSlot] = useState<string | null>(null);
    const [bottomSheetSlot, setBottomSheetSlot] = useState<string | null>(null);
    const pitchRef = useRef<HTMLDivElement>(null);

    const currentFormation = formations[formation];

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Enable click if moved less than 8px
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        if (readonly) return; // Disable drag in readonly mode

        const { active, delta } = event;
        const slotId = active.id as string;

        if (!pitchRef.current) return;

        const pitchRect = pitchRef.current.getBoundingClientRect();
        const slot = currentFormation.slots.find((s) => s.id === slotId);
        const customPos = customPositions[slotId];

        // Current position (percentage)
        const currentX = customPos?.x ?? slot?.x ?? 50;
        const currentY = customPos?.y ?? slot?.y ?? 50;

        // Calculate delta in percentage
        const deltaXPercent = (delta.x / pitchRect.width) * 100;
        const deltaYPercent = (delta.y / pitchRect.height) * 100;

        // New position
        let newX = currentX + deltaXPercent;
        let newY = currentY + deltaYPercent;

        // Clamp to pitch boundaries (5-95 to keep within visible area)
        newX = Math.max(5, Math.min(95, newX));
        newY = Math.max(5, Math.min(95, newY));

        updateSlotPosition(slotId, newX, newY);

        // Auto-detect position based on Y coordinate
        const detectedPosition = detectPositionFromY(newY);
        updateSlotLabel(slotId, detectedPosition);
    };

    return (
        <div
            id="squad-pitch"
            className="w-full max-w-[500px] mx-auto shadow-2xl rounded-xl overflow-hidden flex flex-col bg-fb-navy border-[6px] border-white/20"
        >
            {/* NEW: Dedicated Squad Name Header (Outside Pitch) */}
            <div className="relative w-full bg-gradient-to-r from-[#001d3d] via-fb-navy to-[#001d3d] py-4 px-2 border-b-[4px] border-fb-yellow flex items-center justify-center overflow-hidden shrink-0 z-30 rounded-t-xl shadow-lg">
                {/* Background Pattern/Grid */}
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent pointer-events-none" />

                <h2
                    className="text-white font-black text-2xl md:text-4xl uppercase tracking-widest text-center font-sans relative z-10"
                    style={{
                        textShadow: '0 0 10px rgba(0, 255, 255, 0.6), 0 0 20px rgba(0, 100, 255, 0.4)'
                    }}
                >
                    {squadName || "KADRO"}
                </h2>
            </div>

            {/* Pitch Container */}
            <div className="relative w-full aspect-[9/16] bg-[#2c8f2c]">
                {/* Realistic Grass Pattern */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 50px,
                            rgba(0,0,0,0.05) 50px,
                            rgba(0,0,0,0.05) 100px
                        ),
                        radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%)
                    `
                    }}
                />

                {/* Pitch Markings */}
                <div className="absolute inset-4 border-2 border-white/60 opacity-80 pointer-events-none">
                    {/* Center Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] aspect-square border-2 border-white/60 rounded-full" />
                    {/* Center Line */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/60 -translate-y-1/2" />
                    {/* Penalty Areas */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[16%] border-2 border-t-0 border-white/60" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[16%] border-2 border-b-0 border-white/60" />
                    {/* Goal Areas */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[25%] h-[6%] border-2 border-t-0 border-white/60" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[25%] h-[6%] border-2 border-b-0 border-white/60" />
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-[4%] aspect-square border-b-2 border-r-2 border-white/60 rounded-br-full" />
                    <div className="absolute top-0 right-0 w-[4%] aspect-square border-b-2 border-l-2 border-white/60 rounded-bl-full" />
                    <div className="absolute bottom-0 left-0 w-[4%] aspect-square border-t-2 border-r-2 border-white/60 rounded-tr-full" />
                    <div className="absolute bottom-0 right-0 w-[4%] aspect-square border-t-2 border-l-2 border-white/60 rounded-tl-full" />
                </div>

                {/* Crowd Atmosphere (Vignette) */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/20" />

                {/* FENER AJANS Logo - Top Left (Always Visible) */}
                <div className="absolute z-20 pointer-events-none opacity-90 top-[3%] left-[4%] w-[25%]">
                    <img
                        src="/fener-ajans-watermark.png"
                        alt="Fener Ajans"
                        className="w-full h-auto object-contain drop-shadow-lg"
                    />
                </div>

                {/* Draggable Slots */}
                <div ref={pitchRef} className="absolute inset-0">
                    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 pointer-events-auto">
                                {currentFormation.slots.map((slot) => (
                                    <DraggableSlot
                                        key={slot.id}
                                        slot={slot}
                                        player={squad[slot.id]}
                                        customPosition={customPositions[slot.id]}
                                        onRemove={() => !readonly && removePlayerFromSlot(slot.id)}
                                        onClick={() => {
                                            if (readonly) return;
                                            if (squad[slot.id]) {
                                                // Desktop: Keep current behavior (Action Menu)
                                                // Mobile: Open Player Selector directly (with Remove option)
                                                if (window.innerWidth >= 768) {
                                                    setActionMenuSlot(slot.id);
                                                } else {
                                                    setSelectedSlot(slot.id);
                                                }
                                            } else {
                                                setSelectedSlot(slot.id);
                                            }
                                        }}
                                        onLabelChange={(newLabel) => !readonly && updateSlotLabel(slot.id, newLabel)}
                                        isExport={isExport}
                                    />
                                ))}
                            </div>
                        </div>
                    </DndContext>
                </div>

                {/* Player Action Menu (Desktop only) */}
                {actionMenuSlot && !readonly && squad[actionMenuSlot] && (
                    <div className="hidden md:block">
                        <PlayerActionMenu
                            isOpen={!!actionMenuSlot}
                            onClose={() => setActionMenuSlot(null)}
                            onRemove={() => {
                                removePlayerFromSlot(actionMenuSlot);
                                setActionMenuSlot(null);
                            }}
                            onChange={() => {
                                setSelectedSlot(actionMenuSlot);
                                setActionMenuSlot(null);
                            }}
                            player={squad[actionMenuSlot]}
                        />
                    </div>
                )}

                {/* Player Selector Modal (for empty slots or changing player) */}
                {selectedSlot && !readonly && (
                    <PlayerSelector
                        isOpen={!!selectedSlot}
                        onClose={() => setSelectedSlot(null)}
                        onSelect={(player: Player | null) => {
                            if (player) {
                                addPlayerToSlot(player, selectedSlot);
                            }
                            // If null is returned (remove), we handle it via onRemove prop in Selector
                            setSelectedSlot(null);
                        }}
                        onRemove={() => {
                            removePlayerFromSlot(selectedSlot);
                            setSelectedSlot(null);
                        }}
                        position={
                            currentFormation.slots.find((s) => s.id === selectedSlot)?.position
                        }
                        currentPlayer={squad[selectedSlot]}
                    />
                )}
            </div>
        </div>
    );
}
