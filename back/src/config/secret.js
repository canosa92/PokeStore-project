const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Generar una clave secreta
const secretKey = crypto.randomBytes(64).toString('hex');

// Función para generar un token JWT
const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, secretKey, { expiresIn });
};

// Función para verificar un token JWT
const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
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
    verifyPassword
};
