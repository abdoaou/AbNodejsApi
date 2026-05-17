const bcrypt = require('bcrypt');
const adminModel = require('../models/admin.model');
const { signToken } = require('../utils/jwt');

async function login({ email, username, password }) {
  const identifier = email || username;
  if (!identifier || !password) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const admin = await adminModel.findByEmailOrUsername(identifier);
  if (!admin) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({ id: admin.id, username: admin.username });

  return {
    token,
    admin: {
      id: admin.id,
      username: admin.username,
    },
  };
}

module.exports = {
  login,
};
