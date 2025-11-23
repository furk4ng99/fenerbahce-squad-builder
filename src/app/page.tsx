import Link from "next/link";
import { Users, Share2, Shield, Trophy, Layout, Sparkles, ArrowRight } from "lucide-react";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { formations } from "@/data/formations";
import TweetFeed from "@/components/TweetFeed";

async function getStats() {
    const csvPath = path.join(process.cwd(), 'src', 'data', 'FOOTBALL_DATA_ACTIVE.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');

    const results = await new Promise<{ data: any[] }>((resolve) => {
        Papa.parse(fileContent, {
            header: true,
            complete: resolve,
        });
    });

    const playerCount = results.data.length;
    const formationCount = Object.keys(formations).length;

    return { playerCount, formationCount };
}

export default async function Home() {
    const { playerCount, formationCount } = await getStats();

    return (
        <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden bg-[#0B1F87]">
            {/* Background Image Layer */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/stadium-bg.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Strong Blue Overlay */}
                <div className="absolute inset-0 bg-[#0B1F87]/90 backdrop-blur-[2px]" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0B1F87] to-transparent z-10 opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0B1F87] to-transparent z-10 opacity-50" />

            <div className="relative z-20 container mx-auto px-4 text-center flex flex-col items-center py-12">

                {/* Main Typography */}
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#FFDD00] font-bebas tracking-wider leading-none drop-shadow-2xl max-w-5xl mx-auto">
                        HAYALİNİZDEKİ FENERBAHÇE KADROSUNU OLUŞTURUN
                    </h1>
                </div>

                <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
                    Dizilişinizi seçin, oyuncularınızı yerleştirin ve efsane kadronuzu tüm dünyayla paylaşın.
                </p>

                {/* CTA Button */}
                <div className="mb-12">
                    <Link
                        href="/kadro-olusturucu"
                        className="group relative inline-flex items-center justify-center bg-[#FFDD00] text-[#0B1F87] font-bold text-lg md:text-xl py-4 px-10 rounded-full shadow-[0_0_30px_rgba(255,221,0,0.4)] hover:shadow-[0_0_50px_rgba(255,221,0,0.6)] transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            KADRO OLUŞTUR <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-8 md:gap-16 mb-16 border-t border-white/10 pt-8 w-full max-w-3xl mx-auto">
                    <StatItem value={`${playerCount}+`} label="Oyuncu" />
                    <StatItem value={formationCount.toString()} label="Diziliş" />
                    <StatItem value="∞" label="Olasılık" />
                </div>

                {/* Feature Cards & Twitter Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto items-start">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FeatureCard
                            icon={<Shield size={28} className="text-[#FFDD00]" />}
                            title="Kadro Oluşturucu"
                            description="Dizilişinizi seçin ve oyuncularınızı sürükle bırak ile yerleştirin"
                        />
                        <FeatureCard
                            icon={<Trophy size={28} className="text-[#FFDD00]" />}
                            title={`${playerCount}+ Oyuncu`}
                            description="Geniş oyuncu veritabanından seçim yapın"
                        />
                        <FeatureCard
                            icon={<Share2 size={28} className="text-[#FFDD00]" />}
                            title="Paylaş & İndir"
                            description="Kadronuzu görsel olarak indirin ve paylaşın"
                        />
                        <FeatureCard
                            icon={<Sparkles size={28} className="text-[#FFDD00]" />}
                            title="Güncel Kadro"
                            description="Her zaman en güncel Fenerbahçe kadrosu elinizin altında"
                        />
                    </div>

                    {/* Twitter Feed Widget */}
                    <div className="w-full">
                        <TweetFeed />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatItem({ value, label }: { value: string, label: string }) {
    return (
        <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-bold text-[#FFDD00] font-bebas tracking-wider mb-1">{value}</span>
            <span className="text-xs md:text-sm text-blue-200 uppercase tracking-widest font-semibold">{label}</span>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-[#FFDD00]/30 transition-all duration-300 group text-left h-full">
            <div className="bg-[#0B1F87]/50 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/5 shadow-inner">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-bebas tracking-wide">{title}</h3>
            <p className="text-blue-100/70 text-sm leading-relaxed">{description}</p>
        </div>
    );
}
