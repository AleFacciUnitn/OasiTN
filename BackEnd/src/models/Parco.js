const mongoose = require('mongoose');
const { Schema } = mongoose;

// Definisco lo schema di validazione per il tag, includendo il numero di tag e le posizioni
const TagInfoSchema = new Schema({
  tagId: {
    type: Schema.Types.ObjectId,
    ref: 'Tag', // riferimento al modello Tag
    required: true,
  },
  count: {
    type: Number,
    required: true,
    min: 1,
  },
  positions: [{
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    }
  }]
});

// Definisci lo schema del parco, includendo la lista dei tag e il loro numero di occorrenze
const ParcoSchema = new Schema({
  nome: {
    type: String,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    }
  },
  tags: [{
    type: TagInfoSchema,  // Include il sottoschema con tagId, count e positions
    required: true,
  }],
  infoParco: {
    type: String,
    required: false,
  },
});

// Creazione del modello per il parco
const Parco = mongoose.model('Parco', ParcoSchema, 'parchi');

module.exports = Parco;
