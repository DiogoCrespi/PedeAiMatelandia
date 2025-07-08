const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');

router.post('/', auth, orderController.create);
router.get('/', auth, orderController.list);
router.get('/:id', auth, orderController.get);
router.put('/:id/status', auth, orderController.updateStatus);

module.exports = router; 