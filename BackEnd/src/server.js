// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importa le rotte per la gestione di parchi e categorie
const adminRoutes = require('./routes/adminRoutes'); // Modifica con il percorso corretto
const userRoutes = require('./routes/userRoutes'); // Modifica con il percorso corretto

const app = express();
const PORT_POOL = [5000, 8888]; 

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
PORT_POOL.forEach((port) => {
  const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
  });

  server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
          console.log(`Port ${port} is already in use.`);
      } else {
          console.error(`Error on port ${port}:`, err);
      }
  });
});
