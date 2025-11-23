const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const csvPath = path.join(__dirname, 'src', 'data', 'FOOTBALL_DATA_ACTIVE.csv');
const fileContent = fs.readFileSync(csvPath, 'utf8');

Papa.parse(fileContent, {
    header: true,
    complete: (results) => {
        const clubs = new Set();
        results.data.forEach(row => {
            if (row.current_club_name && row.current_club_name.toLowerCase().includes('fenerbahce')) {
                clubs.add(row.current_club_name);
            }
        });
        console.log("Matching Clubs:", Array.from(clubs));
    }
});
