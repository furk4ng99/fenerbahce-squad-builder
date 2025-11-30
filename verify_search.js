
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Mock request/response for testing logic
const mockDataPath = path.join(process.cwd(), "src", "data", "FOOTBALL_DATA_ACTIVE.csv");

const parseCurrency = (value) => {
    if (!value) return 0;
    return parseFloat(value.replace(/[^0-9.-]+/g, ""));
};

const runTest = () => {
    console.log("Loading data...");
    const fileContent = fs.readFileSync(mockDataPath, "utf8");
    const results = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
    });

    let players = results.data;
    const query = "fenerbahce";

    console.log(`Searching for: ${query}`);

    // Filter
    players = players.filter(p =>
        (p.player_name && p.player_name.toLowerCase().includes(query)) ||
        (p.current_club_name && p.current_club_name.toLowerCase().includes(query))
    );

    console.log(`Found ${players.length} players.`);

    // Sort (The Logic We Added)
    players.sort((a, b) => {
        const valA = parseCurrency(a.market_value_in_eur);
        const valB = parseCurrency(b.market_value_in_eur);
        return valB - valA;
    });

    // Check top 5
    console.log("Top 5 players after sort:");
    players.slice(0, 5).forEach((p, i) => {
        console.log(`${i + 1}. ${p.player_name} - Value: ${p.market_value_in_eur}`);
    });
};

runTest();
