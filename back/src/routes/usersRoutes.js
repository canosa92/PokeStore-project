const express = require("express");
const UserController = require("../controllers/userController");
const authentication = require('../middlewares/authentication');
const routerUser = express.Router();

routerUser.post("/register", UserController.register);
routerUser.post("/login", UserController.login);
routerUser.delete('/delete/:userId', UserController.deleteUser);
routerUser.post('/:userId/wishlist/add', UserController.addToWishList);
routerUser.post('/:userId/wishlist/remove', UserController.removeFromWishList);
routerUser.get('/:userId/user-profile', UserController.getUserProfile);

module.exports = routerUser;
