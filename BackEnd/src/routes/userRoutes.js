// routes/parcoRoutes.js
const express = require('express');
const router = express.Router();
const { init } = require('../controllers/user/initFetchController');
const { addSegnalazione } = require('../controllers/user/segnalazioneController');
const { addCrowdingReport } = require('../controllers/user/crowdingUserController');

// Rotta per ottenere tutti i parchi
router.get('/init', init);
//router.get('/infoParco/:id', getInfoParco);
router.post('/Segnalazioni', addSegnalazione);
router.post('/Crowding', addCrowdingReport);
module.exports = router;
