const ProductoModel = require('../models/Producto');
const UserModel = require("../models/UserModel");
const { getFirestore, doc, updateDoc, arrayUnion } = require('firebase/firestore');
const firebaseapp = require('../config/firebase');
const fireDb = getFirestore(firebaseapp);

const calcularStar = (rating, likesCount) => {
    const promedio = rating / likesCount;
    return Math.min(Math.max(promedio, 1), 5);
};

const CommentController = {
    async addComment(req, res) {
        try {
            const { productId, comment, rating, username, uid } = req.body;

            if (!productId || !comment || rating === undefined || !username || !uid) {
                return res.status(400).json({ message: 'Faltan datos en la solicitud' });
            }

            // Buscar el producto en MongoDB
            const product = await ProductoModel.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            // Buscar el usuario en MongoDB por username
            const user = await UserModel.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const userId = user._id.toString(); // Asegurarse de que userId es una cadena

            // Crear el nuevo comentario
            const newReview = { userId, comment, username, rating };
            product.reviews.push(newReview);

            // Actualizar likes y calcular estrellas del producto
            product.likes[0].likesCount += 1;
            product.likes[0].likes += rating;
            product.likes[0].star = calcularStar(product.likes[0].likes, product.likes[0].likesCount);

            // Guardar el producto actualizado en MongoDB
            await product.save();

            // Agregar el comentario al usuario en MongoDB
            user.comments.push({ product: productId, rating, comment });
            await user.save();

            // Actualizar los comentarios del usuario en Firebase usando uid
            const userRef = doc(fireDb, 'usuario', uid);
            await updateDoc(userRef, {
                reviews: arrayUnion({
                    productId,
                    comment,
                    rating
                })
            });

            res.json(newReview);
        } catch (error) {
            console.error("Error al insertar el comentario: ", error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = CommentController;
