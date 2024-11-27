const Tag = require('../../../models/Tag');
const Categoria = require('../../../models/Categoria');
const Parco = require('../../../models/Parco');
const validatePassword = require('../../../middleware/auth.js').validatePassword; 
// Funzione per aggiornare un parco
async function updateParco(req, res) {
    if (!validatePassword(password)) {
        return res.status(403).json({ message: 'Password non valida!' });
      }
  try {
    const { id } = req.params; // Ottieni l'ID dal parametro
    const updateData = req.body; // Ottieni i dati aggiornati dal corpo della richiesta

    const updatedParco = await Parco.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedParco) {
      return res.status(404).json({
        success: false,
        message: 'Parco non trovato',
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedParco,
    });
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del parco:', error);
    return res.status(500).json({
      success: false,
      message: 'Errore durante l\'aggiornamento del parco',
    });
  }
}

// Funzione per aggiornare una categoria
async function updateCategoria(req, res) {
    if (!validatePassword(password)) {
        return res.status(403).json({ message: 'Password non valida!' });
      }
  try {
    const { id } = req.params; // Ottieni l'ID dal parametro
    const updateData = req.body; // Ottieni i dati aggiornati dal corpo della richiesta

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
    if (!validatePassword(password)) {
        return res.status(403).json({ message: 'Password non valida!' });
      }
  try {
    const { id } = req.params; // Ottieni l'ID dal parametro
    const updateData = req.body; // Ottieni i dati aggiornati dal corpo della richiesta

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
