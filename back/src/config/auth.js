const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secret } = require('./secret');

// Función para generar un token JWT
const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, secret, { expiresIn });
};

// Función para verificar un token JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

// Función para generar un hash de una contraseña
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Función para verificar una contraseña con su hash
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  verifyPassword,
};
