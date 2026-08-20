/**
 * sync.mjs
 * 1. Builds the web app (app/) and copies dist -> android-app/web/.
 *    The website project (app/) is only READ — never modified.
 * 2. Bundles the native bridge and injects it into web/index.html
 *    along with a small __APP_CONFIG__ block for the bridge.
 *
 * Usage: npm run sync
 */
import { execSync } from 'node:child_process';
import { existsSync, rmSync, cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const androidAppDir = resolve(here, '..');
const root = resolve(here, '..', '..');
const appDir = resolve(root, 'app');
const webDir = resolve(here, '..', 'web');

console.log('[sync] Building web app...');
execSync('npm run build', { cwd: appDir, stdio: 'inherit' });

const distDir = resolve(appDir, 'dist');
if (!existsSync(distDir)) throw new Error(`Web build output not found at ${distDir}`);

if (existsSync(webDir)) rmSync(webDir, { recursive: true, force: true });
mkdirSync(webDir, { recursive: true });
cpSync(distDir, webDir, { recursive: true });
console.log(`[sync] Copied web build -> ${webDir}`);

// Bundle the native bridge into web/native-bridge.js
console.log('[sync] Bundling native bridge...');
execSync('node scripts/bundle.mjs', { cwd: androidAppDir, stdio: 'inherit' });

// Read the web app's env values so the bridge can talk to Supabase.
function readEnv() {
  const out = {};
  const envFile = resolve(appDir, '.env');
  if (existsSync(envFile)) {
    for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return out;
}

const env = readEnv();
const pkg = JSON.parse(readFileSync(resolve(androidAppDir, 'package.json'), 'utf8'));
const configJson = JSON.stringify({
  supabaseUrl: process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || '',
  appVersion: pkg.version || '1.0.0',
});

// Inject config + bridge script into index.html
const indexPath = resolve(webDir, 'index.html');
let html = readFileSync(indexPath, 'utf8');
const inject = [
  `<script>window.__APP_CONFIG__=${configJson};</script>`,
  `<script src="native-bridge.js" defer></script>`,
].join('\n');
if (!html.includes('native-bridge.js')) {
  html = html.replace('</body>', `  ${inject}\n</body>`);
  writeFileSync(indexPath, html);
  console.log('[sync] Injected native bridge into index.html');
}

console.log('[sync] Done.');
