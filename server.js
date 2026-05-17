/**
 * Application entry — Hostinger-compatible: PORT from env, bind all interfaces.
 */
require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught exception:', err.stack || err.message);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled rejection:', reason);
  process.exit(1);
});

// Supabase hostnames may be IPv6-only; Node 17+ defaults to IPv4-first and then ENOTFOUND.
const dns = require('dns');
dns.setDefaultResultOrder('verbatim');

let env;
let ping;
let driver;
let app;

try {
  env = require('./src/config/env');
  ({ ping, driver } = require('./src/config/database'));
  app = require('./src/app');
} catch (err) {
  console.error('[FATAL] Failed to load application:', err.message);
  console.error(err.stack);
  process.exit(1);
}

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} (${env.nodeEnv})`);
  console.log(`Database driver: ${driver}`);
  ping()
    .then(() => console.log('Database: connected'))
    .catch((err) => console.warn('Database: unreachable at startup —', err.message));
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other process or set PORT to a free port.`);
  } else {
    console.error('Server failed to start:', err.message);
  }
  process.exit(1);
});
