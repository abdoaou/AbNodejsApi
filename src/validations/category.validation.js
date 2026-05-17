const { body, param, query } = require('express-validator');

const idParam = [param('id').isInt({ min: 1 }).withMessage('Invalid id')];

const getByIdRules = [...idParam];

const listRules = [
  query('format').optional().isIn(['tree', 'flat']),
];

const createRules = [
  body('parent_id').optional({ nullable: true }).isInt({ min: 1 }).toInt(),
  body('name').isLength({ min: 2, max: 191 }).withMessage('Invalid name'),
  body('slug').optional().isLength({ min: 2, max: 191 }),
  body('description').optional({ nullable: true }).isString(),
  body('status').optional().isIn(['active', 'inactive']),
];

const updateRules = [
  ...idParam,
  body('parent_id').optional({ nullable: true }).isInt({ min: 1 }).toInt(),
  body('name').optional().isLength({ min: 2, max: 191 }),
  body('slug').optional().isLength({ min: 2, max: 191 }),
  body('description').optional({ nullable: true }).isString(),
  body('status').optional().isIn(['active', 'inactive']),
];

const deleteRules = [...idParam];

module.exports = {
  listRules,
  createRules,
  updateRules,
  deleteRules,
  getByIdRules,
};
