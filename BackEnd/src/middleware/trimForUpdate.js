module.exports = function replaceSpacesMiddleware(schema) {
    // Middleware per sostituire spazi con "-" durante save
    schema.pre('save', function (next) {
      if (this.isModified('nome')) {
        this.nome = this.nome.replace(/\s+/g, '-');
      }
      if (this.descrizione) {
        this.descrizione = this.descrizione.replace(/\s+/g, '-');
      }
      this.updatedAt = Date.now(); // Aggiorna l'updatedAt
      next();
    });
  
    // Middleware per sostituire spazi con "-" durante findOneAndUpdate
    schema.pre('findOneAndUpdate', function (next) {
      const update = this.getUpdate();
  
      if (update.$set) {
        if (update.$set.nome) {
          update.$set.nome = update.$set.nome.replace(/\s+/g, '-');
        }
        if (update.$set.descrizione) {
          update.$set.descrizione = update.$set.descrizione.replace(/\s+/g, '-');
        }
      }
  
      // Aggiorna l'updatedAt
      if (!update.$set) {
        update.$set = {};
      }
      update.$set.updatedAt = Date.now();
  
      next();
    });
  };
  