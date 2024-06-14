const UserModel = require("../models/UserModel");
const firebaseapp = require('../config/firebase');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser: deleteFirebaseUser } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc, deleteDoc, Timestamp } = require('firebase/firestore');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const auth = getAuth(firebaseapp);
const fireDb = getFirestore(firebaseapp);

const generateToken = () => {
    return crypto.randomBytes(64).toString('hex');
};

const UserController = {
    async register(req, res, next) {
        const { email, password, role, name, username } = req.body;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            const userRef = doc(fireDb, 'usuario', uid);

            await setDoc(userRef, {
                uid,
                name,
                username,
                registrationDate: Timestamp.fromDate(new Date()),
                role,
                email,
                wishList: [],
                review: []
            });

            const newUser = new UserModel({
                name,
                username,
                registrationDate: Timestamp.fromDate(new Date()),
                role,
                email,
                wishList: [],
                review: []
            });
            await UserModel.create(newUser);

            const token = generateToken();
            req.session.uid = uid;
            req.session.token = token;
            req.session.role = role;

            console.log("Usuario registrado exitosamente:", { uid, token, role });
            res.status(201).json({ user: newUser, token });
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            let errorMessage = "Error al registrar usuario";
            if (error.code === 'auth/weak-password') {
                errorMessage = 'Contraseña insegura, genera una nueva contraseña';
            } else if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email ya registrado';
            }
            res.status(400).json({ error: errorMessage });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            const userDoc = await getDoc(doc(fireDb, 'usuario', uid));
            const userData = userDoc.data();

            const token = generateToken();
            req.session.uid = uid;
            req.session.token = token;
            req.session.role = userData.role;

            console.log("Inicio de sesión exitoso:", { user: userData, token });
            res.status(200).json({ user: userData, token });
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
        }
    },

    async deleteUser(req, res) {
        const { username } = req.params;
        try {
            const user = await UserModel.findOneAndDelete({ username });
            if (!user) {
                console.error('Usuario no encontrado:', username);
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const userQuery = collection(fireDb, 'usuario');
            const userSnapshot = await userQuery.where('username', '==', username).get();
            if (userSnapshot.empty) {
                console.error('Usuario no encontrado en Firestore:', username);
                return res.status(404).json({ message: 'Usuario no encontrado en Firestore' });
            }

            userSnapshot.forEach(async (docSnapshot) => {
                const uid = docSnapshot.id;
                const userAuth = await auth.getUser(uid);
                await deleteFirebaseUser(userAuth);
                await deleteDoc(doc(fireDb, 'usuario', uid));
            });

            console.log('Usuario eliminado correctamente:', username);
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
        }
    },

    async addToWishList(req, res) {
        const { userId, productId } = req.body;
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                console.error('Usuario no encontrado:', userId);
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            user.wishList.push(productId);
            await user.save();
            console.log('Producto añadido a la lista de deseos:', { userId, productId });
            res.status(200).json({ message: 'Producto añadido a la lista de deseos', wishList: user.wishList });
        } catch (error) {
            console.error('Error al añadir a la lista de deseos:', error);
            res.status(500).json({ message: 'Error al añadir a la lista de deseos', error: error.message });
        }
    },

    async removeFromWishList(req, res) {
        const { userId, productId } = req.body;
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                console.error('Usuario no encontrado:', userId);
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            user.wishList.pull(productId);
            await user.save();
            console.log('Producto eliminado de la lista de deseos:', { userId, productId });
            res.status(200).json({ message: 'Producto eliminado de la lista de deseos', wishList: user.wishList });
        } catch (error) {
            console.error('Error al eliminar de la lista de deseos:', error);
            res.status(500).json({ message: 'Error al eliminar de la lista de deseos', error: error.message });
        }
    },

    async addComment(req, res) {
        const { userId, productId, rating, comment } = req.body;
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                console.error('Usuario no encontrado:', userId);
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            const newComment = { product: productId, rating, comment };
            user.comments.push(newComment);
            await user.save();
            console.log('Comentario añadido:', { userId, productId, rating, comment });
            res.status(200).json({ message: 'Comentario añadido', comments: user.comments });
        } catch (error) {
            console.error('Error al añadir comentario:', error);
            res.status(500).json({ message: 'Error al añadir comentario', error: error.message });
        }
    },

    async getUserProfile(req, res) {
        try {
            const { uid } = req.session;
            const userDoc = await getDoc(doc(fireDb, 'usuario', uid));
            if (!userDoc.exists()) {
                console.error('Usuario no encontrado:', uid);
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            const userData = userDoc.data();
            console.log('Perfil del usuario obtenido:', userData);
            res.status(200).json(userData);
        } catch (error) {
            console.error('Error al obtener el perfil del usuario:', error);
            res.status(500).json({ message: 'Error al obtener el perfil del usuario', error: error.message });
        }
    }
};

module.exports = UserController;
