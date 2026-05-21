const { body, param } = require('express-validator');
const { imageUrlRule } = require('./image.validation');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Invalid id')];

const createRules = [
  body('website_id').optional().isInt({ min: 1 }).toInt(),
  body('name').isLength({ min: 2, max: 191 }).withMessage('Invalid name'),
  body('slug').optional().isLength({ min: 2, max: 191 }),
  body('description').optional({ nullable: true }).isString(),
  body('status').optional().isIn(['active', 'inactive']),
  imageUrlRule,
];

const updateRules = [
  ...idParam,
  body('website_id').optional().isInt({ min: 1 }).toInt(),
  body('name').optional().isLength({ min: 2, max: 191 }),
  body('slug').optional().isLength({ min: 2, max: 191 }),
  body('description').optional({ nullable: true }).isString(),
  body('status').optional().isIn(['active', 'inactive']),
  imageUrlRule,
];

module.exports = {
  createRules,
  updateRules,
  getByIdRules: idParam,
  deleteRules: idParam,
};
