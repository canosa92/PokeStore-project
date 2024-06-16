// secret.js
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Generar una clave secreta segura
const secret = crypto.randomBytes(64).toString('hex');
const hashedSecret = bcrypt.hashSync(secret, 10);

module.exports = {
  secret,
  hashedSecret,
};
