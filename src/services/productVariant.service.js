const productVariantModel = require('../models/productVariant.model');
const productModel = require('../models/product.model');

async function assertProduct(productId) {
  const product = await productModel.findById(productId);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
}

async function listVariants(query = {}) {
  const productId = query.product_id ? Number(query.product_id) : null;
  if (productId) await assertProduct(productId);
  return productVariantModel.listAll(productId);
}

async function getVariantById(id) {
  const row = await productVariantModel.findById(id);
  if (!row) {
    const err = new Error('Product variant not found');
    err.statusCode = 404;
    throw err;
  }
  return row;
}

function normalizeAttributes(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      const err = new Error('attributes must be valid JSON');
      err.statusCode = 400;
      throw err;
    }
  }
  return null;
}

async function createVariant(body) {
  await assertProduct(body.product_id);
  const id = await productVariantModel.insertVariant({
    product_id: body.product_id,
    name: body.name.trim(),
    sku: body.sku || null,
    price: body.price ?? null,
    sale_price: body.sale_price ?? null,
    stock: body.stock ?? 0,
    attributes: normalizeAttributes(body.attributes),
    status: body.status || 'active',
  });
  return getVariantById(id);
}

async function updateVariant(id, body) {
  const existing = await getVariantById(id);
  const productId = body.product_id !== undefined ? body.product_id : existing.product_id;
  await assertProduct(productId);

  const affected = await productVariantModel.updateVariant(id, {
    product_id: productId,
    name: body.name !== undefined ? body.name.trim() : existing.name,
    sku: body.sku !== undefined ? body.sku : existing.sku,
    price: body.price !== undefined ? body.price : existing.price,
    sale_price: body.sale_price !== undefined ? body.sale_price : existing.sale_price,
    stock: body.stock !== undefined ? body.stock : existing.stock,
    attributes:
      body.attributes !== undefined ? normalizeAttributes(body.attributes) : existing.attributes,
    status: body.status !== undefined ? body.status : existing.status,
  });

  if (!affected) {
    const err = new Error('Product variant not found');
    err.statusCode = 404;
    throw err;
  }
  return getVariantById(id);
}

async function removeVariant(id) {
  const affected = await productVariantModel.softDelete(id);
  if (!affected) {
    const err = new Error('Product variant not found');
    err.statusCode = 404;
    throw err;
  }
}

module.exports = {
  listVariants,
  getVariantById,
  createVariant,
  updateVariant,
  removeVariant,
};
