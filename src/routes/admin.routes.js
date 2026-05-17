const express = require('express');

const router = express.Router();
const { authenticate } = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

router.use(authenticate);

router.get('/', ...adminController.list);
router.get('/:id', ...adminController.getById);
router.post('/', ...adminController.create);
router.put('/:id', ...adminController.update);
router.delete('/:id', ...adminController.remove);

module.exports = router;
