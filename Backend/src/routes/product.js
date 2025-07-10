const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Listar todos os produtos
router.get('/', productController.list);

// Criar novo produto
router.post('/', productController.create);

// Buscar produto por ID
router.get('/:id', productController.get);

// Atualizar produto por ID
router.put('/:id', productController.update);

// Remover produto por ID
router.delete('/:id', productController.remove);

module.exports = router; 