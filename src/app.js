const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

const env = require('./config/env');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: false,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

app.use(compression());
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const uploadsRoot = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsRoot));

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Ecommerce API is running',
    version: 'v1',
    health: '/api/v1/health',
    endpoints: {
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      parentCategories: '/api/v1/parent-categories',
      websites: '/api/v1/websites',
      admins: '/api/v1/admins',
      productVariants: '/api/v1/product-variants',
      login: 'POST /api/v1/auth/login',
    },
  });
});

app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
