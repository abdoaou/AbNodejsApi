const categoryModel = require('../models/category.model');
const { slugify, randomSuffix } = require('../utils/slug');

function categoryFileUrl(file) {
  if (!file) return null;
  return `/uploads/categories/${file.filename}`;
}

async function assertParent(parentId, excludeId) {
  if (parentId === null || parentId === undefined || parentId === '') {
    return null;
  }
  const parent = await categoryModel.findById(parentId);
  if (!parent) {
    const err = new Error('Parent category not found');
    err.statusCode = 404;
    throw err;
  }
  if (excludeId && Number(parentId) === Number(excludeId)) {
    const err = new Error('Category cannot be its own parent');
    err.statusCode = 400;
    throw err;
  }
  return parentId;
}

async function ensureUniqueCategorySlug(parentId, baseSlug, excludeId) {
  let slug = slugify(baseSlug) || 'category';
  for (let i = 0; i < 50; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const cnt = await categoryModel.countSlugUnderParent(parentId, slug, excludeId);
    if (cnt === 0) return slug;
    slug = `${slugify(baseSlug)}-${randomSuffix()}`;
  }
  const err = new Error('Could not generate unique slug');
  err.statusCode = 500;
  throw err;
}

function buildChildren(allRows, parentId) {
  return allRows
    .filter((row) =>
      parentId === null || parentId === undefined
        ? row.parent_id === null || row.parent_id === undefined
        : Number(row.parent_id) === Number(parentId)
    )
    .map((row) => ({
      ...row,
      children: buildChildren(allRows, row.id),
    }));
}

async function listCategories(format) {
  const rows = await categoryModel.findAllFlat();
  if (format === 'tree') {
    return buildChildren(rows, null);
  }
  return rows;
}

async function getCategoryById(id) {
  const root = await categoryModel.findById(id);
  if (!root) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  const all = await categoryModel.findAllFlat();
  return {
    ...root,
    children: buildChildren(all, root.id),
  };
}

function normalizeCategoryBody(body, file) {
  const parentRaw = body.parent_id;
  const parent_id =
    parentRaw === '' || parentRaw === undefined || parentRaw === null ? null : Number(parentRaw);

  return {
    parent_id,
    name: body.name,
    slug: body.slug,
    description: body.description ?? null,
    status: body.status ?? 'active',
    image: categoryFileUrl(file),
  };
}

async function createCategory(body, file) {
  const parent_id = await assertParent(body.parent_id, null);
  const base = body.slug || body.name;
  const slug = await ensureUniqueCategorySlug(parent_id, base, null);

  const payload = normalizeCategoryBody({ ...body, parent_id }, file);
  payload.slug = slug;
  if (!payload.image) {
    payload.image = null;
  }

  const id = await categoryModel.insertCategory(payload);
  return getCategoryById(id);
}

async function updateCategory(id, body, file) {
  const existing = await categoryModel.findById(id);
  if (!existing) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }

  const nextParentRaw = body.parent_id !== undefined ? body.parent_id : existing.parent_id;
  const parent_id = await assertParent(nextParentRaw, id);

  if (parent_id !== null && parent_id !== undefined) {
    const descendants = await categoryModel.getDescendantIds(id);
    if (descendants.map(Number).includes(Number(parent_id))) {
      const err = new Error('Invalid parent: would create a circular hierarchy');
      err.statusCode = 400;
      throw err;
    }
  }

  const base = body.slug || body.name || existing.slug;
  let slug = existing.slug;
  if (body.slug || body.name) {
    slug = await ensureUniqueCategorySlug(parent_id, base, id);
  }

  const merged = { ...existing, ...body };
  merged.parent_id = parent_id;
  const payload = normalizeCategoryBody(merged, file);
  payload.slug = slug;
  if (!file) {
    payload.image = null;
  }

  const affected = await categoryModel.updateCategory(id, payload);
  if (!affected) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
  return getCategoryById(id);
}

async function removeCategory(id) {
  const affected = await categoryModel.softDelete(id);
  if (!affected) {
    const err = new Error('Category not found');
    err.statusCode = 404;
    throw err;
  }
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  removeCategory,
};
