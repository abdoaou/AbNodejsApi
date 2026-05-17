const websiteService = require('../services/website.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const websiteValidation = require('../validations/website.validation');
const { validateRequest } = require('../middleware/validate');

const list = [
  asyncHandler(async (_req, res) => {
    const data = await websiteService.listWebsites();
    return success(res, {
      message: 'Websites fetched successfully',
      data,
    });
  }),
];

const getById = [
  ...websiteValidation.getByIdRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const website = await websiteService.getWebsiteById(req.params.id);
    return success(res, {
      message: 'Website fetched successfully',
      data: website,
    });
  }),
];

const create = [
  ...websiteValidation.createRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const website = await websiteService.createWebsite(req.body);
    return success(res, {
      message: 'Website created successfully',
      data: website,
      status: 201,
    });
  }),
];

const update = [
  ...websiteValidation.updateRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const website = await websiteService.updateWebsite(req.params.id, req.body);
    return success(res, {
      message: 'Website updated successfully',
      data: website,
    });
  }),
];

const remove = [
  ...websiteValidation.deleteRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    await websiteService.removeWebsite(req.params.id);
    return success(res, {
      message: 'Website deleted successfully',
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
