const fs = require('fs');
const Papa = require('papaparse');

const csvPath = './src/data/FOOTBALL_DATA_ACTIVE.csv';
const fileContent = fs.readFileSync(csvPath, 'utf8');

Papa.parse(fileContent, {
    header: true,
    complete: (results) => {
        // Search for clubs containing "Fenerbah"
        const fenerbahceClubs = new Set();
        results.data.forEach(row => {
            if (row.current_club_name && row.current_club_name.toLowerCase().includes('fenerbah')) {
                fenerbahceClubs.add(row.current_club_name);
            }
        });

        console.log('Clubs containing "Fenerbah":');
        fenerbahceClubs.forEach(club => console.log(' -', club));

        // Find all players from the first matching club
        if (fenerbahceClubs.size > 0) {
            const clubName = Array.from(fenerbahceClubs)[0];
            console.log(`\nPlayers from "${clubName}":`);
            const players = results.data
                .filter(row => row.current_club_name === clubName && row.player_name)
                .slice(0, 30);

            players.forEach(p => {
                console.log(`  - ${p.player_name} (${p.position})`);
            });
            console.log(`\nTotal: ${players.length} players shown (out of all Fenerbahçe players)`);
        } else {
            console.log('\nNo Fenerbahçe club found in the CSV!');
        }
    }
});
