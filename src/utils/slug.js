/**
 * URL-safe slug from arbitrary text.
 */
function slugify(text) {
  return String(text || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/**
 * Append short random suffix for uniqueness when needed.
 */
function randomSuffix() {
  return Math.random().toString(36).slice(2, 8);
}

module.exports = { slugify, randomSuffix };
