const express = require('express');

const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/products', require('./product.routes'));
router.use('/categories', require('./category.routes'));
router.use('/parent-categories', require('./parentCategory.routes'));
router.use('/websites', require('./website.routes'));
router.use('/admins', require('./admin.routes'));
router.use('/product-variants', require('./productVariant.routes'));

const asyncHandler = require('../utils/asyncHandler');
const { ping, driver } = require('../config/database');
const env = require('../config/env');

router.get(
  '/health',
  asyncHandler(async (_req, res) => {
    const payload = {
      success: true,
      message: 'OK',
      database: { driver },
    };

    if (driver === 'postgres-pending') {
      payload.database.connected = false;
      payload.database.hint =
        'Add DATABASE_URL or SUPABASE_DB_PASSWORD in .env (Supabase → Settings → Database)';
    } else {
      try {
        await ping();
        payload.database.connected = true;
      } catch {
        payload.database.connected = false;
        return res.status(503).json({
          success: false,
          message: 'Database unreachable',
          data: payload,
        });
      }
    }

    return res.status(200).json(payload);
  })
);

module.exports = router;
