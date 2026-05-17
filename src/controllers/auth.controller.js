const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { loginRules } = require('../validations/auth.validation');
const { validateRequest } = require('../middleware/validate');

const login = [
  ...loginRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    const result = await authService.login({ email, username, password });
    return res.status(200).json({
      success: true,
      token: result.token,
      admin: result.admin,
    });
  }),
];

module.exports = {
  login,
};
