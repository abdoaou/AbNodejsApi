const { fail } = require('../utils/response');

function notFoundHandler(req, res) {
  return fail(res, { message: 'Route not found', status: 404 });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.name === 'JsonWebTokenError') {
    return fail(res, { message: 'Invalid token', status: 401 });
  }
  if (err.name === 'TokenExpiredError') {
    return fail(res, { message: 'Token expired', status: 401 });
  }

  const status = err.statusCode || err.status || 500;
  const message =
    status === 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return fail(res, { message, status });
}

module.exports = { notFoundHandler, errorHandler };
