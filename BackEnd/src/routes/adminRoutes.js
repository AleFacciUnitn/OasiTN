// routes/adminRoute.js
const express = require('express');
const { addCategoria, addTag, addParco } = require('../controllers/admin/adminParchiController'); // Importa i controller
const { resolveSegnalazione, updateSegnalazioneStato, getSegnalazioni } = require('../controllers/admin/adminSegnalazioniController');

const router = express.Router();

// Route per aggiungere una categoria
router.post('/Categoria', addCategoria);

// Route per aggiungere un parco
router.post('/Tag', addTag);

router.post('/Parco', addParco);
router.get('/Segnalazioni', getSegnalazioni);
router.put('/Segnalazioni', updateSegnalazioneStato);
router.delete('/Segnalazioni', resolveSegnalazione);
module.exports = router;
