import { FormationConfig } from "@/types";

export const formations: Record<string, FormationConfig> = {
    "4-2-3-1": {
        name: "4-2-3-1",
        slots: [
            { id: "gk", position: "GK", x: 50, y: 88 }, // Moved up slightly to clear bottom padding
            { id: "lb", position: "LB", x: 10, y: 72 },
            { id: "lcb", position: "CB", x: 36.6, y: 72 },
            { id: "rcb", position: "CB", x: 63.3, y: 72 },
            { id: "rb", position: "RB", x: 90, y: 72 },
            { id: "lcdm", position: "CDM", x: 35, y: 54 },
            { id: "rcdm", position: "CDM", x: 65, y: 54 },
            { id: "lw", position: "LW", x: 10, y: 32 },
            { id: "cam", position: "CAM", x: 50, y: 35 },
            { id: "rw", position: "RW", x: 90, y: 32 },
            { id: "st", position: "ST", x: 50, y: 15 }, // Clears header
        ]
    },
    "4-3-3": {
        name: "4-3-3",
        slots: [
            { id: "gk", position: "GK", x: 50, y: 88 },
            { id: "lb", position: "LB", x: 10, y: 72 },
            { id: "lcb", position: "CB", x: 36.6, y: 72 },
            { id: "rcb", position: "CB", x: 63.3, y: 72 },
            { id: "rb", position: "RB", x: 90, y: 72 },
            { id: "lcm", position: "CM", x: 30, y: 52 },
            { id: "cm", position: "CM", x: 50, y: 56 },
            { id: "rcm", position: "CM", x: 70, y: 52 },
            { id: "lw", position: "LW", x: 10, y: 28 },
            { id: "st", position: "ST", x: 50, y: 15 },
            { id: "rw", position: "RW", x: 90, y: 28 },
        ]
    },
    "4-4-2": {
        name: "4-4-2",
        slots: [
            { id: "gk", position: "GK", x: 50, y: 88 },
            { id: "lb", position: "LB", x: 10, y: 72 },
            { id: "lcb", position: "CB", x: 36.6, y: 72 },
            { id: "rcb", position: "CB", x: 63.3, y: 72 },
            { id: "rb", position: "RB", x: 90, y: 72 },
            { id: "lm", position: "LM", x: 10, y: 45 },
            { id: "lcm", position: "CM", x: 38, y: 54 },
            { id: "rcm", position: "CM", x: 62, y: 54 },
            { id: "rm", position: "RM", x: 90, y: 45 },
            { id: "lst", position: "ST", x: 35, y: 15 },
            { id: "rst", position: "ST", x: 65, y: 15 },
        ]
    },
    "3-5-2": {
        name: "3-5-2",
        slots: [
            { id: "gk", position: "GK", x: 50, y: 88 },
            { id: "lcb", position: "CB", x: 20, y: 72 },
            { id: "cb", position: "CB", x: 50, y: 76 },
            { id: "rcb", position: "CB", x: 80, y: 72 },
            { id: "lm", position: "LM", x: 10, y: 45 },
            { id: "lcdm", position: "CDM", x: 40, y: 56 },
            { id: "rcdm", position: "CDM", x: 60, y: 56 },
            { id: "rm", position: "RM", x: 90, y: 45 },
            { id: "cam", position: "CAM", x: 50, y: 32 },
            { id: "lst", position: "ST", x: 35, y: 15 },
            { id: "rst", position: "ST", x: 65, y: 15 },
        ]
    },
    "3-4-3": {
        name: "3-4-3",
        slots: [
            { id: "gk", position: "GK", x: 50, y: 88 },
            { id: "lcb", position: "CB", x: 20, y: 72 },
            { id: "cb", position: "CB", x: 50, y: 76 },
            { id: "rcb", position: "CB", x: 80, y: 72 },
            { id: "lm", position: "LM", x: 10, y: 45 },
            { id: "lcm", position: "CM", x: 40, y: 54 },
            { id: "rcm", position: "CM", x: 60, y: 54 },
            { id: "rm", position: "RM", x: 90, y: 45 },
            { id: "lw", position: "LW", x: 10, y: 25 },
            { id: "st", position: "ST", x: 50, y: 15 },
            { id: "rw", position: "RW", x: 90, y: 25 },
        ]
    },
    "5-3-2": {
        name: "5-3-2",
        slots: [
            { id: "gk", position: "GK", x: 50, y: 88 },
            { id: "lb", position: "LWB", x: 8, y: 60 },
            { id: "lcb", position: "CB", x: 30, y: 72 },
            { id: "cb", position: "CB", x: 50, y: 76 },
            { id: "rcb", position: "CB", x: 70, y: 72 },
            { id: "rb", position: "RWB", x: 92, y: 60 },
            { id: "lcm", position: "CM", x: 35, y: 48 },
            { id: "cm", position: "CM", x: 50, y: 54 },
            { id: "rcm", position: "CM", x: 65, y: 48 },
            { id: "lst", position: "ST", x: 35, y: 15 },
            { id: "rst", position: "ST", x: 65, y: 15 },
        ]
    }
};
