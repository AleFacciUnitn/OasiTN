const Segnalazione = require('../../models/Segnalazione');
const crypto = require('crypto');

// Funzione per generare MD5
const generateMD5 = (text) => {
  return crypto.createHash('md5').update(text).digest('hex');
};

// Funzione di validazione della password
const validatePassword = (passwordFromRequest) => {
  const hardcodedPassword = '1234';  // Cambia con una password più sicura
  return generateMD5(passwordFromRequest) === generateMD5(hardcodedPassword);
};


const getSegnalazioni = async (req, res) => {
    try {
        const segnalazioni = await Segnalazione.find();
        res.json(segnalazioni);
    } catch (error) {
        console.error('Errore nel recupero delle segnalazioni:', error);
        res.status(500).send('Errore nel recupero delle segnalazioni');
    }
}


// Funzione per aggiornare lo stato di una segnalazione
const updateSegnalazioneStato = async (req, res) => {
  const { id, stato, password } = req.body;

  // Verifica la password
  if (!validatePassword(password)) {
    return res.status(403).json({ message: 'Password non valida!' });
  }

  // Verifica che lo stato sia valido
  if (!['in attesa', 'in lavorazione', 'completata', 'annullata'].includes(stato)) {
    return res.status(400).json({ message: 'Stato non valido.' });
  }

  try {
    // Trova la segnalazione
    const segnalazione = await Segnalazione.findById(id);
    if (!segnalazione) {
      return res.status(404).json({ message: 'Segnalazione non trovata.' });
    }

    // Aggiorna lo stato
    segnalazione.stato = stato;
    await segnalazione.save();

    return res.status(200).json({ message: 'Stato della segnalazione aggiornato.', segnalazione });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della segnalazione:', error);
    return res.status(500).json({ message: 'Errore interno del server.' });
  }
};

//scrivi resolveSegnalazione, che setta lo stato della segnalazione a 'completata', e aggiunge un tempo di vita alla segnalazione di un mese
const resolveSegnalazione = async (req, res) => {
    const { id, password } = req.body;
    
    // Verifica la password
    if (!validatePassword(password)) {
        return res.status(403).json({ message: 'Password non valida!' });
    }
    
    try {
        // Trova la segnalazione
        const segnalazione = await Segnalazione.findById(id);
        if (!segnalazione) {
        return res.status(404).json({ message: 'Segnalazione non trovata.' });
        }
    
        // Aggiorna lo stato
        segnalazione.stato = 'completata';
// Aggiungi un auto-delete dal database in 1 mese
        segnalazione.scadenza = Date.now() + 1000;

        await segnalazione.save();
        return res.status(200).json({ message: 'Segnalazione completata.', segnalazione });
    } catch (error) {
        console.error('Errore durante la risoluzione della segnalazione:', error);
        return res.status(500).json({ message: 'Errore interno del server.' });
    }
    }


module.exports = {
    updateSegnalazioneStato,
    resolveSegnalazione,
    getSegnalazioni
};
