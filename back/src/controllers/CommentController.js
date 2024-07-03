const { getFirestore, doc, updateDoc, arrayUnion } = require('firebase/firestore');
const firebaseapp = require('../config/firebase');
const fireDb = getFirestore(firebaseapp);
const ProductoModel = require('../models/ProductModel');
const User = require("../models/UserModel");

const calcularMediaValoracion = (nuevoVoto, votosTotales) => {
    const nuevaMedia = (nuevoVoto * votosTotales) / votosTotales;
    return Math.min(Math.max(nuevaMedia, 1), 5);
};

const CommentController = {
    async addComment(req, res) {
        try {
            const { productId, productName, productImage, productDescription, comment, rating, username, uid } = req.body;
            console.log(productId, productName, productImage, productDescription, comment, rating, username, uid);

            if (!productId || !productName || !productImage || !productDescription || !comment || rating === undefined || !username || !uid) {
                console.log("Faltan datos en la solicitud: ", req.body);
                return res.status(400).json({ message: 'Faltan datos en la solicitud' });
            }

            const parsedRating = Number(rating);
            if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
                return res.status(400).json({ message: 'La puntuación debe ser un número entre 1 y 5' });
            }

            const product = await ProductoModel.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const userId = user._id.toString();

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

            product.reviews.push(newReview);

            if (!Array.isArray(product.likes) || product.likes.length === 0) {
                console.error('product.likes is not an array or is empty');
                return res.status(500).json({ message: 'Invalid product likes data' });
            }

            const productLike = product.likes[0];
            if (typeof productLike.likesCount !== 'number') {
                console.error(`Invalid likes data: likesCount=${productLike.likesCount}`);
                return res.status(500).json({ message: 'Invalid product likes data' });
            }

            productLike.likesCount += 1;
            productLike.star = calcularMediaValoracion(parsedRating, productLike.likesCount);

            console.log(productLike.star);
            console.log(calcularMediaValoracion(parsedRating, productLike.likesCount));

            await product.save();

            user.reviews.push(newReview);
            await user.save();

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
