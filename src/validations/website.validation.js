const { body, param } = require('express-validator');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Invalid id')];

const createRules = [
  body('name').isLength({ min: 2, max: 191 }).withMessage('Invalid name'),
  body('slug').optional().isLength({ min: 2, max: 191 }),
];

const updateRules = [
  ...idParam,
  body('name').optional().isLength({ min: 2, max: 191 }),
  body('slug').optional().isLength({ min: 2, max: 191 }),
];

module.exports = {
  createRules,
  updateRules,
  getByIdRules: idParam,
  deleteRules: idParam,
};
