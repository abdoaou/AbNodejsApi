/**
 * Finds working Supabase Session pooler for this project. Run: node scripts/find-pooler.js
 */
require('dotenv').config();
const { Pool } = require('pg');

const pass = process.env.SUPABASE_DB_PASSWORD;
const ref = process.env.SUPABASE_PROJECT_REF;

if (!pass || !ref) {
  console.error('Set SUPABASE_DB_PASSWORD and SUPABASE_PROJECT_REF in .env');
  process.exit(1);
}

const prefixes = ['aws-0', 'aws-1'];
const regions = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-central-1',
  'eu-central-2',
  'eu-north-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-south-1',
  'sa-east-1',
  'ca-central-1',
];

async function tryUrl(host, port, mode) {
  const user = mode === 'session' ? `postgres.${ref}` : `postgres.${ref}`;
  const url = `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${host}:${port}/postgres`;
  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 12000,
  });
  try {
    await pool.query('SELECT 1');
    return { ok: true, url, host, port, mode };
  } catch (e) {
    return { ok: false, host, port, mode, error: e.message };
  } finally {
    await pool.end().catch(() => {});
  }
}

(async () => {
  const attempts = [];
  for (const prefix of prefixes) {
    for (const region of regions) {
      const host = `${prefix}-${region}.pooler.supabase.com`;
      attempts.push(tryUrl(host, 5432, 'session'));
      attempts.push(tryUrl(host, 6543, 'transaction'));
    }
  }

  const results = await Promise.all(attempts);
  const win = results.find((r) => r.ok);

  if (win) {
    console.log('\n✓ Working connection found:\n');
    console.log(`DATABASE_URL=${win.url.replace(pass, '***')}`);
    console.log('\nAdd to .env (full line with real password):');
    console.log(`DATABASE_URL=${win.url}`);
    console.log(`\nOr:\nSUPABASE_USE_POOLER=true`);
    console.log(`SUPABASE_POOLER_HOST=${win.host}`);
    console.log(`SUPABASE_DB_PORT=${win.port}`);
    process.exit(0);
  }

  console.log('No pooler region matched. Common causes:');
  console.log('- Wrong database password (reset in Supabase → Settings → Database)');
  console.log('- Project paused or wrong SUPABASE_PROJECT_REF');
  console.log('- Copy the exact URI from Dashboard → Database → Pooler settings → Session');
  const samples = results.filter((r) => !r.ok && !r.error.includes('ENOTFOUND')).slice(0, 5);
  if (samples.length) {
    console.log('\nSample errors:');
    samples.forEach((s) => console.log(`  ${s.host}:${s.port} → ${s.error}`));
  }
  process.exit(1);
})();
