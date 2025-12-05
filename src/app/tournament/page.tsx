import { Metadata } from 'next';
import PlayerDuelTournament from '@/components/PlayerDuelTournament';

export const metadata: Metadata = {
    title: 'Player Duel Tournament | Fener Ajans',
    description: '40 Fenerbahçe efsanesi yarışıyor, tek şampiyon kalıyor! Favorini seç.',
};

export default function TournamentPage() {
    return <PlayerDuelTournament />;
}
