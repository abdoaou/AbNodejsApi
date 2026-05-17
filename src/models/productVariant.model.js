const { query, driver } = require('../config/database');

const SELECT_FIELDS = `
  id,
  product_id,
  name,
  sku,
  price,
  sale_price,
  stock,
  attributes,
  status,
  created_at,
  updated_at
`;

async function findById(id) {
  const sql = `
    SELECT ${SELECT_FIELDS}
    FROM product_variants
    WHERE deleted_at IS NULL AND id = :id
    LIMIT 1
  `;
  const [rows] = await query(sql, { id });
  return rows[0] || null;
}

async function listAll(productId = null) {
  let sql = `
    SELECT ${SELECT_FIELDS}
    FROM product_variants
    WHERE deleted_at IS NULL
  `;
  const params = {};
  if (productId) {
    sql += ' AND product_id = :product_id';
    params.product_id = productId;
  }
  sql += ' ORDER BY id ASC';
  const [rows] = await query(sql, params);
  return rows;
}

async function insertVariant(data) {
  const sql = `
    INSERT INTO product_variants (
      product_id, name, sku, price, sale_price, stock, attributes, status
    )
    VALUES (
      :product_id, :name, :sku, :price, :sale_price, :stock, :attributes, :status
    )
    ${driver === 'postgres' ? 'RETURNING id' : ''}
  `;
  const [, meta] = await query(sql, data);
  return meta.insertId;
}

async function updateVariant(id, data) {
  const sql = `
    UPDATE product_variants SET
      product_id = :product_id,
      name = :name,
      sku = :sku,
      price = :price,
      sale_price = :sale_price,
      stock = :stock,
      attributes = :attributes,
      status = :status
    WHERE id = :id AND deleted_at IS NULL
  `;
  const [result] = await query(sql, { ...data, id });
  return result.affectedRows;
}

async function softDelete(id) {
  const sql = `UPDATE product_variants SET deleted_at = NOW() WHERE id = :id AND deleted_at IS NULL`;
  const [result] = await query(sql, { id });
  return result.affectedRows;
}

module.exports = {
  findById,
  listAll,
  insertVariant,
  updateVariant,
  softDelete,
};
