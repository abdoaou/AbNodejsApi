const express = require('express');

const router = express.Router();
const { authenticate } = require('../middleware/auth');
const productVariantController = require('../controllers/productVariant.controller');

router.get('/', ...productVariantController.list);
router.get('/:id', ...productVariantController.getById);

router.post('/', authenticate, ...productVariantController.create);
router.put('/:id', authenticate, ...productVariantController.update);
router.delete('/:id', authenticate, ...productVariantController.remove);

module.exports = router;
