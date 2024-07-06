const { getFirestore, doc, updateDoc, arrayUnion } = require('firebase/firestore');
const firebaseapp = require('../config/firebase');
const fireDb = getFirestore(firebaseapp);
const ProductoModel = require('../models/ProductModel');
const User = require("../models/UserModel");

const calcularMediaValoracion = (votosPrevios, nuevoVoto, totalVotos) => {
    const sumaTotal = votosPrevios * (totalVotos - 1) + nuevoVoto;
    return Math.min(Math.max(sumaTotal / totalVotos, 1), 5);
};

const CommentController = {
    async addComment(req, res) {
        try {
            const { productId, productName, productImage, productDescription, comment, rating, username, uid } = req.body;
            if (!productId || !productName || !productImage || !productDescription || !comment || rating === undefined || !username || !uid) {
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
                return res.status(500).json({ message: 'Datos de "likes" del producto inválidos' });
            }

            const productLike = product.likes[0];
            const newLikesCount = productLike.likesCount + 1;
            const newStarRating = calcularMediaValoracion(productLike.star, parsedRating, newLikesCount);

            productLike.star = newStarRating;
            productLike.likesCount = newLikesCount;

            await product.save();

            user.reviews.push(newReview);
            await user.save();

            const userRef = doc(fireDb, 'usuario', uid);
            await updateDoc(userRef, {
                reviews: arrayUnion(newReview)
            });

            const updatedRating = {
                star: newStarRating,
                likesCount: newLikesCount
            };

            res.json({
                ...newReview,
                updatedRating
            });
            console.log(updatedRating);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = CommentController;
