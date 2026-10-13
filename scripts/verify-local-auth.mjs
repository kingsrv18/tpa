import { readFileSync } from 'node:fs';
process.loadEnvFile('.env.local');
if (process.env.BETTER_AUTH_URL !== 'http://127.0.0.1:5173' || process.env.TPA_DATABASE_NAME !== 'tpa_local_layernote') throw Error('Only isolated local testing is supported.');
const origin = process.env.BETTER_AUTH_URL;
const handoff = readFileSync('.local/login-credentials.txt', 'utf8');
for (const email of ['admin@tpa.local', 'member@tpa.local']) {
  const password = handoff.split(`Email: ${email}\nPassword: `)[1]?.split('\n')[0];
  if (!password) throw Error('Missing local credential handoff.');
  const response = await fetch(origin + '/api/auth/sign-in/email', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify({ email, password }) });
  if (!response.ok) throw Error(`Local ${email} login failed (${response.status}).`);
  const cookie = response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
  const session = await fetch(origin + '/api/auth/get-session', { headers: { cookie } }).then(r => r.json());
  if (session?.user?.email !== email) throw Error('Session identity mismatch');
  const portal = await fetch(origin + (email.startsWith('admin') ? '/admin' : '/member'), { headers: { cookie }, redirect: 'manual' });
  if (portal.status !== 200) throw Error(`Portal failed (${portal.status}).`);
  if (email.startsWith('member')) {
    const denied = await fetch(origin + '/admin', { headers: { cookie }, redirect: 'manual' });
    if (denied.status === 200) throw Error('Member unexpectedly has admin access');
    console.log('Member login, session and portal verified; admin access is denied.');
  } else console.log('Administrator login, session and portal verified.');
  await fetch(origin + '/api/auth/sign-out', { method: 'POST', headers: { cookie, Origin: origin, 'Content-Type': 'application/json' }, body: '{}' });
}
