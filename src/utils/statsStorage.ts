export interface DuelStats {
    totalPicks: number;
    playerPicks: Record<string, number>;
}

interface StoredData extends DuelStats {
    date: string;
}

const STORAGE_KEY = 'fener_duel_stats';

const getToday = () => new Date().toISOString().split('T')[0];

export const getStats = (): DuelStats => {
    if (typeof window === 'undefined') return { totalPicks: 0, playerPicks: {} };

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return { totalPicks: 0, playerPicks: {} };

        const parsed: StoredData = JSON.parse(stored);
        const today = getToday();

        // If date is missing (old data) or different from today, reset
        if (parsed.date !== today) {
            return { totalPicks: 0, playerPicks: {} };
        }

        return {
            totalPicks: parsed.totalPicks,
            playerPicks: parsed.playerPicks
        };
    } catch (e) {
        console.error('Failed to parse stats', e);
        return { totalPicks: 0, playerPicks: {} };
    }
};

export const recordPick = (playerId: string) => {
    if (typeof window === 'undefined') return;

    const stats = getStats();
    stats.totalPicks += 1;
    stats.playerPicks[playerId] = (stats.playerPicks[playerId] || 0) + 1;

    const dataToSave: StoredData = {
        ...stats,
        date: getToday()
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        // Dispatch event for live updates across components
        window.dispatchEvent(new Event('statsUpdated'));
    } catch (e) {
        console.error('Failed to save stats', e);
    }
};
