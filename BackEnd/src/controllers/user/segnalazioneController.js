const Segnalazione = require('../../models/Segnalazione');
const Parco = require('../../models/Parco');
const { updateMany } = require('../../models/Tag');

// Aggiungi una segnalazione
const addSegnalazione = async (req, res) => {
  const { parcoId, oggetto, descrizione, priorita } = req.body;
  // Controllo validità della password

  // Verifica se il parco esiste
  const parco = await Parco.findById(parcoId);
  if (!parco) {
    return res.status(400).json({ error: "Parco non trovato" });
  }

  // Controllo sulla priorità (compresa tra 1 e 4)
  if (priorita < 1 || priorita > 4) {
    return res.status(400).json({ error: "La priorità deve essere un numero tra 1 e 4" });
  }

  try {
    // Crea la segnalazione
    const nuovaSegnalazione = new Segnalazione({
      parco: parcoId,
      oggetto,
      descrizione,
      priorita,
    });

    // Salva la segnalazione nel database
    await nuovaSegnalazione.save();

    // Risposta di successo
    res.status(201).json({ message: "Segnalazione aggiunta con successo", segnalazione: nuovaSegnalazione });
  } catch (error) {
    console.error("Errore durante l'aggiunta della segnalazione:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addSegnalazione };
