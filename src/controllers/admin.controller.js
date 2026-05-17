const adminService = require('../services/admin.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const adminValidation = require('../validations/admin.validation');
const { validateRequest } = require('../middleware/validate');

const list = [
  asyncHandler(async (_req, res) => {
    const data = await adminService.listAdmins();
    return success(res, {
      message: 'Admins fetched successfully',
      data,
    });
  }),
];

const getById = [
  ...adminValidation.getByIdRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const admin = await adminService.getAdminById(req.params.id);
    return success(res, {
      message: 'Admin fetched successfully',
      data: admin,
    });
  }),
];

const create = [
  ...adminValidation.createRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const admin = await adminService.createAdmin(req.body);
    return success(res, {
      message: 'Admin created successfully',
      data: admin,
      status: 201,
    });
  }),
];

const update = [
  ...adminValidation.updateRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const admin = await adminService.updateAdmin(req.params.id, req.body);
    return success(res, {
      message: 'Admin updated successfully',
      data: admin,
    });
  }),
];

const remove = [
  ...adminValidation.deleteRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    await adminService.removeAdmin(req.params.id, req.admin.id);
    return success(res, {
      message: 'Admin deleted successfully',
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
