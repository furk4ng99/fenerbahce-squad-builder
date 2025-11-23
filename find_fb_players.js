const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const csvPath = path.join(__dirname, 'src', 'data', 'FOOTBALL_DATA_ACTIVE.csv');
const fileContent = fs.readFileSync(csvPath, 'utf8');

Papa.parse(fileContent, {
    header: true,
    complete: (results) => {
        const osayi = results.data.find(p => p.player_name && p.player_name.includes('Osayi'));
        console.log("Osayi:", osayi);
    }
});
