// controllers/adminController.js
const Tag = require('../../models/Tag');
const Categoria = require('../../models/Categoria');
const Parco = require('../../models/Parco');
const crypto = require('crypto');

// Funzione per generare MD5
const generateMD5 = (text) => {
  return crypto.createHash('md5').update(text).digest('hex');
};

const reformatNome = (nome) => {
  return nome.toLowerCase().replace(/\s/g, '-');
};

// Funzione di validazione della password
const validatePassword = (passwordFromRequest) => {
  const hardcodedPassword = '1234';  // Cambia con una password più sicura
  return generateMD5(passwordFromRequest) === generateMD5(hardcodedPassword);
};

// Aggiungi una nuova categoria
const addCategoria = async (req, res) => {
  const { nome, descrizione, password } = req.body;
  nome = reformatNome(nome);
  // Verifica la password
  if (!validatePassword(password)) {
    return res.status(403).json({ message: 'Password non valida!' });
  }

  // Verifica se i campi obbligatori sono presenti
  if (!nome) {
    return res.status(400).json({ message: 'Il nome della categoria è obbligatorio.' });
  }

  try {
    // Verifica se la categoria esiste già
    const categoriaEsistente = await Categoria.findOne({ nome });
    if (categoriaEsistente) {
      return res.status(400).json({ message: 'Categoria già esistente.' });
    }

    // Crea una nuova categoria
    const nuovaCategoria = new Categoria({
      nome: nome,
      descrizione
    });

    // Salva la categoria nel database
    await nuovaCategoria.save();
    return res.status(201).json({ message: 'Categoria aggiunta con successo!', categoria: nuovaCategoria });
  } catch (error) {
    console.error('Errore durante l\'aggiunta della categoria:', error);
    return res.status(500).json({ message: 'Errore interno del server.' });
  }
};

// Funzione per aggiungere un tag
const addTag = async (req, res) => {
  try {
    const { nome, nomeCategoria, password } = req.body;
    nome = reformatNome(nome);
    // Controllo della validità della categoria
    const categoria = await Categoria.findOne({ nome: nomeCategoria });
    if (!categoria) {
      return res.status(400).json({ error: 'Categoria non valida' });
    }

    // Controllo della validità dei dati (esempio con una password hardcoded)

    if (!validatePassword(password)) {
      return res.status(403).json({ error: 'Password non valida' });
    }

    console.log('Categoria:', categoria);
    // Creazione del nuovo tag
    const newTag = new Tag({
      nome: nome,
      categoria: categoria._id // Reference alla categoria
    });

    // Salvataggio del tag
    await newTag.save();

    res.status(201).json({
      message: 'Tag aggiunto con successo',
      tag: newTag
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel server' });
  }
};


// Aggiungi un parco
const addParco = async (req, res) => {
  try {
    const { nome, location, tags, infoParco, password } = req.body;

    // Controllo validità della password
    if (!validatePassword(password)) {
      return res.status(403).json({ error: "Password non valida" });
    }

    // Controllo validità del corpo della richiesta
    if (!nome || !location || typeof location.lat !== 'number' || typeof location.long !== 'number') {
      return res.status(400).json({ error: "Dati mancanti o non validi (nome o location)" });
    }

    // Mappatura e verifica dei tag
    const tagDetails = await Promise.all(tags.map(async (tag) => {
      const { nome, count, positions } = tag;
      // Verifica che i campi siano presenti
      if (!nome || !count || !positions || !Array.isArray(positions)) {
        throw new Error("Dati tag mancanti o non validi");
      }

      // Trova l'ID del tag corrispondente al nome
      const tagFromDb = await Tag.findOne({ nome });
      if (!tagFromDb) {
        throw new Error(`Il tag con nome '${nome}' non esiste`);
      }

      // Verifica il numero delle posizioni
      if (positions.length !== count) {
        throw new Error(`Il numero di posizioni non corrisponde a 'count' per il tag '${nome}'`);
      }

      // Verifica ogni posizione
      const validPositions = positions.map(pos => {
        if (typeof pos.lat !== 'number' || typeof pos.long !== 'number') {
          throw new Error(`Le posizioni del tag '${nome}' non sono valide`);
        }
        return { lat: pos.lat, long: pos.long }; // Conformità alla validation
      });

      // Ritorna il dettaglio del tag con l'ID
      return {
        tagId: tagFromDb._id, // Assicura che sia un ObjectId
        count,
        positions: validPositions
      };
    }));

    // Creazione del nuovo parco
    const newParco = new Parco({
      nome,
      location: {
        lat: location.lat,
        long: location.long
      },
      tags: tagDetails,
      infoParco
    });

    // Salvataggio nel database
    await newParco.save();

    // Risposta di successo
    res.status(201).json({ message: "Parco aggiunto con successo", parco: newParco });
  } catch (error) {
    console.error("Errore durante l'aggiunta del parco:", error.message);
    res.status(500).json({ error: error.message });
  }
};



// Export delle funzioni
module.exports = {
  addCategoria,
  addTag,
  addParco
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    