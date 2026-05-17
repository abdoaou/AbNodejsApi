const websiteModel = require('../models/website.model');
const { slugify, randomSuffix } = require('../utils/slug');

async function ensureUniqueSlug(baseSlug, excludeId) {
  let slug = slugify(baseSlug) || 'website';
  for (let i = 0; i < 50; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const existing = await websiteModel.findBySlug(slug, excludeId);
    if (!existing) return slug;
    slug = `${slugify(baseSlug)}-${randomSuffix()}`;
  }
  const err = new Error('Could not generate unique slug');
  err.statusCode = 500;
  throw err;
}

async function listWebsites() {
  return websiteModel.listAll();
}

async function getWebsiteById(id) {
  const site = await websiteModel.findById(id);
  if (!site) {
    const err = new Error('Website not found');
    err.statusCode = 404;
    throw err;
  }
  return site;
}

async function createWebsite(body) {
  const slug = await ensureUniqueSlug(body.slug || body.name, null);
  const id = await websiteModel.insertWebsite({
    name: body.name.trim(),
    slug,
  });
  return getWebsiteById(id);
}

async function updateWebsite(id, body) {
  const existing = await websiteModel.findById(id);
  if (!existing) {
    const err = new Error('Website not found');
    err.statusCode = 404;
    throw err;
  }

  const name = body.name !== undefined ? body.name.trim() : existing.name;
  let slug = existing.slug;
  if (body.slug || body.name) {
    slug = await ensureUniqueSlug(body.slug || body.name || existing.slug, id);
  }

  const affected = await websiteModel.updateWebsite(id, { name, slug });
  if (!affected) {
    const err = new Error('Website not found');
    err.statusCode = 404;
    throw err;
  }
  return getWebsiteById(id);
}

async function removeWebsite(id) {
  const existing = await websiteModel.findById(id);
  if (!existing) {
    const err = new Error('Website not found');
    err.statusCode = 404;
    throw err;
  }

  const productCount = await websiteModel.countProducts(id);
  if (productCount > 0) {
    const err = new Error(
      `Cannot delete website: ${productCount} product(s) still use this website. Reassign or delete them first.`
    );
    err.statusCode = 409;
    throw err;
  }

  const affected = await websiteModel.deleteWebsite(id);
  if (!affected) {
    const err = new Error('Website not found');
    err.statusCode = 404;
    throw err;
  }
}

module.exports = {
  listWebsites,
  getWebsiteById,
  createWebsite,
  updateWebsite,
  removeWebsite,
};
