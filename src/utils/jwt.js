const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * @param {object} payload
 * @returns {string}
 */
function signToken(payload) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}

/**
 * @param {string} token
 * @returns {object}
 */
function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret);
}

module.exports = { signToken, verifyToken };
