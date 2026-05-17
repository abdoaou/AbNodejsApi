/**
 * Supabase client (Hostinger deploy checklist).
 * Uses SUPABASE_ANON_KEY or SUPABASE_PUBLISHABLE_KEY from env / hPanel.
 */
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key =
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.warn(
    'db.js: set SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_PUBLISHABLE_KEY) in .env or Hostinger environment variables'
  );
}

const supabase =
  url && key
    ? createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

if (supabase) {
  supabase
    .from('products')
    .select('*')
    .limit(1)
    .then(({ data, error }) => {
      if (error) console.error('Connection error:', error.message);
      else console.log('Connected:', data);
    });
}

module.exports = supabase;
