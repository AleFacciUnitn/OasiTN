const crypto = require('crypto');

// Funzione per generare MD5
const generateMD5 = (text) => {
  return crypto.createHash('md5').update(text).digest('hex');
};


// Funzione di validazione della password
const validatePassword = (passwordFromRequest) => {
  try {
    console.log('passwordFromRequest:', passwordFromRequest);
    console.log(!passwordFromRequest);
    if(!passwordFromRequest) return false;
    const hardcodedPassword = "1234";  // Cambia con una password più sicura
    return generateMD5(passwordFromRequest) === generateMD5(hardcodedPassword);
  }catch(error){
    console.error('Errore durante la validazione della password:', error);
    return false;
  }
};

module.exports = { validatePassword };