const parentCategoryService = require('../services/parentCategory.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const parentCategoryValidation = require('../validations/parentCategory.validation');
const { validateRequest } = require('../middleware/validate');

const list = [
  asyncHandler(async (_req, res) => {
    const data = await parentCategoryService.listParentCategories();
    return success(res, {
      message: 'Parent categories fetched successfully',
      data,
    });
  }),
];

const getById = [
  ...parentCategoryValidation.getByIdRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const category = await parentCategoryService.getParentCategoryById(req.params.id);
    return success(res, {
      message: 'Parent category fetched successfully',
      data: category,
    });
  }),
];

const create = [
  ...parentCategoryValidation.createRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const category = await parentCategoryService.createParentCategory(req.body, req.file);
    return success(res, {
      message: 'Parent category created successfully',
      data: category,
      status: 201,
    });
  }),
];

const update = [
  ...parentCategoryValidation.updateRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const category = await parentCategoryService.updateParentCategory(
      req.params.id,
      req.body,
      req.file
    );
    return success(res, {
      message: 'Parent category updated successfully',
      data: category,
    });
  }),
];

const remove = [
  ...parentCategoryValidation.deleteRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    await parentCategoryService.removeParentCategory(req.params.id);
    return success(res, {
      message: 'Parent category deleted successfully',
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
