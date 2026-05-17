/**
 * Run: node scripts/verify-env.js
 * Validates required .env variables before deploy (no secrets printed).
 */
require('dotenv').config();

const REQUIRED = [
  { key: 'JWT_SECRET', warnDefault: 'change-me-in-production' },
  { key: 'SUPABASE_URL', when: () => !process.env.DATABASE_URL && !process.env.DB_HOST },
];

const RECOMMENDED = [
  'NODE_ENV',
  'PORT',
  'JWT_EXPIRES_IN',
  'SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_PROJECT_REF',
  'DATABASE_URL',
  'DB_SSL',
  'CORS_ORIGIN',
  'RATE_LIMIT_MAX',
];

const MYSQL_REQUIRED = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

function hasDbConfig() {
  if (process.env.DATABASE_URL) return 'postgres';
  if (process.env.SUPABASE_DB_PASSWORD && process.env.SUPABASE_PROJECT_REF) return 'postgres';
  if (process.env.DB_HOST) return 'mysql';
  if (process.env.SUPABASE_URL) return 'supabase-only';
  return null;
}

function main() {
  const errors = [];
  const warnings = [];

  const dbMode = hasDbConfig();
  if (!dbMode) {
    errors.push('No database config: set DATABASE_URL or SUPABASE_DB_PASSWORD+SUPABASE_PROJECT_REF or MySQL DB_* vars');
  } else if (dbMode === 'supabase-only') {
    warnings.push('SUPABASE_URL set but no DATABASE_URL — SQL routes will fail until DATABASE_URL or SUPABASE_DB_PASSWORD is set');
  }

  if (!process.env.JWT_SECRET) {
    errors.push('JWT_SECRET is missing');
  } else if (
    process.env.JWT_SECRET === 'replace-with-long-random-string' ||
    process.env.JWT_SECRET === 'dev-only-change-me' ||
    process.env.JWT_SECRET === 'change-me-in-production'
  ) {
    warnings.push('JWT_SECRET is a placeholder — use a long random value in production');
  }

  if (dbMode === 'mysql') {
    for (const key of MYSQL_REQUIRED) {
      if (!process.env[key]) errors.push(`${key} is required for MySQL mode`);
    }
  }

  if (dbMode === 'postgres' && process.env.DB_SSL !== 'true' && process.env.NODE_ENV === 'production') {
    warnings.push('DB_SSL should be "true" for Supabase/Postgres in production');
  }

  for (const key of RECOMMENDED) {
    if (!process.env[key]) warnings.push(`${key} is not set (using defaults)`);
  }

  if (process.env.SUPABASE_URL && !process.env.SUPABASE_PUBLISHABLE_KEY && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    warnings.push('SUPABASE_PUBLISHABLE_KEY or SUPABASE_SERVICE_ROLE_KEY not set — REST client disabled');
  }

  console.log('Environment verification\n');
  console.log('Database mode:', dbMode || 'none');
  console.log('NODE_ENV:', process.env.NODE_ENV || '(default development)');
  console.log('PORT:', process.env.PORT || '3000');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '[set]' : '[not set]');
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '[set]' : '[not set]');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '[set]' : '[missing]');

  if (warnings.length) {
    console.log('\nWarnings:');
    warnings.forEach((w) => console.log('  -', w));
  }
  if (errors.length) {
    console.log('\nErrors:');
    errors.forEach((e) => console.log('  -', e));
    process.exit(1);
  }

  console.log('\nRequired variables: OK');
  process.exit(0);
}

main();
