/**
 * Image from multipart file (priority) or JSON `image` URL string.
 * Empty string / null / whitespace → null (clear image).
 * If `image` is omitted on update, returns `fallback` (usually existing URL).
 */
function resolveImageField(body, file, fileToUrl, fallback = null) {
  if (file) {
    return fileToUrl(file);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'image')) {
    const raw = body.image;
    if (raw === null || raw === '') {
      return null;
    }
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      return trimmed === '' ? null : trimmed;
    }
    return null;
  }
  return fallback;
}

module.exports = { resolveImageField };
