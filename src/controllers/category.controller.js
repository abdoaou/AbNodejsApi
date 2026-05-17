const categoryService = require('../services/category.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const categoryValidation = require('../validations/category.validation');
const { validateRequest } = require('../middleware/validate');

const list = [
  ...categoryValidation.listRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const format = req.query.format === 'tree' ? 'tree' : 'flat';
    const data = await categoryService.listCategories(format);
    return success(res, {
      message: 'Categories fetched successfully',
      data,
    });
  }),
];

const getById = [
  ...categoryValidation.getByIdRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    return success(res, {
      message: 'Category fetched successfully',
      data: category,
    });
  }),
];

const create = [
  ...categoryValidation.createRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body, req.file);
    return success(res, {
      message: 'Category created successfully',
      data: category,
      status: 201,
    });
  }),
];

const update = [
  ...categoryValidation.updateRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const category = await categoryService.updateCategory(req.params.id, req.body, req.file);
    return success(res, {
      message: 'Category updated successfully',
      data: category,
    });
  }),
];

const remove = [
  ...categoryValidation.deleteRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    await categoryService.removeCategory(req.params.id);
    return success(res, {
      message: 'Category deleted successfully',
      data: null,
    });
  }),
];

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
};
