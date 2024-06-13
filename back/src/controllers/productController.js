const ProductoModel= require('../models/Producto')
const { admin } = require('../config/firebase');


function calcularStar(rating, likesCount) {
    // Calcula el promedio ponderado
    const promedio = rating / likesCount;

    // Asegúrate de que star esté dentro del rango del 1 al 5
    return Math.min(Math.max(promedio, 1), 5);
}

const productController = {
    // Obtener todos los productos
   async getAll  (req, res){
        try {
            const products = await ProductoModel.find();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Obtener un producto por su ID
    async getById  (req, res){
        try {
            const product = await ProductoModel.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Buscar productos por nombre
   async getProductsByName  (req, res){
        try {
            let nombre = req.params.nombre;
            nombre = new RegExp('^' + nombre + '$', 'i');
            const pokemon = await ProductoModel.findOne({ nombre });
            res.json(pokemon);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Editar un producto
    async edit (req, res) {
        try {
            const product = await ProductoModel.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            product.nombre = req.body.nombre;
            product.descripcion = req.body.descripcion;
            await product.save();
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Actualizar un producto
   async update  (req, res){
        try {
            const product = await ProductoModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Eliminar un producto
    async delete  (req, res) {
        try {
            const product = await ProductoModel.findByIdAndDelete(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.json({ message: 'Producto eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async insertComment(req, res) {
        const session = await ProductModel.startSession();
        session.startTransaction();
    
        try {
            const product = await ProductModel.findById(req.params.id).session(session);
            if (!product) {
                await session.abortTransaction();
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
    
            const { userId, comment, rating, username } = req.body;
            if (!userId || !comment || rating == null || !username) {
                await session.abortTransaction();
                return res.status(400).json({ message: 'Todos los campos son requeridos' });
            }
    
            // Obtener el usuario de Firebase
            const userRef = admin.firestore().collection('users').doc(userId);
            const userDoc = await userRef.get();
            if (!userDoc.exists) {
                await session.abortTransaction();
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            const user = userDoc.data();
    
            // Crear nuevo comentario
            let newReview = {
                userId,
                comment,
                username,
                rating
            };
    
            product.reviews.push(newReview);
    
            if (!product.likes || product.likes.length === 0) {
                product.likes = [{ likesCount: 0, likes: 0, star: 0 }];
            }
    
            product.likes[0].likesCount += 1;
            product.likes[0].likes += rating;
    
            const valor = calcularStar(product.likes[0].likes, product.likes[0].likesCount);
            product.likes[0].star = valor;
    
            // Guardar comentario en el usuario en Firebase
            const newUserComment = { productId: req.params.id, rating, comment };
            await userRef.update({
                comments: admin.firestore.FieldValue.arrayUnion(newUserComment)
            });
    
            // Guardar los cambios en MongoDB
            await product.save({ session });
    
            await session.commitTransaction();
    
            res.json(newReview);
        } catch (error) {
            await session.abortTransaction();
            console.error('Error inserting comment:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        } finally {
            session.endSession();
        }
    },
    // Crear un producto
    async create (req, res) {
        try {
            const { nombre, descripcion, imagen, precio, tipo, categoria, pokemonAttributes, pokeballAttributes, itemAttributes } = req.body;
            const newProduct = new ProductoModel({
                nombre,
                descripcion,
                imagen,
                precio,
                tipo,
                categoria,
                pokemonAttributes,
                pokeballAttributes,
                itemAttributes
            });
            await newProduct.save();
            res.json(newProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = productController;
