const Tag = require('../../../models/Tag');
const Categoria = require('../../../models/Categoria');
const Parco = require('../../../models/Parco');
//Questo si potrà cambiare con l'authentication vera e propria
const validatePassword = require('../../../middleware/auth.js').validatePassword; 

// Funzione per ottenere tutti i parchi con tutte le informazioni
async function getParchi(req, res) {
    const password = req.headers.password;

    if (!validatePassword(req)) {
        return res.status(403).json({ message: 'Password non valida!' });
    }
  try {
    let Parchi;
    if(req.params.id){
        Parchi = await Parco.find({_id: req.params.id})
        .populate({
            path: 'tags.tagId', // Popola il riferimento al modello Tag
            populate: {
              path: 'categoria', // Popola il riferimento alla categoria all'interno di ogni tag
              model: 'Categoria'
            }
          });
    }else{
        Parchi = await Parco.find({})
        .populate({
            path: 'tags.tagId', // Popola il riferimento al modello Tag
            populate: {
              path: 'categoria', // Popola il riferimento alla categoria all'interno di ogni tag
              model: 'Categoria'
            }
          });
    } // Popola i tag associati

    return res.status(200).json({
      success: true,
      data: Parchi,
    });
  } catch (error) {
    console.error('Errore durante il recupero dei parchi:', error);
    return res.status(500).json({
      success: false,
      message: 'Errore durante il recupero dei parchi',
    });
  }
}

// Funzione per ottenere tutte le categorie
async function getCategorie(req, res) {
    const password = req.headers.password;
    if (!validatePassword(password)) {
        return res.status(403).json({ message: 'Password non valida!' });
      }
  try {
    let Categorie;
    if(req.params.id){
        Categorie = await Categoria.find({nome: req.params.id});
    }else{
        Categorie = await Categoria.find({});
    }
    return res.status(200).json({
      success: true,
      data: Categorie,
    });
  } catch (error) {
    console.error('Errore durante il recupero delle categorie:', error);
    return res.status(500).json({
      success: false,
      message: 'Errore durante il recupero delle categorie',
    });
  }
}

// Funzione per ottenere tutti i tag
async function getTags(req, res) {
    const password = req.headers.password;
    if (!validatePassword(password)) {
        return res.status(403).json({ message: 'Password non valida!' });
      }
  try {
    let tags;
    if(req.params.id){
        tags = await Tag.find({nome: req.params.id});
    }else{
        tags = await Tag.find({});
    }
    return res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error('Errore durante il recupero dei tag:', error);
    return res.status(500).json({
      success: false,
      message: 'Errore durante il recupero dei tag',
    });
  }
}

module.exports = {
  getParchi,
  getCategorie,
  getTags,
};
