// routes/adminRoute.js
const express = require('express');
const { addCategoria, addTag, addParco } = require('../controllers/admin/adminMainControllers/adminPostController'); // Importa i controller
const { getCategorie, getTags, getParchi } = require('../controllers/admin/adminMainControllers/adminGetController');
const { updateCategoria, updateTag, updateParco } = require('../controllers/admin/adminMainControllers/adminPutController');
const { deleteCategoria, deleteTag, deleteParco } = require('../controllers/admin/adminMainControllers/adminDeleteController');
const { resolveSegnalazione, updateSegnalazioneStato, getSegnalazioni } = require('../controllers/admin/adminSegnalazioniController');
const { get } = require('mongoose');

const router = express.Router();

// Route per azioni su categoria
router.get('/Categoria', getCategorie);
router.get('/Categoria/:id', getCategorie);
router.post('/Categoria', addCategoria);
router.put('/Categoria/:id', updateCategoria);
router.delete('/Categoria/:id', deleteCategoria);



// Route per azioni su tag

router.get('/Tag', getTags);
router.get('/Tag/:id', getTags);
router.post('/Tag', addTag);
router.put('/Tag/:id', updateTag);
router.delete('/Tag/:id', deleteTag);

// Route per azioni su parco
router.get('/Parco', getParchi);
router.get('/Parco/:id', getParchi);
router.post('/Parco', addParco);
router.put('/Parco/:id', updateParco);
router.delete('/Parco/:id', deleteParco);

// Route per azioni su segnalazioni
router.get('/Segnalazioni', getSegnalazioni);
router.put('/Segnalazioni', updateSegnalazioneStato);
router.delete('/Segnalazioni', resolveSegnalazione);
module.exports = router;
