const { validationResult } = require('express-validator');
const { fail } = require('../utils/response');

/**
 * Runs after express-validator chains; maps failures to API format.
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const first = errors.array({ onlyFirstError: true })[0];
  const message = first ? `${first.msg}` : 'Validation error';
  return fail(res, {
    message,
    status: 400,
  });
}

module.exports = { validateRequest };
