/**
 * Full pre-deploy / post-failure diagnostic.
 * Run: npm run diagnose
 * On Hostinger SSH: cd to project folder → npm run diagnose
 */
require('dotenv').config();

const dns = require('dns');
dns.setDefaultResultOrder('verbatim');

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');

function ok(msg) {
  console.log('  [OK]', msg);
}
function fail(msg) {
  console.log('  [FAIL]', msg);
}
function warn(msg) {
  console.log('  [WARN]', msg);
}

function runScript(name, scriptPath) {
  console.log(`\n${name}`);
  try {
    execSync(`node "${scriptPath}"`, { cwd: root, stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('=== Hostinger API diagnostic ===\n');

  console.log('Runtime');
  console.log('  Node:', process.version);
  console.log('  Platform:', process.platform, process.arch);
  console.log('  CWD:', process.cwd());

  console.log('\nProject files');
  for (const file of ['package.json', 'server.js', 'src/app.js', '.env']) {
    const p = path.join(root, file);
    if (fs.existsSync(p)) ok(file);
    else if (file === '.env') warn(`${file} missing (set vars in hPanel on server)`);
    else fail(`missing: ${file}`);
  }

  const pkg = require(path.join(root, 'package.json'));
  console.log('\npackage.json scripts');
  for (const name of ['build', 'start']) {
    if (pkg.scripts?.[name]) ok(`${name}: ${pkg.scripts[name]}`);
    else fail(`missing script: ${name}`);
  }
  if (pkg.engines?.node) console.log('  engines.node:', pkg.engines.node);

  console.log('\nNative module (bcrypt)');
  try {
    require('bcrypt');
    ok('bcrypt loads');
  } catch (e) {
    fail(`bcrypt: ${e.message}`);
    console.log('       → Run npm install on the server; do not upload node_modules from Windows.');
  }

  const envOk = runScript('Environment', path.join(__dirname, 'verify-env.js'));
  const dbOk = runScript('Database', path.join(__dirname, 'test-db.js'));

  console.log('\n=== Summary ===');
  if (envOk && dbOk) {
    ok('Ready to deploy / app config looks good');
  } else {
    fail('Fix errors above, then redeploy');
    process.exit(1);
  }

  console.log('\n--- Find errors on Hostinger ---');
  console.log('  Build log:    hPanel → Websites → Dashboard → Deployments → failed row → View log');
  console.log('  Runtime log:  hPanel → Node.js app → Runtime / Application logs');
  console.log('  Live check:   https://YOUR-DOMAIN/api/v1/health');
  console.log('');
}

main().catch((err) => {
  console.error('\nDiagnostic crashed:', err.message);
  process.exit(1);
});
