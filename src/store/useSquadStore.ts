import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, Formation } from '@/types';

interface SquadState {
    formation: Formation;
    squad: Record<string, Player | null>; // slotId -> Player
    customPositions: Record<string, { x: number; y: number; label?: string }>; // slotId -> {x, y, label}
    squadName: string;

    setFormation: (formation: Formation) => void;
    setSquadName: (name: string) => void;
    addPlayerToSlot: (player: Player, slotId: string) => void;
    removePlayerFromSlot: (slotId: string) => void;
    updateSlotPosition: (slotId: string, x: number, y: number) => void;
    updateSlotLabel: (slotId: string, label: string) => void;
    resetSquad: () => void;
    calculateTotalCost: () => string;
    calculateAverageRating: () => string;
}

export const useSquadStore = create<SquadState>()(
    persist(
        (set, get) => ({
            formation: "4-2-3-1",
            squad: {},
            customPositions: {},
            squadName: "",

            setFormation: (formation) => set({ formation, customPositions: {} }),
            setSquadName: (name) => set({ squadName: name }),

            addPlayerToSlot: (player, slotId) => set((state) => ({
                squad: { ...state.squad, [slotId]: player }
            })),

            removePlayerFromSlot: (slotId) => set((state) => {
                const newSquad = { ...state.squad };
                delete newSquad[slotId];
                return { squad: newSquad };
            }),

            updateSlotPosition: (slotId, x, y) => set((state) => ({
                customPositions: {
                    ...state.customPositions,
                    [slotId]: { ...state.customPositions[slotId], x, y }
                }
            })),

            updateSlotLabel: (slotId, label) => set((state) => ({
                customPositions: {
                    ...state.customPositions,
                    [slotId]: { ...state.customPositions[slotId], label }
                }
            })),

            resetSquad: () => set({ squad: {}, customPositions: {}, squadName: "" }),

            calculateTotalCost: () => {
                const state = get();
                const total = Object.values(state.squad).reduce((acc, player) => {
                    return acc + (player?.value || 0);
                }, 0);
                return (total / 1000000).toFixed(1);
            },

            calculateAverageRating: () => {
                const state = get();
                const players = Object.values(state.squad).filter(p => p !== null) as Player[];
                if (players.length === 0) return "0.0";
                const totalRating = players.reduce((acc, p) => acc + p.rating, 0);
                return (totalRating / players.length).toFixed(1);
            }
        }),
        {
            name: 'fenerbahce-squad-storage',
        }
    )
);


