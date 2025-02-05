const CrowdingRaw = require('../models/CrowdingRaw'); // Adjust the path as necessary
const CrowdingData = require('../models/CrowdingData'); // Adjust the path as necessary


function getDayOfWeek(timestamp) {
    const date = new Date(timestamp);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getUTCDay()];
}

async function computeCrowdings() {
    try {
        const crowdingData = await CrowdingRaw.find();

        const crowdingList = {};

        crowdingData.forEach(entry => {
            const { parco, crowding } = entry;
            const day = getDayOfWeek(entry.timestamp);
            if (!crowdingList[parco]) {
                crowdingList[parco] = {};
            }

            if (!crowdingList[parco][day]) {
                crowdingList[parco][day] = [];
            }

            crowdingList[parco][day].push(crowding);
        });

        for (const parco in crowdingList) {
            for (const day in crowdingList[parco]) {
                const crowdingValues = crowdingList[parco][day];
                const averageCrowding = crowdingValues.reduce((a, b) => a + b, 0) / crowdingValues.length;

                // Aggiorna se esiste, altrimenti crea un nuovo documento
                await CrowdingData.findOneAndUpdate(
                    { parco, day }, // Condizione di ricerca
                    { $set: { crowding: averageCrowding } }, // Dati da aggiornare
                    { upsert: true, new: true } // Crea se non esiste (upsert)
                );
            }
        }
            
    } catch (error) {
        console.error('Error computing crowdings:', error);
    }
}

module.exports = computeCrowdings;