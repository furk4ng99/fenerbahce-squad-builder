import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, Formation } from '@/types';

const BENCH_SIZE = 10;

interface SquadState {
    formation: Formation;
    squad: Record<string, Player | null>; // slotId -> Player
    bench: (Player | null)[]; // 10 slots for substitutes
    customPositions: Record<string, { x: number; y: number; label?: string }>; // slotId -> {x, y, label}
    squadName: string;
    budget: number;
    ownedPlayers: Player[];

    setFormation: (formation: Formation) => void;
    setSquadName: (name: string) => void;
    addPlayerToSlot: (player: Player, slotId: string) => void;
    removePlayerFromSlot: (slotId: string) => void;
    updateSlotPosition: (slotId: string, x: number, y: number) => void;
    updateSlotLabel: (slotId: string, label: string) => void;
    resetSquad: () => void;
    calculateTotalCost: () => string;
    calculateAverageRating: () => string;
    buyPlayer: (player: Player) => void;
    // Bench actions
    addPlayerToBench: (player: Player, index?: number) => void;
    removePlayerFromBench: (index: number) => void;
    moveBenchPlayer: (fromIndex: number, toIndex: number) => void;
    movePlayerToBench: (slotId: string) => void;
    movePlayerToXI: (benchIndex: number, slotId: string) => void;
    swapBenchWithXI: (benchIndex: number, slotId: string) => void;
}

export const useSquadStore = create<SquadState>()(
    persist(
        (set, get) => ({
            formation: "4-2-3-1",
            squad: {},
            bench: Array(BENCH_SIZE).fill(null),
            customPositions: {},
            squadName: "",
            budget: 100000000, // 100M initial budget
            ownedPlayers: [],

            setFormation: (formation) => set({ formation, customPositions: {} }),
            setSquadName: (name) => set({ squadName: name }),

            buyPlayer: (player) => set((state) => {
                if (state.budget >= player.value) {
                    return {
                        budget: state.budget - player.value,
                        ownedPlayers: [...state.ownedPlayers, player]
                    };
                }
                return state;
            }),

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

            resetSquad: () => set({
                squad: {},
                bench: Array(BENCH_SIZE).fill(null),
                customPositions: {},
                squadName: "",
                budget: 100000000,
                ownedPlayers: []
            }),

            calculateTotalCost: () => {
                const state = get();
                const squadTotal = Object.values(state.squad).reduce((acc, player) => {
                    return acc + (player?.value || 0);
                }, 0);
                const benchTotal = state.bench.reduce((acc, player) => {
                    return acc + (player?.value || 0);
                }, 0);
                return ((squadTotal + benchTotal) / 1000000).toFixed(1);
            },

            calculateAverageRating: () => {
                const state = get();
                const squadPlayers = Object.values(state.squad).filter(p => p !== null) as Player[];
                const benchPlayers = state.bench.filter(p => p !== null) as Player[];
                const allPlayers = [...squadPlayers, ...benchPlayers];
                if (allPlayers.length === 0) return "0.0";
                const totalRating = allPlayers.reduce((acc, p) => acc + p.rating, 0);
                return (totalRating / allPlayers.length).toFixed(1);
            },

            // Bench actions
            addPlayerToBench: (player, index) => set((state) => {
                const newBench = [...state.bench];
                // Find first empty slot if no index provided
                const targetIndex = index !== undefined ? index : newBench.findIndex(p => p === null);
                if (targetIndex !== -1 && targetIndex < BENCH_SIZE) {
                    newBench[targetIndex] = player;
                }
                return { bench: newBench };
            }),

            removePlayerFromBench: (index) => set((state) => {
                const newBench = [...state.bench];
                if (index >= 0 && index < BENCH_SIZE) {
                    newBench[index] = null;
                }
                return { bench: newBench };
            }),

            moveBenchPlayer: (fromIndex, toIndex) => set((state) => {
                const newBench = [...state.bench];
                if (fromIndex >= 0 && fromIndex < BENCH_SIZE && toIndex >= 0 && toIndex < BENCH_SIZE) {
                    const player = newBench[fromIndex];
                    newBench[fromIndex] = newBench[toIndex];
                    newBench[toIndex] = player;
                }
                return { bench: newBench };
            }),

            movePlayerToBench: (slotId) => set((state) => {
                const player = state.squad[slotId];
                if (!player) return state;

                const emptyIndex = state.bench.findIndex(p => p === null);
                if (emptyIndex === -1) return state; // Bench full

                const newSquad = { ...state.squad };
                delete newSquad[slotId];
                const newBench = [...state.bench];
                newBench[emptyIndex] = player;

                return { squad: newSquad, bench: newBench };
            }),

            movePlayerToXI: (benchIndex, slotId) => set((state) => {
                const player = state.bench[benchIndex];
                if (!player) return state;

                const newBench = [...state.bench];
                newBench[benchIndex] = null;

                return {
                    squad: { ...state.squad, [slotId]: player },
                    bench: newBench
                };
            }),

            swapBenchWithXI: (benchIndex, slotId) => set((state) => {
                const benchPlayer = state.bench[benchIndex];
                const xiPlayer = state.squad[slotId];

                const newBench = [...state.bench];
                newBench[benchIndex] = xiPlayer || null;

                return {
                    squad: { ...state.squad, [slotId]: benchPlayer },
                    bench: newBench
                };
            }),
        }),
        {
            name: 'fenerbahce-squad-storage',
            // Migration: ensure bench has correct size
            merge: (persistedState: any, currentState: SquadState) => {
                const merged = { ...currentState, ...persistedState };
                // Ensure bench array has BENCH_SIZE slots
                if (merged.bench && merged.bench.length < BENCH_SIZE) {
                    // Pad with nulls to reach BENCH_SIZE
                    merged.bench = [
                        ...merged.bench,
                        ...Array(BENCH_SIZE - merged.bench.length).fill(null)
                    ];
                } else if (!merged.bench) {
                    merged.bench = Array(BENCH_SIZE).fill(null);
                }
                return merged;
            }
        }
    )
);
