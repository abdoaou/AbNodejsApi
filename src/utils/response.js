/**
 * Standard JSON success envelope.
 */
function success(res, { message = 'OK', data = null, status = 200 } = {}) {
  const body = { success: true, message };
  if (data !== undefined && data !== null) {
    body.data = data;
  }
  return res.status(status).json(body);
}

/**
 * Standard JSON error envelope.
 */
function fail(res, { message = 'Error', status = 400, data = null } = {}) {
  const body = { success: false, message };
  if (data !== null && data !== undefined) {
    body.data = data;
  }
  return res.status(status).json(body);
}

module.exports = { success, fail };
