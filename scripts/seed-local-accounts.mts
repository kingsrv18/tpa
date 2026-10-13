import { randomBytes, randomUUID } from 'node:crypto';
import { existsSync, writeFileSync } from 'node:fs';
import { Pool } from 'pg';
import { hashPassword } from 'better-auth/crypto';
import { databaseOptions } from '../src/lib/database-options';

const url = new URL(process.env.DATABASE_URL!);
if (url.hostname !== '127.0.0.1' || url.pathname !== '/tpa_local_layernote' || process.env.TPA_DATABASE_NAME !== 'tpa_local_layernote') throw Error('Local fixture seeding requires the isolated local database.');
const pool = new Pool(databaseOptions()), client = await pool.connect();
try {
  if ((await client.query('SELECT current_database() AS name')).rows[0].name !== 'tpa_local_layernote') throw Error('Wrong database');
  const credentials = [];
  await client.query('BEGIN');
  for (const [email, name, admin] of [['admin@tpa.local', 'Local TPA Administrator', true], ['member@tpa.local', 'Local TPA Member', false]] as const) {
    if ((await client.query('SELECT id FROM public."user" WHERE email=$1', [email])).rowCount) continue;
    const id = randomUUID(), password = 'Local-' + randomBytes(15).toString('base64url') + '!7';
    await client.query('INSERT INTO public."user"(id,name,email,"emailVerified") VALUES($1,$2,$3,true)', [id, name, email]);
    await client.query('INSERT INTO public."account"(id,"accountId","providerId","userId",password,"createdAt","updatedAt") VALUES($1,$2,\'credential\',$2,$3,now(),now())', [randomUUID(), id, await hashPassword(password)]);
    await client.query('INSERT INTO tpa.member_profiles(user_id) VALUES($1)', [id]);
    if (admin) await client.query("INSERT INTO tpa.staff_roles(user_id,role) VALUES($1,'administrator')", [id]);
    credentials.push(`${name}\nEmail: ${email}\nPassword: ${password}\nPortal: http://127.0.0.1:5173/${admin ? 'admin' : 'member'}`);
  }
  if (credentials.length) {
    if (existsSync('.local/login-credentials.txt')) throw Error('Credential handoff already exists; no accounts changed.');
    writeFileSync('.local/login-credentials.txt', 'Local testing accounts only. No production access.\nLogin: http://127.0.0.1:5173/login\n\n' + credentials.join('\n\n') + '\n', { flag: 'wx', mode: 0o600 });
  }
  await client.query('COMMIT');
  console.log('Local admin and member accounts ready. Credentials are in .local/login-credentials.txt; passwords were not printed.');
} catch (error) { await client.query('ROLLBACK'); throw error; }
finally { client.release(); await pool.end(); }
