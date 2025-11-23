const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../src/data/Season_2025-2026.csv');
const jsonPath = path.join(__dirname, '../src/data/players.json');

try {
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    // Simple CSV parser handling quotes
    function parseLine(text) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result.map(val => val.replace(/^"|"$/g, '')); // Remove surrounding quotes
    }

    function parseCSV(text) {
        const lines = text.trim().split('\n');
        const headers = parseLine(lines[0]);
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const currentLine = parseLine(lines[i]);
            // Allow for some flexibility in line length if trailing commas are missing
            if (currentLine.length >= headers.length - 1) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentLine[j];
                }
                data.push(obj);
            }
        }
        return data;
    }

    const rawData = parseCSV(csvContent);

    const positionsMap = {
        'GK': ['GK'],
        'DF': ['CB', 'LB', 'RB', 'LWB', 'RWB'],
        'MF': ['CM', 'CDM', 'CAM', 'LM', 'RM'],
        'FW': ['ST', 'LW', 'RW']
    };

    function getRandomPosition(generalPos) {
        if (!generalPos) return 'CM';
        // Handle combined positions like "MF,DF"
        const mainPos = generalPos.split(',')[0].trim();
        const options = positionsMap[mainPos] || ['CM'];
        return options[Math.floor(Math.random() * options.length)];
    }

    function calculateRating(player) {
        let rating = 75; // Base

        // League boost
        const topLeagues = ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'Ligue 1'];
        if (topLeagues.includes(player.League)) rating += 2;

        // Performance boost
        const mp = parseFloat(player.MP) || 0;
        const starts = parseFloat(player.Starts) || 0;
        const gls = parseFloat(player.Gls) || 0;
        const ast = parseFloat(player.Ast) || 0;

        if (mp > 20) rating += 3;
        if (starts > 20) rating += 3;

        // G/A boost
        if (gls + ast > 10) rating += 3;
        if (gls + ast > 20) rating += 3;

        // Random variation
        rating += Math.floor(Math.random() * 6) - 3;

        return Math.min(95, Math.max(60, rating));
    }

    function calculateValue(rating, age) {
        let baseValue = 5000000; // 5M

        // Rating multiplier (exponential)
        const ratingFactor = Math.pow(1.15, (rating - 75));

        // Age factor (younger is better, peak around 25-28)
        let ageFactor = 1;
        if (age < 22) ageFactor = 1.3;
        else if (age < 28) ageFactor = 1.1;
        else if (age > 32) ageFactor = 0.6;

        let value = baseValue * ratingFactor * ageFactor;
        return Math.round(value);
    }

    const players = rawData.map(p => {
        const rating = calculateRating(p);
        const age = parseInt(p.Age) || 25;

        return {
            id: parseInt(p.PlayerID) || Math.floor(Math.random() * 100000),
            name: p.Player,
            position: getRandomPosition(p.Pos),
            age: age,
            club: p.Squad,
            value: calculateValue(rating, age),
            rating: rating,
            image: undefined
        };
    });

    const output = {
        players: players
    };

    fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2));
    console.log(`Successfully imported ${players.length} players to ${jsonPath}`);

} catch (error) {
    console.error('Error importing players:', error);
    process.exit(1);
}
