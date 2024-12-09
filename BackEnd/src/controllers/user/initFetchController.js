// Import dei modelli
const Parco = require('../../models/Parco');
const Tag = require('../../models/Tag');
const Categoria = require('../../models/Categoria'); // Modello per la collection 'categorie'

const getParchiInit = async (req, res) => {
  try {
    // Recupera i parchi con i tag popolati
    const parchi = await Parco.find()
      .populate({
        path: 'tags.tagId', // Popola il riferimento al modello Tag
        populate: {
          path: 'categoria', // Popola il riferimento alla categoria all'interno di ogni tag
          model: 'Categoria'
        }
      });

    // Mappa i parchi per ottenere tag unici e categorie uniche
    const risultato = parchi.map(parco => {
      // Estrai i tag unici
      const tagsUnici = [
        ...new Set(
          parco.tags.map(tag => ({
            nome: tag.tagId?.nome || 'Tag non trovato', // Nome del tag
            count: tag.count // Numero di tag di quel tipo nel parco
          }))
        )
      ];

      // Estrai le categorie uniche
      const categorieUniche = [
        ...new Set(
          parco.tags.map(tag => tag.tagId?.categoria?.nome || 'Categoria non trovata')
        )
      ];

      return {
        nome: parco.nome, // Nome del parco
        id: parco._id, // ID del parco
        descrizione: parco.infoParco || 'Nessuna descrizione', // Descrizione del parco
        localizzazione: parco.location, // Coordinate del parco
        tags: tagsUnici, // Array di tag unici con count
        categorie: categorieUniche // Array di categorie uniche
      };
    });

    return risultato; // Risultato finale
  } catch (error) {
    console.error('Errore nel recupero dei parchi:', error);
    res.status(500).send('Errore nel recupero dei parchi');
  }
};

//scrivi la funzione getTagsForCategories, che ritorna un oggetto con le categorie come chiavi e i tag come valori
const getTagsForCategories = async () => {
  try {
    const categorie = await Categoria.find();
    const tags = await Tag.find().populate('categoria');

    const risultato = categorie.reduce((acc, cat) => {
      const tagForCategory = tags
        .filter(tag => tag.categoria.nome === cat.nome)
        .map(tag => tag.nome);

      return { ...acc, [cat.nome]: tagForCategory };
    }, {});

    return risultato;
  } catch (error) {
    console.error('Errore nel recupero delle categorie e dei tag:', error);
    return {};
  }
}

const getTagInit = async (req, res) => {
  const risultato = await getTagsForCategories();
  return risultato;
}

const init = async (req, res) => {
  parchi = await getParchiInit(req, res);
  categorie = await getTagInit(req, res);
  res.json({
    parchi: parchi,
    categorie: categorie
  })
}

module.exports = { 
  init,
  getParchiInit,
  getTagInit
 };
