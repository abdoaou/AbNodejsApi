/**
 * Run: node scripts/test-db.js
 * Uses DATABASE_URL from .env — copy the full URI from Supabase Dashboard.
 */
require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('verbatim');

const { ping, driver } = require('../src/config/database');

ping()
  .then(() => {
    console.log('Connected OK. Driver:', driver);
    process.exit(0);
  })
  .catch((e) => {
    console.error('Connection failed:', e.message);
    console.error('\nFix: Supabase → Settings → Database → Connection string → URI');
    console.error('Paste the entire URI into DATABASE_URL in .env, then run this again.');
    process.exit(1);
  });
