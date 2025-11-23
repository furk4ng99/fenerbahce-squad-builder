export type Position = "GK" | "LB" | "RB" | "CB" | "CDM" | "CM" | "CAM" | "LW" | "RW" | "ST" | "LM" | "RM" | "LWB" | "RWB";

export interface Player {
    id: string | number;
    name: string;
    position: Position;
    age?: number;
    club?: string;
    value: number;
    rating: number;
    image?: string;
}

export interface SquadPlayer extends Player {
    slotId: string; // Unique ID for the slot on the pitch
}

export type Formation = "4-2-3-1" | "4-3-3" | "4-4-2" | "3-5-2" | "3-4-3" | "5-3-2";

export interface FormationConfig {
    name: Formation;
    slots: { id: string; position: Position; x: number; y: number }[];
}
