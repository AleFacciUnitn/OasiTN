const validatePassword = require('../../../middleware/auth.js').validatePassword; 


const adminLogin = async (req, res) => {
    try {
      let { password } = req.body;
      // Controllo della validità della categoria
      if (!password) {
        return res.status(400).json({ error: 'Formato non valido' });
      }
      // Controllo della validità dei dati (esempio con una password hardcoded)
  
      if (!validatePassword(password)) {
        return res.status(403).json({ error: 'Password non valida' });
      }
      res.status(200).json({
        message: 'Login effettuato con successo',
        tag: newTag
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Errore nel server' });
    }
  };

  export { adminLogin };
  