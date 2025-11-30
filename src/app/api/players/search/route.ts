import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { Player, Position } from "@/types";

// Helper to parse currency string to number
const parseCurrency = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/[^0-9.-]+/g, ""));
};

// Helper to map CSV position to our Position type
const mapPosition = (pos: string): Position => {
    if (!pos) return "CM"; // Default
    const p = pos.toUpperCase();
    if (p.includes("GOALKEEPER")) return "GK";
    if (p.includes("CENTRE-BACK")) return "CB";
    if (p.includes("LEFT-BACK")) return "LB";
    if (p.includes("RIGHT-BACK")) return "RB";
    if (p.includes("DEFENSIVE MIDFIELD")) return "CDM";
    if (p.includes("CENTRAL MIDFIELD")) return "CM";
    if (p.includes("ATTACKING MIDFIELD")) return "CAM";
    if (p.includes("LEFT WINGER")) return "LW";
    if (p.includes("RIGHT WINGER")) return "RW";
    if (p.includes("CENTRE-FORWARD")) return "ST";
    if (p.includes("SECOND STRIKER")) return "ST"; // Map CF/SS to ST
    return "CM"; // Fallback
};

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query")?.toLowerCase();
    const club = searchParams.get("club")?.toLowerCase();
    const limit = parseInt(searchParams.get("limit") || "20");

    try {
        const csvPath = path.join(process.cwd(), "src", "data", "FOOTBALL_DATA_ACTIVE.csv");
        const fileContent = fs.readFileSync(csvPath, "utf8");

        const results = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
        });

        let players: any[] = results.data;

        if (club) {
            players = players.filter(p =>
                p.current_club_name && p.current_club_name.toLowerCase().includes(club)
            );
        }

        if (query) {
            players = players.filter(p =>
                (p.player_name && p.player_name.toLowerCase().includes(query)) ||
                (p.current_club_name && p.current_club_name.toLowerCase().includes(query))
            );
        }

        // Sort by market value (descending)
        players.sort((a, b) => {
            const valA = parseCurrency(a.market_value_in_eur);
            const valB = parseCurrency(b.market_value_in_eur);
            return valB - valA;
        });

        // Map to our Player type
        const mappedPlayers: Player[] = players.slice(0, limit).map((p: any) => {
            // Clean name: "Name (ID)" -> "Name"
            let name = p.player_name;
            if (name && name.includes("(") && name.includes(")")) {
                name = name.replace(/\s*\(\d+\)$/, "").trim();
            }

            return {
                id: p.player_id || Math.random().toString(36).substr(2, 9),
                name: name,
                position: mapPosition(p.position) as any,
                rating: 75,
                value: parseCurrency(p.market_value_in_eur),
                image: p.player_image_url || "https://via.placeholder.com/150",
                club: p.current_club_name
            };
        });

        return NextResponse.json({ players: mappedPlayers });

    } catch (error) {
        console.error("Error searching players:", error);
        return NextResponse.json({ error: "Failed to search players" }, { status: 500 });
    }
}
