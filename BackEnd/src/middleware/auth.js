const crypto = require('crypto');

// Funzione per generare MD5
const generateMD5 = (text) => {
  return crypto.createHash('md5').update(text).digest('hex');
};


// Funzione di validazione della password
const validatePassword = (passwordFromRequest) => {
  const hardcodedPassword = '1234';  // Cambia con una password più sicura
  return generateMD5(passwordFromRequest) === generateMD5(hardcodedPassword);
};

module.exports = { validatePassword };