const { createClient } = require('@supabase/supabase-js');
const env = require('./env');

let client = null;

/**
 * Supabase client (REST / Auth / Storage). Server should prefer DATABASE_URL for SQL.
 */
function getSupabase() {
  if (!env.supabase.url || !env.supabase.key) {
    return null;
  }
  if (!client) {
    client = createClient(env.supabase.url, env.supabase.key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

module.exports = { getSupabase };
