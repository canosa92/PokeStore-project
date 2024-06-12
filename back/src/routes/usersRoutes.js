const express = require("express");
const UserController = require("../controllers/userController");
const authentication = require('../middlewares/authentication');
const routerUser = express.Router();

routerUser.post("/register", UserController.register);
routerUser.post("/login", UserController.login);
routerUser.delete('/delete', authentication, UserController.deleteUser);
routerUser.post('/wishlist/add', authentication, UserController.addToWishList);
routerUser.post('/wishlist/remove', authentication, UserController.removeFromWishList);
routerUser.post('/comment/add', authentication, UserController.addComment);

module.exports = routerUser;
