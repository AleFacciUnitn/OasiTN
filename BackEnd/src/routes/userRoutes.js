// routes/parcoRoutes.js
const express = require('express');
const router = express.Router();
const { init } = require('../controllers/user/initFetchController');
const { addSegnalazione } = require('../controllers/user/segnalazioneController');

// Rotta per ottenere tutti i parchi
router.get('/init', init);
//router.get('/infoParco/:id', getInfoParco);
router.post('/Segnalazioni', addSegnalazione);
module.exports = router;
