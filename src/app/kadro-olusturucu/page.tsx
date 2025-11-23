"use client";

import { useState, useRef } from "react";
import { Pitch } from "@/components/Pitch";
import { useSquadStore } from "@/store/useSquadStore";
import { formations } from "@/data/formations";
import { RotateCcw, Users } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { ParticleBackground } from "@/components/ParticleBackground";
import Image from "next/image";

export default function BuilderPage() {
    const {
        formation,
        setFormation,
        resetSquad,
        squad,
        calculateTotalCost,
        calculateAverageRating,
    } = useSquadStore();

    const pitchRef = useRef<HTMLDivElement>(null);
    const exportRef = useRef<HTMLDivElement>(null);
    const totalCost = calculateTotalCost();
    const avgRating = calculateAverageRating();
    const playerCount = Object.keys(squad).length;

    return (
        <div className="min-h-[calc(100vh-80px)] relative overflow-hidden bg-[#001d3d]">
            {/* Subtle Stars/Dots Pattern */}
            <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                    backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            />

            <ParticleBackground />

            <div className="relative z-10 container mx-auto px-4 py-4 md:py-8">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start justify-center">
                    {/* Controls Panel (Top on Mobile, Left on Desktop) */}
                    <div className="w-full lg:w-80 space-y-4 shrink-0 order-1 lg:order-1">
                        {/* Squad Name Input */}
                        <div className="bg-fb-navy/90 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20 shadow-xl">
                            <label className="block text-xs font-bold text-white/80 uppercase tracking-wider mb-2">
                                Kadro Adı
                            </label>
                            <input
                                type="text"
                                value={useSquadStore((state) => state.squadName)}
                                onChange={(e) => useSquadStore.getState().setSquadName(e.target.value)}
                                placeholder="Örneğin: 2008 Efsane Kadro"
                                maxLength={40}
                                className="w-full bg-white/10 text-white text-sm font-bold placeholder-white/30 rounded-lg px-4 py-3 outline-none border border-white/10 focus:border-fb-yellow focus:ring-1 focus:ring-fb-yellow transition-all"
                            />
                        </div>

                        {/* Formation Selector & Stats */}
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20 shadow-xl space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Diziliş Seç
                                </label>
                                <select
                                    value={formation}
                                    onChange={(e) => setFormation(e.target.value as any)}
                                    className="w-full bg-white text-fb-navy font-bold rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-fb-yellow shadow-inner"
                                >
                                    {Object.values(formations).map((f) => (
                                        <option key={f.name} value={f.name}>
                                            {f.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                <span className="text-gray-300 text-sm">Oyuncular</span>
                                <span className="text-lg font-bold text-white">{playerCount} / 11</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={resetSquad}
                                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-bold transition-colors shadow-lg text-sm md:text-base"
                            >
                                <RotateCcw size={18} />
                                Sıfırla
                            </button>
                            <ShareButton targetRef={exportRef} />
                        </div>

                        <div className="text-center lg:hidden">
                            <p className="text-[10px] text-gray-400">
                                * Oyuncuları eklemek için boş alanlara tıklayın.
                            </p>
                        </div>
                    </div>

                    {/* Pitch Area (Bottom on Mobile, Right on Desktop) */}
                    <div className="flex-1 w-full max-w-[420px] lg:max-w-[500px] mx-auto order-2 lg:order-2" ref={pitchRef}>
                        <div className="relative">
                            <Pitch />
                        </div>
                        <div className="text-center mt-4 hidden lg:block">
                            <p className="text-xs text-gray-400">
                                * Oyuncuları sürükleyip bırakarak yerlerini değiştirebilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
