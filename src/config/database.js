const { Pool } = require('pg');
const mysql = require('mysql2/promise');
const env = require('./env');
const { toNamedPg } = require('../utils/namedQuery');

const usePostgres = Boolean(env.databaseUrl);
const supabaseConfigured = Boolean(env.supabase.url);

/** @type {import('pg').Pool | null} */
let pgPool = null;

/** @type {import('mysql2/promise').Pool | null} */
let mysqlPool = null;

if (usePostgres) {
  pgPool = new Pool({
    connectionString: env.databaseUrl,
    ssl: env.db.ssl ? { rejectUnauthorized: false } : undefined,
    max: env.db.connectionLimit,
  });
} else if (!supabaseConfigured) {
  mysqlPool = mysql.createPool({
    host: env.db.host,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    port: env.db.port,
    waitForConnections: env.db.waitForConnections,
    connectionLimit: env.db.connectionLimit,
    queueLimit: env.db.queueLimit,
    namedPlaceholders: true,
  });
}

function assertPool() {
  if (pgPool || mysqlPool) {
    return;
  }
  const err = new Error(
    'Database not configured. Set DATABASE_URL or SUPABASE_DB_PASSWORD (see README — Supabase setup).'
  );
  err.statusCode = 503;
  throw err;
}

/**
 * @param {string} sql
 * @param {object} [params]
 */
async function query(sql, params = {}) {
  assertPool();

  if (pgPool) {
    const { text, values } = toNamedPg(sql, params);
    const result = await pgPool.query(text, values);
    const meta = {
      affectedRows: result.rowCount ?? 0,
      insertId: result.rows[0]?.id,
    };
    return [result.rows, meta];
  }

  return mysqlPool.execute(sql, params);
}

async function ping() {
  assertPool();
  if (pgPool) {
    await pgPool.query('SELECT 1');
    return true;
  }
  await mysqlPool.query('SELECT 1');
  return true;
}

module.exports = {
  pool: pgPool || mysqlPool,
  query,
  ping,
  driver: usePostgres ? 'postgres' : supabaseConfigured ? 'postgres-pending' : 'mysql',
};
