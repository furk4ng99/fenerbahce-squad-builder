'use client';

import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export const VisitorCounter = () => {
    const [count, setCount] = useState(190700);

    useEffect(() => {
        // Simulate live counter
        const interval = setInterval(() => {
            setCount(prev => prev + Math.floor(Math.random() * 3));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-fb-navy text-white rounded-xl shadow-lg p-6 flex items-center justify-between">
            <div>
                <p className="text-fb-yellow text-sm font-bold uppercase tracking-wider">Active Fans</p>
                <p className="text-3xl font-bold tabular-nums">{count.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-full">
                <Users className="text-fb-yellow" size={24} />
            </div>
        </div>
    );
};
