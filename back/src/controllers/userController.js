const User = require("../models/UserModel");
const ProductoModel= require('../models/ProductModel')
const { firebaseapp, admin } = require('../config/firebase');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, collection, doc, setDoc, getDoc, Timestamp, deleteDoc } = require('firebase/firestore');

const auth = getAuth(firebaseapp);
const fireDb = getFirestore(firebaseapp);

const fetchWishListProducts = async (wishList) => {
    try {
        if (!wishList || wishList.length === 0) {
            return [];
        }

        const products = await ProductoModel.find({ _id: { $in: wishList } });
        return products;
    } catch (error) {
        console.error('Error fetching wishlist products:', error);
        return [];
    }
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
        reviews:[],
        cart:[]
      });
      const newuser = new User({
        name,
        username,
        registrationDate: Timestamp.fromDate(new Date()),
        role,
        email,
        wishList: [],
        reviews: [],
        cart:[]
      });
      await User.create(newuser);
  
      const loginCredential = await signInWithEmailAndPassword(auth, email, password);
      req.session.uid = uid;
      req.session.token = await loginCredential.user.getIdToken();
      req.session.role = role;
  
      res.status(201).json({ 
        message: 'Registration successful',
        user: { uid, name, username, email, role },
        token: req.session.token 
      });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      let errorMessage = "Error al registrar usuario";
      if (error.code === 'auth/weak-password') {
        errorMessage = 'Contraseña insegura, genera una nueva contraseña';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email ya registrado';
      }
      res.status(400).json({ message: errorMessage });
    }
  },
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            const userDoc = await getDoc(doc(fireDb, 'usuario', uid));
            const userData = userDoc.data();

            const token = await userCredential.user.getIdToken();

            req.session.uid = uid;
            req.session.role = userData.role;
            req.session.token = token;

            res.status(200).json({ message: "Inicio de sesión exitoso", user: userData, token });
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            res.status(500).json({ message: "Error al iniciar sesión" });
        }
    },
    async getUserProfile(req, res) {
        try {
            const { userId } = req.params;
            const userDoc = await getDoc(doc(fireDb, 'usuario', userId));
            if (!userDoc.exists()) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            const userData = userDoc.data();
    
            let products = [];
            if (userData.wishList && userData.wishList.length > 0) {
                products = await ProductoModel.find({ _id: { $in: userData.wishList } });
            }
    
            res.json({ user: userData, wishListProducts: products });
        } catch (error) {
            console.error('Error al obtener el perfil del usuario:', error);
            res.status(500).json({ message: 'Error del servidor', error: error.message });
        }
    },

    async deleteUser(req, res) {
        const { username } = req.params;
        try {
            const user = await User.findOneAndDelete({ username });
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const userQuery = collection(fireDb, 'usuario');
            const userSnapshot = await userQuery.where('username', '==', username).get();
            if (userSnapshot.empty) {
                return res.status(404).json({ message: 'Usuario no encontrado en Firestore' });
            }

            userSnapshot.forEach(async (docSnapshot) => {
                const uid = docSnapshot.id;
                const userAuth = await admin.auth().getUser(uid);
                await deleteFirebaseUser(userAuth);
                await deleteDoc(doc(fireDb, 'usuario', uid));
            });

            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Error al eliminar usuario' });
            }
        }
    },

   async addToWishList(req, res) {
        const { productId } = req.body;
        const { userId } = req.params;
    try {
        const userRef = doc(fireDb, 'usuario', userId);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const userData = userDoc.data();
        let wishList = userData.wishList || [];
        
        if (!wishList.includes(productId)) {
            wishList.push(productId);
            await setDoc(userRef, { wishList }, { merge: true });
        }

        const wishListProducts = await fetchWishListProducts(wishList);

        res.status(200).json({ message: 'Producto añadido a la lista de deseos', wishList, wishListProducts });
    } catch (error) {
        console.error('Error al añadir a la lista de deseos:', error);
        res.status(500).json({ message: 'Error al añadir a la lista de deseos' });
    }
},
async removeFromWishList(req, res) {
    const { productId, userId } = req.body; 
    try {
        const userRef = doc(fireDb, 'usuario', userId);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const userData = userDoc.data();
        let wishList = userData.wishList || [];
        
        wishList = wishList.filter(id => id !== productId);
        await setDoc(userRef, { wishList }, { merge: true });

        const wishListProducts = await fetchWishListProducts(wishList);

        res.status(200).json({ message: 'Producto eliminado de la lista de deseos', wishList, wishListProducts });
    } catch (error) {
        console.error('Error al eliminar de la lista de deseos:', error);
        res.status(500).json({ message: 'Error al eliminar de la lista de deseos' });
    }
}
};

module.exports = UserController;
