const express = require('express');

const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { categoryImageUpload, handleMulterError } = require('../middleware/upload');
const categoryController = require('../controllers/category.controller');

router.get('/', ...categoryController.list);
router.get('/:id', ...categoryController.getById);

router.post(
  '/',
  authenticate,
  categoryImageUpload.single('image'),
  handleMulterError,
  ...categoryController.create
);

router.put(
  '/:id',
  authenticate,
  categoryImageUpload.single('image'),
  handleMulterError,
  ...categoryController.update
);

router.delete('/:id', authenticate, ...categoryController.remove);

module.exports = router;
