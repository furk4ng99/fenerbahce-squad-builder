"use client";

import { useState } from "react";
import playersData from "@/data/players.json";
import PlayerCard from "@/components/PlayerCard";
import { useSquadStore } from "@/store/useSquadStore";
import { Search, ShoppingCart } from "lucide-react";
import { Player } from "@/types";

export default function MarketPage() {
    const [search, setSearch] = useState("");
    const { budget, buyPlayer } = useSquadStore();

    const filteredPlayers = playersData.players.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleBuy = (player: Player) => {
        if (budget >= player.value) {
            buyPlayer(player);
            alert(`Successfully bought ${player.name}!`);
        } else {
            alert("Insufficient funds!");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-fb-navy">Transfer Market</h1>
                    <p className="text-gray-600">Scout and sign new players for your squad</p>
                </div>
                <div className="bg-green-100 px-6 py-3 rounded-lg border border-green-200">
                    <span className="text-sm text-green-800 font-medium">Current Budget</span>
                    <div className="text-2xl font-bold text-green-700">€{(budget / 1000000).toFixed(1)}M</div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search player name..."
                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-fb-navy outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredPlayers.map(player => (
                    <div key={player.id} className="flex flex-col gap-2">
                        <PlayerCard player={player as Player} className="w-full" />
                        <button
                            onClick={() => handleBuy(player as Player)}
                            className="flex items-center justify-center gap-2 w-full bg-fb-navy text-white py-2 rounded-lg hover:bg-fb-dark transition-colors text-sm font-bold"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            €{(player.value / 1000000).toFixed(1)}M
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
