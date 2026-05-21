const { body, param, query } = require('express-validator');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Invalid id')];

const listRules = [query('product_id').optional().isInt({ min: 1 }).toInt()];

const createRules = [
  body('product_id').isInt({ min: 1 }).withMessage('product_id is required').toInt(),
  body('name').isLength({ min: 2, max: 191 }).withMessage('Invalid name'),
  body('sku').optional({ nullable: true }).isLength({ max: 120 }),
  body('price').optional({ nullable: true }).toFloat().isFloat({ min: 0 }),
  body('sale_price').optional({ nullable: true }).toFloat().isFloat({ min: 0 }),
  body('stock').optional().toInt().isInt({ min: 0 }),
  body('attributes').optional({ nullable: true }),
  body('status').optional().isIn(['active', 'inactive']),
];

const updateRules = [
  ...idParam,
  body('product_id').optional().isInt({ min: 1 }).toInt(),
  body('name').optional().isLength({ min: 2, max: 191 }),
  body('sku').optional({ nullable: true }).isLength({ max: 120 }),
  body('price').optional({ nullable: true }).toFloat().isFloat({ min: 0 }),
  body('sale_price').optional({ nullable: true }).toFloat().isFloat({ min: 0 }),
  body('stock').optional().toInt().isInt({ min: 0 }),
  body('attributes').optional({ nullable: true }),
  body('status').optional().isIn(['active', 'inactive']),
];

module.exports = {
  listRules,
  createRules,
  updateRules,
  getByIdRules: idParam,
  deleteRules: idParam,
};
