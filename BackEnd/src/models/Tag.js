// models/Tag.js
const mongoose = require('mongoose');

// Definizione dello schema per il Tag
const tagSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  }
}, {
  timestamps: true
});

// Creazione del modello
const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
