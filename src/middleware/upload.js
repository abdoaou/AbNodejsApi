const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const env = require('../config/env');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function extensionFromMime(mime) {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  };
  return map[mime] || '';
}

function createUploader(subfolder) {
  const dest = path.join(__dirname, '..', 'uploads', subfolder);
  ensureDir(dest);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeExt = env.upload.allowedExtensions.includes(ext) ? ext : extensionFromMime(file.mimetype);
      const unique = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt || '.bin'}`;
      cb(null, unique);
    },
  });

  function fileFilter(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeOk = env.upload.allowedMimeTypes.includes(file.mimetype);
    const extOk = env.upload.allowedExtensions.includes(ext);
    if (mimeOk && extOk) {
      return cb(null, true);
    }
    const err = new Error('Invalid file type. Allowed: jpg, jpeg, png, webp');
    err.statusCode = 400;
    return cb(err);
  }

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: env.upload.maxFileSizeBytes },
  });
}

const productImageUpload = createUploader('products');
const categoryImageUpload = createUploader('categories');

/**
 * Multer error → HTTP response via next(err) with statusCode.
 */
function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      err.statusCode = 400;
      err.message = 'File too large (max 5MB)';
    } else {
      err.statusCode = 400;
    }
    return next(err);
  }
  return next(err);
}

module.exports = {
  productImageUpload,
  categoryImageUpload,
  handleMulterError,
};
