const Tag = require('../../../models/Tag');
const Categoria = require('../../../models/Categoria');
const Parco = require('../../../models/Parco');
const validatePassword = require('../../../middleware/auth.js').validatePassword; 

const reformatNome = (nome) => {
    return nome.toLowerCase().replace(/\s/g, '-');
  };
// Funzione per aggiornare un parco

const updateParco = async (req, res) => {
    try {
      const parcoId = req.params.id; // ID del parco dalla URL
      const { nome, location, tags, infoParco, password } = req.body; // Dati dal corpo della richiesta
      console.log(password);
    if (!validatePassword(password)) {
        return res.status(403).json({ message: 'Password non valida!' });
      }

      if (!nome || !location || typeof location.lat !== 'number' || typeof location.long !== 'number') {
        return res.status(400).json({ error: "Dati mancanti o non validi (nome o location)" });
      }
  
      // Mappatura e verifica dei tag
      const tagDetails = await Promise.all(tags.map(async (tag) => {
        //TODO: cambia nome in tagId
        const { tagId, count, positions } = tag;
        
        //TODO: cambia tutte le occorrenze di nome in tagId.nome
        // Verifica che i campi siano presenti
        if (!tagId || !count || !positions || !Array.isArray(positions)) {
          throw new Error("Dati tag mancanti o non validi");
        }
  
        // Trova l'ID del tag corrispondente al nome
        const tagFromDb = await Tag.findById(tagId._id);
        if (!tagFromDb) {
          throw new Error(`Il tag con id '${_id}' non esiste`);
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
          tagId: tagId._id, // Assicura che sia un ObjectId
          count: count,
          positions: validPositions
        };
      }));
      // Creazione del nuovo parco
      const updatedInfoParco = {
        nome,
        location: {
          lat: location.lat,
          long: location.long
        },
        tags: tagDetails,
        infoParco
      };
      // Trova il parco
      const parco = await Parco.findByIdAndUpdate(parcoId, updatedInfoParco, { new: true });
  
      if (!parco) {
        return res.status(404).json({ message: 'Parco non trovato' });
      }
  
      // Aggiornamento delle informazioni esistenti
      // if (nome) parco.nome = nome;
      // if (localizzazione) {
      //   parco.location = {
      //     lat: localizzazione.lat || parco.location.lat,
      //     long: localizzazione.long || parco.location.long,
      //   };
      // }
      // if (descrizione) parco.infoParco = descrizione;
  
      // // Aggiunta di nuovi tag
      // if (addTags && Array.isArray(addTags)) {
      //   for (const tag of addTags) {
      //     // Verifica se il count corrisponde alla lunghezza dell'array positions
      //     if (tag.count !== (tag.positions?.length || 0)) {
      //       return res.status(400).json({
      //         message: `Il tag con ID ${tag.tagId} ha un count (${tag.count}) incoerente con il numero di posizioni (${tag.positions?.length || 0}).`,
      //       });
      //     }
  
      //     // Verifica se il tagId è già presente
      //     const existingTag = parco.tags.find(
      //       (existing) => existing.tagId.toString() === tag.tagId
      //     );
  
      //     if (existingTag) {
      //       // Aggiorna il conteggio e aggiungi posizioni
      //       existingTag.count += tag.count || 0;
      //       existingTag.positions.push(...(tag.positions || []));
      //     } else {
      //       // Aggiungi il nuovo tag
      //       parco.tags.push({
      //         tagId: tag.tagId,
      //         count: tag.count || 0,
      //         positions: tag.positions || [],
      //       });
      //     }
      //   }
      // }
  
      // // Eliminazione di tag
      // if (removeTagIds && Array.isArray(removeTagIds)) {
      //   parco.tags = parco.tags.filter(
      //     (tag) => !removeTagIds.includes(tag.tagId.toString())
      //   );
      // }
  
      // // Verifica la coerenza del count e della lunghezza di positions nei tag esistenti
      // for (const tag of parco.tags) {
      //   if (tag.count !== tag.positions.length) {
      //     return res.status(400).json({
      //       message: `Il tag con ID ${tag.tagId} ha un count (${tag.count}) incoerente con il numero di posizioni (${tag.positions.length}).`,
      //     });
      //   }
      // }
  
      // // Salva il parco aggiornato
      await parco.save();
  
      res.json({ message: 'Parco aggiornato con successo', parco });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Errore durante l\'aggiornamento del parco' });
    }
  };

// Funzione per aggiornare una categoria
async function updateCategoria(req, res) {
  try {
    const password  = req.body.password;
    if (!validatePassword(password)) {
        return res.status(403).json({ message: 'Password non valida!' });
      }
    const { id } = req.params; // Ottieni l'ID dal parametro
    let updateData = req.body; // Ottieni i dati aggiornati dal corpo della richiesta
    updateData.nome = reformatNome(updateData.nome);
    const updatedCategoria = await Categoria.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCategoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoria non trovata',
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedCategoria,
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento della categoria:', error);
    return res.status(500).json({
      success: false,
      message: 'Errore durante l\'aggiornamento della categoria',
    });
  }
}

// Funzione per aggiornare un tag
async function updateTag(req, res) {
    
  try {
    const { id } = req.params; // Ottieni l'ID dal parametro
    let {nome, nomeCategoria, password} = req.body; // Ottieni i dati aggiornati dal corpo della richiesta
    if (!validatePassword(password)) {
        return res.status(403).json({ message: 'Password non valida!' });
    }
    const categoria = await Categoria.findOne({ nome: reformatNome(nomeCategoria) }); // Trova la categoria
    if(!categoria){
        return res.status(400).json({
            success: false,
            message: 'Categoria non valida',
        });
    }
    const idCategoria = categoria._id;
    const updateData = { nome: reformatNome(nome), categoria: idCategoria}; // Crea un oggetto con i dati aggiornati
    const updatedTag = await Tag.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedTag) {
      return res.status(404).json({
        success: false,
        message: 'Tag non trovato',
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedTag,
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del tag:', error);
    return res.status(500).json({
      success: false,
      message: 'Errore durante l\'aggiornamento del tag',
    });
  }
}

module.exports = {
  updateParco,
  updateCategoria,
  updateTag,
};
