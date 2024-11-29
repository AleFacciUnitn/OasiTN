// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importa le rotte per la gestione di parchi e categorie
const adminRoutes = require('./routes/adminRoutes'); // Modifica con il percorso corretto
const userRoutes = require('./routes/userRoutes'); // Modifica con il percorso corretto

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connessione a MongoDB
mongoose.connect('mongodb://localhost:27017/OasiTN')
  .then(() => console.log('Connessione a MongoDB riuscita!'))
  .catch((err) => console.error('Errore di connessione a MongoDB:', err));

// Usa il router per le rotte di amministrazione
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
