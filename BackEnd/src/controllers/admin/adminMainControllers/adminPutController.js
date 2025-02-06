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
      const {
        nome,
        localizzazione,
        descrizione,
        addTags,
        removeTagIds,
        password
      } = req.body; // Dati dal corpo della richiesta
      console.log(password);
    if (!validatePassword(password)) {
        return res.status(403).json({ message: 'Password non valida!' });
      }
      // Trova il parco
      const parco = await Parco.findById(parcoId);
  
      if (!parco) {
        return res.status(404).json({ message: 'Parco non trovato' });
      }
  
      // Aggiornamento delle informazioni esistenti
      if (nome) parco.nome = nome;
      if (localizzazione) {
        parco.location = {
          lat: localizzazione.lat || parco.location.lat,
          long: localizzazione.long || parco.location.long,
        };
      }
      if (descrizione) parco.infoParco = descrizione;
  
      // Aggiunta di nuovi tag
      if (addTags && Array.isArray(addTags)) {
        for (const tag of addTags) {
          // Verifica se il count corrisponde alla lunghezza dell'array positions
          if (tag.count !== (tag.positions?.length || 0)) {
            return res.status(400).json({
              message: `Il tag con ID ${tag.tagId} ha un count (${tag.count}) incoerente con il numero di posizioni (${tag.positions?.length || 0}).`,
            });
          }
  
          // Verifica se il tagId è già presente
          const existingTag = parco.tags.find(
            (existing) => existing.tagId.toString() === tag.tagId
          );
  
          if (existingTag) {
            // Aggiorna il conteggio e aggiungi posizioni
            existingTag.count += tag.count || 0;
            existingTag.positions.push(...(tag.positions || []));
          } else {
            // Aggiungi il nuovo tag
            parco.tags.push({
              tagId: tag.tagId,
              count: tag.count || 0,
              positions: tag.positions || [],
            });
          }
        }
      }
  
      // Eliminazione di tag
      if (removeTagIds && Array.isArray(removeTagIds)) {
        parco.tags = parco.tags.filter(
          (tag) => !removeTagIds.includes(tag.tagId.toString())
        );
      }
  
      // Verifica la coerenza del count e della lunghezza di positions nei tag esistenti
      for (const tag of parco.tags) {
        if (tag.count !== tag.positions.length) {
          return res.status(400).json({
            message: `Il tag con ID ${tag.tagId} ha un count (${tag.count}) incoerente con il numero di posizioni (${tag.positions.length}).`,
          });
        }
      }
  
      // Salva il parco aggiornato
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
    const updateData = { nome: reformatName(nome), categoria: nomeCategoria }; // Crea un oggetto con i dati aggiornati
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
