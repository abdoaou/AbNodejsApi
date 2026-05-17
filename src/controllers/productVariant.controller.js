const productVariantService = require('../services/productVariant.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const productVariantValidation = require('../validations/productVariant.validation');
const { validateRequest } = require('../middleware/validate');

const list = [
  ...productVariantValidation.listRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const data = await productVariantService.listVariants(req.query);
    return success(res, {
      message: 'Product variants fetched successfully',
      data,
    });
  }),
];

const getById = [
  ...productVariantValidation.getByIdRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const variant = await productVariantService.getVariantById(req.params.id);
    return success(res, {
      message: 'Product variant fetched successfully',
      data: variant,
    });
  }),
];

const create = [
  ...productVariantValidation.createRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const variant = await productVariantService.createVariant(req.body);
    return success(res, {
      message: 'Product variant created successfully',
      data: variant,
      status: 201,
    });
  }),
];

const update = [
  ...productVariantValidation.updateRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const variant = await productVariantService.updateVariant(req.params.id, req.body);
    return success(res, {
      message: 'Product variant updated successfully',
      data: variant,
    });
  }),
];

const remove = [
  ...productVariantValidation.deleteRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    await productVariantService.removeVariant(req.params.id);
    return success(res, {
      message: 'Product variant deleted successfully',
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
