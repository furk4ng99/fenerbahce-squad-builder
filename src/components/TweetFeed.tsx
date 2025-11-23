"use client";

import { Twitter } from "lucide-react";

export default function TweetFeed() {
    return (
        <div className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl group hover:border-[#FFDD00]/30 transition-all duration-300">
            <div className="bg-fb-navy p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-white font-bold font-bebas tracking-wide text-lg flex items-center gap-2">
                    <Twitter size={18} className="text-[#FFDD00]" />
                    SON GELİŞMELER
                </h3>
            </div>

            <div className="p-8 bg-gradient-to-b from-fb-navy/80 to-fb-navy/90 flex flex-col items-center justify-center text-center h-[300px]">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Twitter size={32} className="text-white" />
                </div>

                <h4 className="text-xl font-bold text-white mb-2">
                    Fenerbahçe Gündemini Takip Et!
                </h4>

                <p className="text-blue-100/80 text-sm mb-6 max-w-[250px]">
                    En güncel transfer haberleri, maç analizleri ve özel içerikler için X hesabımızı takip edin.
                </p>

                <a
                    href="https://x.com/ajansfenercom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#FFDD00] text-fb-navy font-bold py-3 px-6 rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
                >
                    <Twitter size={18} />
                    @ajansfenercom'u Takip Et
                </a>
            </div>
        </div>
    );
}
