const express = require('express');
const routerProduct= express.Router();
const productController = require('../controllers/productController');

routerProduct.get('/', productController.getAll);
routerProduct.get('/:id', productController.getById);
routerProduct.get('/nombre/:nombre', productController.getProductsByName);

// Rutas protegidas solo para administradores
routerProduct.post('/crear', productController.create);
routerProduct.delete('/:id', productController.delete);
routerProduct.put('/:id', productController.update);

module.exports = routerProduct;
