const express = require("express");
const UserController = require("../controllers/userController");
const authentication = require('../middlewares/authentication');
const routerUser = express.Router();

routerUser.post("/register", UserController.register);
routerUser.post("/login", UserController.login);
routerUser.delete('/delete/:username', authentication, UserController.deleteUser);
routerUser.post('/:userId/wishlist/add', authentication, UserController.addToWishList);
routerUser.post('/:userId/wishlist/remove', authentication, UserController.removeFromWishList);
routerUser.get('/:userId/user-profile', authentication, UserController.getUserProfile);

module.exports = routerUser;
