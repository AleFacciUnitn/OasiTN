//models/Admin.js
const mongoose = require('mongoose');

// Definizione dello schema per il Tag
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Creazione del modello
const Admin = mongoose.model('Admin', adminSchema, 'admins');
module.exports = Admin;
