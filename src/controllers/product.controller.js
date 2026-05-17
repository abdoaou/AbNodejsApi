const productService = require('../services/product.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const productValidation = require('../validations/product.validation');
const { validateRequest } = require('../middleware/validate');

const list = [
  ...productValidation.listRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const data = await productService.listProducts(req.query);
    return success(res, {
      message: 'Products fetched successfully',
      data,
    });
  }),
];

const getById = [
  ...productValidation.getByIdRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id);
    return success(res, {
      message: 'Product fetched successfully',
      data: product,
    });
  }),
];

const create = [
  ...productValidation.createRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body, req.file);
    return success(res, {
      message: 'Product created successfully',
      data: product,
      status: 201,
    });
  }),
];

const update = [
  ...productValidation.updateRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(req.params.id, req.body, req.file);
    return success(res, {
      message: 'Product updated successfully',
      data: product,
    });
  }),
];

const remove = [
  ...productValidation.deleteRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    await productService.removeProduct(req.params.id);
    return success(res, {
      message: 'Product deleted successfully',
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
