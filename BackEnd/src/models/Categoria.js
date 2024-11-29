const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const trimMiddleware = require('../middleware/trimForUpdate');
// Definizione dello schema per la Categoria
const categoriaSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,         // Il nome della categoria è obbligatorio
      unique: true,           // Il nome della categoria deve essere unico
      trim: true,             // Rimuove gli spazi bianchi prima e dopo il nome
    },
    descrizione: {
      type: String,
      trim: true,             // Anche la descrizione viene pulita dagli spazi
    }
  },
  {
    timestamps: true,          // Aggiunge i campi createdAt e updatedAt
  }
);

// Aggiunta del middleware per il trim
//categoriaSchema.pre('findByIdAndUpdate', trimMiddleware);

// Creazione del modello per la Categoria
const Categoria = mongoose.model('Categoria', categoriaSchema, 'categorie');

module.exports = Categoria;
