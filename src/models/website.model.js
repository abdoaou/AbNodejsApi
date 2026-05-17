const { query } = require('../config/database');

async function findBySlug(slug) {
  const sql = `SELECT id, name, slug FROM websites WHERE slug = :slug LIMIT 1`;
  const [rows] = await query(sql, { slug });
  return rows[0] || null;
}

async function findById(id) {
  const sql = `SELECT id, name, slug FROM websites WHERE id = :id LIMIT 1`;
  const [rows] = await query(sql, { id });
  return rows[0] || null;
}

async function listAll() {
  const sql = `SELECT id, name, slug, created_at, updated_at FROM websites ORDER BY id ASC`;
  const [rows] = await query(sql);
  return rows;
}

module.exports = {
  findBySlug,
  findById,
  listAll,
};
