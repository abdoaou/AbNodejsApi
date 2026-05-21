const { body, param, query } = require('express-validator');
const { imageUrlRule } = require('./image.validation');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Invalid id')];

const listRules = [
  query('search').optional().isString().isLength({ max: 200 }),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('website_id').optional().isInt({ min: 1 }).toInt(),
  query('category_id').optional().isInt({ min: 1 }).toInt(),
  query('parent_category_id').optional().isInt({ min: 1 }).toInt(),
  query('status').optional().isIn(['draft', 'active', 'inactive']),
  query('featured').optional().isBoolean().toBoolean(),
  query('min_price').optional().isFloat({ min: 0 }).toFloat(),
  query('max_price').optional().isFloat({ min: 0 }).toFloat(),
  query('sort').optional().isString(),
  query('order').optional().isIn(['asc', 'desc', 'ASC', 'DESC']),
];

const createRules = [
  body('website_id').isInt({ min: 1 }).withMessage('website_id is required').toInt(),
  body('category_id').optional({ nullable: true }).isInt({ min: 1 }).toInt(),
  body('parent_category_id').optional({ nullable: true }).isInt({ min: 1 }).toInt(),
  body('name').isLength({ min: 2, max: 191 }).withMessage('Invalid name'),
  body('slug').optional().isLength({ min: 2, max: 191 }),
  body('description').optional({ nullable: true }).isString(),
  body('short_description').optional({ nullable: true }).isString(),
  body('price').isFloat({ min: 0 }).withMessage('Invalid price'),
  body('sale_price').optional({ nullable: true }).isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }).withMessage('Invalid stock'),
  body('sku').isLength({ min: 1, max: 120 }).withMessage('Invalid SKU'),
  body('status').optional().isIn(['draft', 'active', 'inactive']),
  body('featured').optional().isBoolean(),
  imageUrlRule,
  body('variants')
    .optional()
    .custom((v) => v === undefined || Array.isArray(v) || typeof v === 'string'),
  body('sizes')
    .optional()
    .custom((v) => v === undefined || Array.isArray(v) || typeof v === 'string'),
];

const updateRules = [
  ...idParam,
  body('website_id').optional().isInt({ min: 1 }).toInt(),
  body('category_id').optional({ nullable: true }).isInt({ min: 1 }).toInt(),
  body('parent_category_id').optional({ nullable: true }).isInt({ min: 1 }).toInt(),
  body('name').optional().isLength({ min: 2, max: 191 }),
  body('slug').optional().isLength({ min: 2, max: 191 }),
  body('description').optional({ nullable: true }).isString(),
  body('short_description').optional({ nullable: true }).isString(),
  body('price').optional().isFloat({ min: 0 }),
  body('sale_price').optional({ nullable: true }).isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('sku').optional().isLength({ min: 1, max: 120 }),
  body('status').optional().isIn(['draft', 'active', 'inactive']),
  body('featured').optional().isBoolean(),
  imageUrlRule,
  body('variants')
    .optional()
    .custom((v) => v === undefined || Array.isArray(v) || typeof v === 'string'),
  body('sizes')
    .optional()
    .custom((v) => v === undefined || Array.isArray(v) || typeof v === 'string'),
];

const getByIdRules = [...idParam];

const deleteRules = [...idParam];

module.exports = {
  listRules,
  createRules,
  updateRules,
  deleteRules,
  getByIdRules,
};