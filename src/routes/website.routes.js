const express = require('express');

const router = express.Router();
const { authenticate } = require('../middleware/auth');
const websiteController = require('../controllers/website.controller');

router.get('/', ...websiteController.list);
router.get('/:id', ...websiteController.getById);

router.post('/', authenticate, ...websiteController.create);
router.put('/:id', authenticate, ...websiteController.update);
router.delete('/:id', authenticate, ...websiteController.remove);

module.exports = router;
