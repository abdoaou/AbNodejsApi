/**
 * Accept variants or sizes array from product create/update body (JSON or array).
 */
function parseVariantList(body) {
  const raw = body?.variants ?? body?.sizes;
  if (raw === undefined || raw === null || raw === '') {
    return null;
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(raw) ? raw : [];
}

/** true if client sent sizes/variants key (even empty array) */
function hasVariantListField(body) {
  return body?.variants !== undefined || body?.sizes !== undefined;
}

module.exports = { parseVariantList, hasVariantListField };
