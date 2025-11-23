"use client";

import { Player } from "@/types";
import { X, RefreshCw, Trash2 } from "lucide-react";
import PlayerCard from "./PlayerCard";

interface PlayerActionMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onRemove: () => void;
    onChange: () => void;
    player: Player;
}

export default function PlayerActionMenu({
    isOpen,
    onClose,
    onRemove,
    onChange,
    player,
}: PlayerActionMenuProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-fb-navy p-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white font-bebas tracking-wide">
                        OYUNCU İŞLEMLERİ
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col items-center gap-6">
                    {/* Player Preview */}
                    <div className="scale-110">
                        <PlayerCard player={player} size="md" variant="white" />
                    </div>

                    {/* Actions */}
                    <div className="w-full space-y-3">
                        <button
                            onClick={() => {
                                onChange();
                                onClose();
                            }}
                            className="w-full flex items-center justify-center gap-3 bg-fb-navy text-white py-3.5 rounded-xl font-bold hover:bg-fb-navy/90 transition-colors shadow-md active:scale-[0.98]"
                        >
                            <RefreshCw size={20} />
                            OYUNCUYU DEĞİŞTİR
                        </button>

                        <button
                            onClick={() => {
                                onRemove();
                                onClose();
                            }}
                            className="w-full flex items-center justify-center gap-3 bg-red-50 text-red-600 border-2 border-red-100 py-3.5 rounded-xl font-bold hover:bg-red-100 transition-colors active:scale-[0.98]"
                        >
                            <Trash2 size={20} />
                            KADRODAN ÇIKAR
                        </button>
                    </div>
                </div>
            </div>

            {/* Backdrop click to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
