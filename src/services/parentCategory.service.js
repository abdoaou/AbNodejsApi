const categoryModel = require('../models/category.model');
const { slugify, randomSuffix } = require('../utils/slug');

function categoryFileUrl(file) {
  if (!file) return null;
  return `/uploads/categories/${file.filename}`;
}

async function ensureUniqueParentSlug(baseSlug, excludeId) {
  let slug = slugify(baseSlug) || 'category';
  for (let i = 0; i < 50; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const cnt = await categoryModel.countSlugUnderParent(null, slug, excludeId);
    if (cnt === 0) return slug;
    slug = `${slugify(baseSlug)}-${randomSuffix()}`;
  }
  const err = new Error('Could not generate unique slug');
  err.statusCode = 500;
  throw err;
}

function normalizeBody(body, file) {
  return {
    parent_id: null,
    name: body.name,
    slug: body.slug,
    description: body.description ?? null,
    status: body.status ?? 'active',
    image: categoryFileUrl(file),
  };
}

async function getParentWithChildren(id) {
  const parent = await categoryModel.findParentById(id);
  if (!parent) {
    const err = new Error('Parent category not found');
    err.statusCode = 404;
    throw err;
  }
  const children = await categoryModel.findChildren(id);
  return { ...parent, children };
}

async function listParentCategories() {
  return categoryModel.findAllParents();
}

async function getParentCategoryById(id) {
  return getParentWithChildren(id);
}

async function createParentCategory(body, file) {
  const slug = await ensureUniqueParentSlug(body.slug || body.name, null);
  const payload = normalizeBody({ ...body }, file);
  payload.slug = slug;
  if (!payload.image) {
    payload.image = null;
  }

  const id = await categoryModel.insertCategory(payload);
  return getParentWithChildren(id);
}

async function updateParentCategory(id, body, file) {
  const existing = await categoryModel.findParentById(id);
  if (!existing) {
    const err = new Error('Parent category not found');
    err.statusCode = 404;
    throw err;
  }

  const base = body.slug || body.name || existing.slug;
  let slug = existing.slug;
  if (body.slug || body.name) {
    slug = await ensureUniqueParentSlug(base, id);
  }

  const merged = { ...existing, ...body, parent_id: null };
  const payload = normalizeBody(merged, file);
  payload.slug = slug;
  if (!file) {
    payload.image = null;
  }

  const affected = await categoryModel.updateCategory(id, payload);
  if (!affected) {
    const err = new Error('Parent category not found');
    err.statusCode = 404;
    throw err;
  }
  return getParentWithChildren(id);
}

async function removeParentCategory(id) {
  const existing = await categoryModel.findParentById(id);
  if (!existing) {
    const err = new Error('Parent category not found');
    err.statusCode = 404;
    throw err;
  }

  const childCount = await categoryModel.countActiveChildren(id);
  if (childCount > 0) {
    const err = new Error(
      `Cannot delete parent category: ${childCount} subcategory(ies) exist. Delete or reassign them first.`
    );
    err.statusCode = 409;
    throw err;
  }

  const affected = await categoryModel.softDelete(id);
  if (!affected) {
    const err = new Error('Parent category not found');
    err.statusCode = 404;
    throw err;
  }
}

module.exports = {
  listParentCategories,
  getParentCategoryById,
  createParentCategory,
  updateParentCategory,
  removeParentCategory,
};
