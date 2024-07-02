const { getFirestore, doc, updateDoc, arrayUnion } = require('firebase/firestore');
const firebaseapp = require('../config/firebase');
const fireDb = getFirestore(firebaseapp);
const ProductoModel= require('../models/ProductModel')
const User = require("../models/UserModel");

const calcularMediaValoracion = (likes, likesCount, nuevoVoto) => {
    // Calcular la nueva suma de valoraciones
    const nuevaSumaLikes = likes + nuevoVoto;

    // Incrementar el contador de votos
    const nuevoLikesCount = likesCount + 1;

    // Calcular la nueva media
    const nuevaMedia = nuevaSumaLikes / nuevoLikesCount;

    // Asegurar que la nueva media esté entre 1 y 5
    const mediaFinal = Math.min(Math.max(nuevaMedia, 1), 5);

    return mediaFinal;
};

const CommentController = {
    async addComment(req, res) {
        try {
            const { productId, productName, productImage, productDescription, comment, rating, username, uid } = req.body;

            // Verificar que todos los campos están presentes
            if (!productId || !productName || !productImage || !productDescription || !comment || rating === undefined || !username || !uid) {
                console.log("Faltan datos en la solicitud: ", req.body);
                return res.status(400).json({ message: 'Faltan datos en la solicitud' });
            }

            // Convertir rating a número y verificar que es válido
            const parsedRating = Number(rating);
            if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
                return res.status(400).json({ message: 'La puntuación debe ser un número entre 1 y 5' });
            }

            // Buscar el producto en MongoDB
            const product = await ProductoModel.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            // Buscar el usuario en MongoDB por username
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const userId = user._id.toString(); // Asegurarse de que userId es una cadena

            // Crear el nuevo comentario
            const newReview = {
                productId,
                userId,
                productName,
                productImage,
                productDescription,
                comment,
                username,
                rating: parsedRating,
                createdAt: new Date()
            };

            // Agregar el comentario a las revisiones del producto
            product.reviews.push(newReview);

            // Actualizar likes y calcular estrellas del producto
            product.likes[0].likesCount += 1;
            product.likes[0].likes += parsedRating;
            product.likes[0].star = calcularMediaValoracion(product.likes[0].likes, product.likes[0].likesCount, parsedRating);

            // Guardar el producto actualizado en MongoDB
            await product.save();

            // Agregar el comentario al usuario en MongoDB
            user.reviews.push(newReview);
            await user.save();

            // Actualizar los comentarios del usuario en Firebase usando uid
            const userRef = doc(fireDb, 'usuario', uid);
            await updateDoc(userRef, {
                reviews: arrayUnion(newReview)
            });

            res.json(newReview);
        } catch (error) {
            console.error("Error al insertar el comentario: ", error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = CommentController;
