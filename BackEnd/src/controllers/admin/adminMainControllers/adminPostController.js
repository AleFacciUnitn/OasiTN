// controllers/adminController.js
const Tag = require('../../../models/Tag');
const Categoria = require('../../../models/Categoria');
const Parco = require('../../../models/Parco');
const mongoose = require('mongoose');
const validatePassword = require('../../../middleware/auth.js').validatePassword; 

// Funzione per generare MD5

const reformatNome = (nome) => {
  return nome.toLowerCase().replace(/\s/g, '-');
};




// Aggiungi una nuova categoria
const addCategoria = async (req, res) => {
  let { nome, descrizione, password } = req.body;
  nome = reformatNome(nome);
  if(!nome || !password) {
    return res.status(400).json({ error: "Dati non validi" });
  }
  // Verifica la password
  if (!validatePassword(password)) {
    return res.status(403).json({ message: 'Password non valida!' });
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
    let { nome, nomeCategoria, password } = req.body;
    if(!nome || !nomeCategoria || !password) {
      return res.status(400).json({ error: "Dati non validi" });
    }
    nome = reformatNome(nome);
    //Controllo della password
    if (!validatePassword(password)) {
      return res.status(403).json({ error: 'Password non valida' });
    }

    // Controllo della validità della categoria
    const categoria = await Categoria.findOne({ nome: nomeCategoria });
    if (!categoria) {
      return res.status(400).json({ error: 'Categoria non valida' });
    }



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
    let tagDetails;
    // Mappatura e verifica dei tag
    try{
      tagDetails = await Promise.all(tags.map(async (tag) => {
      //TODO: cambia nome in tagId
      const { tagId, count, positions } = tag;
      
      //TODO: cambia tutte le occorrenze di nome in tagId.nome
      // Verifica che i campi siano presenti
      if (!tagId || !count || !positions || !Array.isArray(positions) || !mongoose.isValidObjectId(tagId)) {
        throw new Error("Dati tag mancanti o non validi");
      }

      // Trova l'ID del tag corrispondente al nome
      const tagFromDb = await Tag.findById(tagId);
      if (!tagFromDb) {
        throw new Error(`Il tag con id '${tagId}' non esiste`);
      }

      // Verifica il numero delle posizioni
      if (positions.length !== count) {
        throw new Error(`Il numero di posizioni non corrisponde a 'count' per il tag '${nome}'`);
      }

      // Verifica ogni posizione
      const validPositions = positions.map(pos => {
        if (typeof pos.lat !== 'number' || typeof pos.long !== 'number') {
          throw new Error(`Le posizioni del tag '${tagFromDb.nome}' non sono valide`);
        }
        return { lat: pos.lat, long: pos.long }; // Conformità alla validation
      });

      // Ritorna il dettaglio del tag con l'ID
      return {
        tagId: tagId, // Assicura che sia un ObjectId
        count,
        positions: validPositions
      };
    }));
    }catch(error){
      return res.status(400).json({ error: error.message });
    }

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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
