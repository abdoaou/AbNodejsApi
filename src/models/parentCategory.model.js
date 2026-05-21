const { query, driver } = require('../config/database');

/** Your Supabase table (plural). */
const TABLE = 'parent_categories';

const SELECT_FIELDS = `
  id,
  website_id,
  name,
  slug,
  image,
  description,
  status,
  created_at,
  updated_at
`;

async function findById(id) {
  const sql = `
    SELECT ${SELECT_FIELDS}
    FROM ${TABLE}
    WHERE id = :id
    LIMIT 1
  `;
  const [rows] = await query(sql, { id });
  return rows[0] || null;
}

async function findAll() {
  const sql = `
    SELECT ${SELECT_FIELDS}
    FROM ${TABLE}
    ORDER BY name ASC
  `;
  const [rows] = await query(sql);
  return rows;
}

async function countBySlug(slug, excludeId = null) {
  let sql = `SELECT COUNT(*) AS cnt FROM ${TABLE} WHERE slug = :slug`;
  const params = { slug };
  if (excludeId) {
    sql += ' AND id <> :excludeId';
    params.excludeId = excludeId;
  }
  const [rows] = await query(sql, params);
  return Number(rows[0].cnt);
}

async function insert(data) {
  const sql = `
    INSERT INTO ${TABLE} (website_id, name, slug, image, description, status)
    VALUES (:website_id, :name, :slug, :image, :description, :status)
    ${driver === 'postgres' ? 'RETURNING id' : ''}
  `;
  const [, meta] = await query(sql, data);
  return meta.insertId;
}

async function update(id, data) {
  const sql = `
    UPDATE ${TABLE} SET
      website_id = :website_id,
      name = :name,
      slug = :slug,
      image = :image,
      description = :description,
      status = :status
    WHERE id = :id
  `;
  const [, meta] = await query(sql, { ...data, id });
  return meta.affectedRows;
}

async function deleteById(id) {
  const sql = `DELETE FROM ${TABLE} WHERE id = :id`;
  const [, meta] = await query(sql, { id });
  return meta.affectedRows;
}

module.exports = {
  TABLE,
  findById,
  findAll,
  countBySlug,
  insert,
  update,
  deleteById,
};
