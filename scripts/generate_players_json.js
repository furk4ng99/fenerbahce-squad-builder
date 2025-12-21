const fs = require('fs');
const path = require('path');

// Read CSV file
const csvPath = path.join(__dirname, '..', 'src', 'data', 'FOOTBALL_DATA_ACTIVE.csv');
const outputPath = path.join(__dirname, '..', 'public', 'data', 'global-players.json');

console.log('Reading CSV from:', csvPath);

const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

// Find column indices
const idIdx = headers.indexOf('player_id');
const nameIdx = headers.indexOf('player_name');
const imageIdx = headers.indexOf('player_image_url');
const positionIdx = headers.indexOf('main_position');
const clubIdIdx = headers.indexOf('current_club_id');
const clubNameIdx = headers.indexOf('current_club_name');

console.log('Column indices:', { idIdx, nameIdx, imageIdx, positionIdx, clubNameIdx });

// Position mapping from Transfermarkt to our app format
const positionMap = {
    'Goalkeeper': 'GK',
    'Defender': 'CB',
    'Midfield': 'CM',
    'Attack': 'ST',
    // More specific mappings can be added
};

const players = [];

for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Parse CSV line (handle quoted fields)
    const fields = [];
    let field = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            fields.push(field);
            field = '';
        } else {
            field += char;
        }
    }
    fields.push(field);

    const playerId = fields[idIdx];
    let playerName = fields[nameIdx] || '';
    const playerImage = fields[imageIdx] || '';
    const mainPosition = fields[positionIdx] || 'Midfield';
    const clubName = fields[clubNameIdx] || '';

    // Clean player name - remove ID suffix like "(238407)"
    playerName = playerName.replace(/\s*\(\d+\)$/, '').trim();

    if (!playerId || !playerName) continue;

    // Map position
    const position = positionMap[mainPosition] || 'CM';

    players.push({
        id: `global-${playerId}`,
        name: playerName,
        position: position,
        rating: 75, // Default rating
        value: 0,
        image: playerImage || 'https://img.a.transfermarkt.technology/portrait/header/default.jpg',
        club: clubName
    });
}

console.log(`Processed ${players.length} players`);

// Save to JSON
const output = { players };
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

console.log('Saved to:', outputPath);
console.log('Sample players:', players.slice(0, 3));
