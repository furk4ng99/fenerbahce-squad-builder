import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { Player, Position } from '@/types';

// Define the CSV row interface based on the file structure
interface PlayerRow {
    player_id: string;
    player_name: string;
    player_image_url: string;
    position: string;
    current_club_name: string;
    citizenship: string;
}

// Helper to map CSV position to our Position type
const mapPosition = (csvPosition: string): Position => {
    const pos = csvPosition.toLowerCase();

    if (pos.includes('goalkeeper')) return 'GK';

    // Defenders
    if (pos.includes('centre-back')) return 'CB';
    if (pos.includes('left-back')) return 'LB';
    if (pos.includes('right-back')) return 'RB';
    if (pos.includes('defender')) return 'CB'; // Default defender

    // Midfielders
    if (pos.includes('defensive midfield')) return 'CDM';
    if (pos.includes('attacking midfield')) return 'CAM';
    if (pos.includes('left midfield')) return 'LM';
    if (pos.includes('right midfield')) return 'RM';
    if (pos.includes('central midfield') || pos.includes('midfield')) return 'CM';

    // Attackers
    if (pos.includes('left winger')) return 'LW';
    if (pos.includes('right winger')) return 'RW';
    if (pos.includes('centre-forward') || pos.includes('striker')) return 'ST';
    if (pos.includes('second striker')) return 'ST'; // Treat as striker
    if (pos.includes('attack')) return 'ST'; // Default attacker

    return 'CM'; // Fallback
};

// Helper to generate a deterministic rating (since it's missing in CSV)
const getRating = (id: string): number => {
    const numId = parseInt(id, 10) || 0;
    return 75 + (numId % 18); // 75-92
};

// Helper to generate a deterministic market value (in millions)
const getValue = (id: string): number => {
    const numId = parseInt(id, 10) || 0;
    return 1 + (numId % 100); // 1-100M
};

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const club = searchParams.get('club') || '';
    const limit = parseInt(searchParams.get('limit') || '50');

    try {
        const csvPath = path.join(process.cwd(), 'src', 'data', 'FOOTBALL_DATA_ACTIVE.csv');
        const fileContent = fs.readFileSync(csvPath, 'utf8');

        const results = await new Promise<Papa.ParseResult<PlayerRow>>((resolve) => {
            Papa.parse(fileContent, {
                header: true,
                complete: resolve,
            });
        });

        let filteredPlayers = results.data
            .filter((row: PlayerRow) => {
                if (!row.player_name || !row.position) return false;

                // Priority 1: Filter by club if specified (e.g., for default Fenerbahçe load)
                if (club && club.trim() !== '') {
                    return row.current_club_name?.toLowerCase() === club.toLowerCase();
                }

                // Priority 2: Filter by search query if provided
                if (query && query.trim() !== '') {
                    const lowerQuery = query.toLowerCase();
                    return row.player_name.toLowerCase().includes(lowerQuery) ||
                        row.current_club_name?.toLowerCase().includes(lowerQuery);
                }

                // Default: return all players (for initial generic load)
                return true;
            })
            .slice(0, limit) // Limit results
            .map((row: PlayerRow): Player => ({
                id: `csv-${row.player_id}`,
                name: row.player_name.replace(/\s*\(\d+\)$/, ''), // Clean name
                position: mapPosition(row.position),
                rating: getRating(row.player_id),
                value: getValue(row.player_id),
                image: row.player_image_url,
                club: row.current_club_name || 'Unknown'
            }));

        return NextResponse.json({ players: filteredPlayers });
    } catch (error) {
        console.error('Error processing players:', error);
        return NextResponse.json({ error: 'Failed to fetch players', players: [] }, { status: 500 });
    }
}
