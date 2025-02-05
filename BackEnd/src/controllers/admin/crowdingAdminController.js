const CrowdingData = require('../../models/CrowdingData'); // Adjust the path as necessary
const computeCrowdings = require('../../middleware/computeCrowdings');
// Aggiungi una segnalazione
const getCrowdingReport = async (req, res) => {
  // Controllo validità della password

  // Verifica se il parco esiste
  
  try {
    await computeCrowdings();
    const crowdingData = await CrowdingData.find();
    let crowdingList = {};
    crowdingData.forEach(entry => {
        const { parco, crowding } = entry;
        if (!crowdingList[parco]) {
            crowdingList[parco] = {};
        }
        crowdingList[parco][entry.day] = crowding;
    });
    // Risposta di successo
    res.json(crowdingList);
} catch (error) {
    console.error("Errore durante l'aggiunta della segnalazione:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCrowdingReport };
