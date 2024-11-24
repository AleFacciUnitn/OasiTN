const mongoose = require('mongoose');

const segnalazioneSchema = new mongoose.Schema({
  parco: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parco',
    required: true,
  },
  oggetto: {
    type: String,
    required: true,
    trim: true
  },
  descrizione: {
    type: String,
    required: true,
    trim: true
  },
  priorita: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  stato: {
    type: String,
    enum: ['in attesa', 'in lavorazione', 'completata', 'annullata'],
    default: 'in attesa',
    required: true
  },
  scadenza: {
    type: Date, // Campo TTL
    default: null,
    index: {
      expireAfterSeconds: 0, // MongoDB cancellerà il documento quando questo timestamp sarà passato
      partialFilterExpression: { scadenza: { $exists: true } } // TTL applicato solo se il campo è presente
    }
  }
}, {
  timestamps: true  // Aggiunge createdAt e updatedAt
});

const Segnalazione = mongoose.model('Segnalazione', segnalazioneSchema, 'segnalazioni');

module.exports = Segnalazione;
