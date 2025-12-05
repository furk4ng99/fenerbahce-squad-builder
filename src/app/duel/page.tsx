import { Metadata } from 'next';
import PlayerDuelArena from '@/components/PlayerDuelArena';

export const metadata: Metadata = {
    title: 'Player Duel Arena | Fener Ajans',
    description: 'Fenerbahçe efsanelerini karşı karşıya getir ve favorini seç!',
};

export default function DuelPage() {
    return <PlayerDuelArena />;
}
