"use client";

import { useSquadStore } from "@/store/useSquadStore";
import { BarChart3, Shield, Zap, Brain } from "lucide-react";

export default function AnalysisPage() {
    const { squad } = useSquadStore();
    const players = Object.values(squad).filter(p => p !== null);

    const avgAge = players.length > 0
        ? (players.reduce((acc, p) => acc + (p?.age || 0), 0) / players.length).toFixed(1)
        : "0";

    const avgRating = players.length > 0
        ? (players.reduce((acc, p) => acc + (p?.rating || 0), 0) / players.length).toFixed(1)
        : "0";

    const totalValue = players.reduce((acc, p) => acc + (p?.value || 0), 0);

    // Simple logic for comments
    const comments = [];
    if (Number(avgAge) > 29) comments.push("Your squad is quite experienced but might lack energy. Consider adding younger players.");
    if (Number(avgRating) > 82) comments.push("This is a world-class team capable of competing in Europe!");
    if (players.length < 11) comments.push("You haven't completed your starting XI yet.");

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-fb-navy">Squad Analysis</h1>
                <p className="text-gray-600">Deep dive into your team's statistics and performance metrics</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <StatCard
                    icon={<Brain className="w-8 h-8 text-purple-500" />}
                    label="Average Age"
                    value={`${avgAge} Years`}
                    subtext={Number(avgAge) < 25 ? "Young Squad" : "Experienced Squad"}
                />
                <StatCard
                    icon={<Zap className="w-8 h-8 text-yellow-500" />}
                    label="Average Rating"
                    value={avgRating}
                    subtext="Overall Strength"
                />
                <StatCard
                    icon={<Shield className="w-8 h-8 text-blue-500" />}
                    label="Total Value"
                    value={`€${(totalValue / 1000000).toFixed(1)}M`}
                    subtext="Market Valuation"
                />
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-fb-navy mb-6 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" />
                    Coach's Report
                </h2>

                <div className="space-y-4">
                    {comments.length > 0 ? (
                        comments.map((comment, idx) => (
                            <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 mt-2 rounded-full bg-fb-yellow flex-shrink-0" />
                                <p className="text-gray-700">{comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">Add more players to generate a report.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, subtext }: { icon: React.ReactNode, label: string, value: string, subtext: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
            <div className="mb-4 p-3 bg-gray-50 rounded-full">{icon}</div>
            <div className="text-3xl font-bold text-fb-navy mb-1">{value}</div>
            <div className="font-medium text-gray-900">{label}</div>
            <div className="text-sm text-gray-500 mt-1">{subtext}</div>
        </div>
    );
}
