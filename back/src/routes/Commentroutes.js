const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');

// Ruta para agregar un comentario
router.post('/add-comment', CommentController.addComment);

module.exports = router;
