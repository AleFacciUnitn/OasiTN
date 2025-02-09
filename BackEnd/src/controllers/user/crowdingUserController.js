const CrowdingRaw = require('../../models/CrowdingRaw'); // Adjust the path as necessary
const Parco = require('../../models/Parco');

// Aggiungi una segnalazione
const addCrowdingReport = async (req, res) => {
  const { parcoId, crowding } = req.body;
  if(!parcoId || !oggetto || !descrizione || !priorita || !mongoose.isValidObjectId(parcoId)) {
    return res.status(400).json({ error: "Dati non validi" });
  }

  // Controllo validità della password

  // Verifica se il parco esiste
  const parco = await Parco.findById(parcoId);
  if (!parco) {
    return res.status(400).json({ error: "Parco non trovato" });
  }

  // Controllo sulla priorità (compresa tra 1 e 4)
  if (crowding < 1 || crowding > 5) {
    return res.status(400).json({ error: "L'affollamento deve essere un numero tra 1 e 5" });
  }

  try {
    // Crea la segnalazione
    const crowdingReport = new CrowdingRaw({
      parco: parcoId,
      timestamp: Date.now(),
        crowding
    });

    // Salva la segnalazione nel database
    await crowdingReport.save();

    // Risposta di successo
    res.status(201).json({ message: "Segnalazione aggiunta con successo", crowdingReport: crowdingReport });
  } catch (error) {
    console.error("Errore durante l'aggiunta della segnalazione:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addCrowdingReport };
