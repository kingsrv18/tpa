import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

mkdirSync('.local', { recursive: true });
if (!existsSync('.env.local')) {
  const password = randomBytes(32).toString('hex');
  writeFileSync('.env.local', `# Isolated local development only. Never commit.\nLOCAL_POSTGRES_PASSWORD=${password}\nDATABASE_URL=postgresql://tpa_local:${password}@127.0.0.1:5432/tpa_local_layernote\nTPA_DATABASE_NAME=tpa_local_layernote\nDATABASE_SSL=false\nBETTER_AUTH_SECRET=${randomBytes(48).toString('hex')}\nBETTER_AUTH_URL=http://127.0.0.1:5173\nONBOARDING_ENABLED=false\nEMAIL_OPERATIONS_ENABLED=false\nTPA_MAIL_SINK=true\nR2_ACCESS_KEY_ID=\nR2_SECRET_ACCESS_KEY=\nCLOUDFLARE_CREDENTIAL_FILE=\n`, { flag: 'wx', mode: 0o600 });
}
process.loadEnvFile('.env.local');
const url = new URL(process.env.DATABASE_URL);
if (url.hostname !== '127.0.0.1' || url.pathname !== '/tpa_local_layernote' || process.env.TPA_DATABASE_NAME !== 'tpa_local_layernote') throw Error('This setup only supports the isolated local database. Existing settings were preserved.');
function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', env: process.env });
  if (result.status !== 0) throw Error(`Local setup step failed: ${command}`);
}
run('docker', ['compose', '--env-file', '.env.local', '-f', 'compose.local.yml', 'up', '-d', '--wait']);
run(process.execPath, ['--env-file=.env.local', 'scripts/migrate.mjs']);
run(process.execPath, ['--env-file=.env.local', '--import', 'tsx', 'scripts/provision-postal.mts']);
run(process.execPath, ['--env-file=.env.local', '--import', 'tsx', 'scripts/seed-local-accounts.mts']);
console.log('Local database and accounts ready. Start the app with npm run dev.');
