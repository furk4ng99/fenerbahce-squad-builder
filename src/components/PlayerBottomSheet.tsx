import { Player } from "@/types";
import PlayerCard from "./PlayerCard";
import { X, RefreshCw, Trash2 } from "lucide-react";
import { useEffect } from "react";

interface PlayerBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    player: Player;
    onRemove: () => void;
    onChange: () => void;
    positionLabel?: string;
}

export default function PlayerBottomSheet({
    isOpen,
    onClose,
    player,
    onRemove,
    onChange,
    positionLabel,
}: PlayerBottomSheetProps) {

    // Prevent background scrolling when sheet is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Sheet Content */}
            <div className="relative w-full bg-white rounded-t-2xl p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl flex flex-col items-center gap-6 pb-10">

                {/* Close Handle/Button */}
                <div className="w-full flex justify-end">
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Full Player Card */}
                <div className="scale-110">
                    <PlayerCard
                        player={player}
                        size="md"
                        variant="yellow"
                        positionLabel={positionLabel}
                        className="shadow-xl"
                    />
                </div>

                {/* Actions */}
                <div className="w-full grid grid-cols-2 gap-4 mt-2">
                    <button
                        onClick={() => {
                            onChange();
                            onClose();
                        }}
                        className="flex items-center justify-center gap-2 bg-fb-navy text-white font-bold py-3 px-4 rounded-xl shadow-lg active:scale-95 transition-transform"
                    >
                        <RefreshCw className="w-5 h-5" />
                        <span>Değiştir</span>
                    </button>

                    <button
                        onClick={() => {
                            onRemove();
                            onClose();
                        }}
                        className="flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3 px-4 rounded-xl border-2 border-red-100 active:scale-95 transition-transform"
                    >
                        <Trash2 className="w-5 h-5" />
                        <span>Kaldır</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
