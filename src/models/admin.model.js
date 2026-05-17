const { query } = require('../config/database');

async function findByEmailOrUsername(identifier) {
  const sql = `
    SELECT id, username, email, password, created_at, updated_at
    FROM admins
    WHERE email = :identifier OR username = :identifier
    LIMIT 1
  `;
  const [rows] = await query(sql, { identifier });
  return rows[0] || null;
}

async function findById(id) {
  const sql = `
    SELECT id, username, email, created_at, updated_at
    FROM admins
    WHERE id = :id
    LIMIT 1
  `;
  const [rows] = await query(sql, { id });
  return rows[0] || null;
}

module.exports = {
  findByEmailOrUsername,
  findById,
};
