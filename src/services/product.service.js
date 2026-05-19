const productModel = require('../models/product.model');
const websiteModel = require('../models/website.model');
const categoryModel = require('../models/category.model');
const { slugify, randomSuffix } = require('../utils/slug');
const { resolveImageField } = require('../utils/resolveImage');

function productFileUrl(file) {
  if (!file) return null;
  return `/uploads/products/${file.filename}`;
}

function paginationMeta({ page, limit, total }) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(100, Math.max(1, Number(limit) || 10));
  return {
    page: p,
    limit: l,
    total,
    totalPages: Math.ceil(total / l) || 0,
  };
}

async function assertWebsite(id) {
  const site = await websiteModel.findById(id);
  if (!site) {
    const err = new Error('Website not found');
    err.statusCode = 404;
    throw err;
  }
}

async function assertCategory(id) {
  if (id === null || id === undefined || id === '') {
    return;
  }
  const cat = await categoryModel.findById(id);
  if (!cat) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
}

async function ensureUniqueProductSlug(websiteId, baseSlug, excludeId) {
  let slug = slugify(baseSlug) || 'product';
  for (let i = 0; i < 50; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const cnt = await productModel.countByWebsiteSlug(websiteId, slug, excludeId);
    if (cnt === 0) return slug;
    slug = `${slugify(baseSlug)}-${randomSuffix()}`;
  }
  const err = new Error('Could not generate unique slug');
  err.statusCode = 500;
  throw err;
}

async function listProducts(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));

  let featured = query.featured;
  if (featured === 'true' || featured === '1') {
    featured = true;
  } else if (featured === 'false' || featured === '0') {
    featured = false;
  } else {
    featured = '';
  }

  const { rows, total } = await productModel.findAllPaginated({
    page,
    limit,
    search: query.search,
    website_id: query.website_id,
    category_id: query.category_id,
    parent_category_id: query.parent_category_id,
    status: query.status,
    featured,
    min_price: query.min_price,
    max_price: query.max_price,
    sort: query.sort,
    order: query.order,
  });

  return {
    items: rows,
    meta: paginationMeta({ page, limit, total }),
  };
}

async function getProductById(id) {
  const product = await productModel.findById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
}

function asBoolInt(value, defaultValue = 0) {
  if (value === undefined || value === null || value === '') {
    return defaultValue ? 1 : 0;
  }
  const truthy = value === true || value === 1 || value === '1' || value === 'true';
  return truthy ? 1 : 0;
}

function normalizePayload(merged, file, imageInput, imageFallback = null) {
  return {
    website_id: merged.website_id,
    category_id: merged.category_id === '' ? null : merged.category_id ?? null,
    parent_category_id: merged.parent_category_id === '' ? null : merged.parent_category_id ?? null,
    name: merged.name,
    slug: merged.slug,
    description: merged.description ?? null,
    short_description: merged.short_description ?? null,
    price: merged.price,
    sale_price: merged.sale_price === '' ? null : merged.sale_price ?? null,
    stock: merged.stock,
    sku: merged.sku,
    image: resolveImageField(imageInput, file, productFileUrl, imageFallback),
    status: merged.status ?? 'draft',
    featured: asBoolInt(merged.featured, false),
  };
}

async function createProduct(body, file) {
  await assertWebsite(body.website_id);
  await assertCategory(body.category_id);
  await assertCategory(body.parent_category_id);

  const base = body.slug || body.name;
  const slug = await ensureUniqueProductSlug(body.website_id, base, null);

  const payload = normalizePayload(body, file, body, null);
  payload.slug = slug;

  const id = await productModel.insertProduct(payload);
  return getProductById(id);
}

async function updateProduct(id, body, file) {
  const existing = await getProductById(id);
  await assertWebsite(body.website_id ?? existing.website_id);
  await assertCategory(body.category_id !== undefined ? body.category_id : existing.category_id);
  await assertCategory(
    body.parent_category_id !== undefined ? body.parent_category_id : existing.parent_category_id
  );

  const websiteId = body.website_id ?? existing.website_id;
  const base = body.slug || body.name || existing.slug;
  let slug = existing.slug;
  if (body.slug || body.name) {
    slug = await ensureUniqueProductSlug(websiteId, base, id);
  }

  const merged = { ...existing, ...body };
  const payload = normalizePayload(merged, file, body, existing.image);
  payload.slug = slug;

  const affected = await productModel.updateProduct(id, payload);
  if (!affected) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return getProductById(id);
}

async function removeProduct(id) {
  const affected = await productModel.softDelete(id);
  if (!affected) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  removeProduct,
};
