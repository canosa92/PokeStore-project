// middleware/authentication.js
const {admin} = require('../config/firebase'); // Ajusta la ruta según sea necesario
const authentication = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    try {
        const decodedToken = admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error de autenticación:', error);
        res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = authentication;