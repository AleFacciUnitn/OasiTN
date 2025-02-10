const Tag = require('../../../models/Tag');
const Categoria = require('../../../models/Categoria');
const Parco = require('../../../models/Parco');
const mongoose = require('mongoose');

const validatePassword = require('../../../middleware/auth.js').validatePassword; 
// Funzione per cancellare un parco
async function deleteParco(req, res) {
    // prendi la password dall'header
    const password = req.headers.password;
    if (!validatePassword(password)) {
        return res.status(403).json({ message: 'Password non valida!' });
      }
  try {
    const { id } = req.params;
    if(!id || !mongoose.isValidObjectId(parcoId)) {
      return res.status(400).json({ error: "Dati non validi" });
    }
    const deletedParco = await Parco.findByIdAndDelete(id);

    if (!deletedParco) {
      return res.status(404).json({
        success: false,
        message: 'Parco non trovato',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Parco eliminato con successo',
    });
  } catch (error) {
    console.error('Errore durante l\'eliminazione del parco:', error);
    return res.status(500).json({
      success: false,
      message: 'Errore durante l\'eliminazione del parco',
    });
  }
}

// Funzione per cancellare una categoria
async function deleteCategoria(req, res) {
    const password = req.headers.password;
    if (!validatePassword(password)) {
        return res.status(403).json({ message: 'Password non valida!' });
      }
  try {
    const { id } = req.params;

    const deletedCategoria = await Categoria.findByIdAndDelete(id);

    if (!deletedCategoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoria non trovata',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Categoria eliminata con successo',
    });
  } catch (error) {
    console.error('Errore durante l\'eliminazione della categoria:', error);
    return res.status(500).json({
      success: false,
      message: 'Errore durante l\'eliminazione della categoria',
    });
  }
}

// Funzione per cancellare un tag
async function deleteTag(req, res) {
    const password = req.headers.password;

    if (!validatePassword(password)) {
        return res.status(403).json({ message: 'Password non valida!' });
      }
  try {
    const { id } = req.params;

    const deletedTag = await Tag.findByIdAndDelete(id);

    if (!deletedTag) {
      return res.status(404).json({
        success: false,
        message: 'Tag non trovato',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tag eliminato con successo',
    });
  } catch (error) {
    console.error('Errore durante l\'eliminazione del tag:', error);
    return res.status(500).json({
      success: false,
      message: 'Errore durante l\'eliminazione del tag',
    });
  }
}

module.exports = {
  deleteParco,
  deleteCategoria,
  deleteTag,
};
