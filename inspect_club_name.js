const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const csvPath = path.join(__dirname, 'src', 'data', 'FOOTBALL_DATA_ACTIVE.csv');
const fileContent = fs.readFileSync(csvPath, 'utf8');

Papa.parse(fileContent, {
    header: true,
    complete: (results) => {
        const fbPlayers = results.data.filter(p => p.current_club_name && p.current_club_name.toLowerCase().includes('fenerbahce'));
        if (fbPlayers.length > 0) {
            const clubName = fbPlayers[0].current_club_name;
            console.log(`Club Name: '${clubName}'`);
            console.log(`Length: ${clubName.length}`);
            console.log('Char codes:', clubName.split('').map(c => c.charCodeAt(0)));
        } else {
            console.log("No Fenerbahce players found");
        }
    }
});
