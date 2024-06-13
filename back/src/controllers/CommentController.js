const ProductoModel = require('../models/Producto');
const UserModel = require('../models/User');
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
            const { productId, userId, comment, rating, username } = req.body;

            // Buscar el producto en MongoDB
            const product = await ProductoModel.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            // Buscar el usuario en MongoDB
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

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
            user.Review.push({ product: productId, rating, comment });
            await user.save();

            // Actualizar los comentarios del usuario en Firebase
            const userRef = doc(fireDb, 'usuario', userId);
            await updateDoc(userRef, {
                reviews: arrayUnion({
                    productId,
                    comment,
                    rating
                })
            });

            // Actualizar los comentarios del producto en Firebase
            const productRef = doc(fireDb, 'productos', productId);
            await updateDoc(productRef, {
                reviews: arrayUnion({
                    userId,
                    username,
                    comment,
                    rating
                }),
                likes: {
                    likesCount: product.likes[0].likesCount,
                    likes: product.likes[0].likes,
                    star: product.likes[0].star
                }
            });

            res.json(newReview);
        } catch (error) {
            console.error("Error al insertar el comentario: ", error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = CommentController;
