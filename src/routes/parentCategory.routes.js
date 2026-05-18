const express = require('express');

const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { categoryImageUpload, handleMulterError } = require('../middleware/upload');
const parentCategoryController = require('../controllers/parentCategory.controller');

router.get('/', ...parentCategoryController.list);
router.get('/:id', ...parentCategoryController.getById);

router.post(
  '/',
  authenticate,
  categoryImageUpload.single('image'),
  handleMulterError,
  ...parentCategoryController.create
);

router.put(
  '/:id',
  authenticate,
  categoryImageUpload.single('image'),
  handleMulterError,
  ...parentCategoryController.update
);

router.delete('/:id', authenticate, ...parentCategoryController.remove);

module.exports = router;
