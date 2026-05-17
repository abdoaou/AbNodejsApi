const express = require('express');

const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { productImageUpload, handleMulterError } = require('../middleware/upload');
const productController = require('../controllers/product.controller');

router.get('/', ...productController.list);
router.get('/:id', ...productController.getById);

router.post(
  '/',
  authenticate,
  productImageUpload.single('image'),
  handleMulterError,
  ...productController.create
);

router.put(
  '/:id',
  authenticate,
  productImageUpload.single('image'),
  handleMulterError,
  ...productController.update
);

router.delete('/:id', authenticate, ...productController.remove);

module.exports = router;
