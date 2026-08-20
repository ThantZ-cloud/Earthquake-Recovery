/**
 * build.mjs
 * Full APK build: sync web -> cap sync android -> gradle assembleDebug.
 * Produces: android-app/android/app/build/outputs/apk/debug/app-debug.apk
 *
 * Usage: npm run build:apk
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const androidAppDir = resolve(here, '..');
const androidDir = resolve(androidAppDir, 'android');

console.log('[apk] Step 1/3: sync web build...');
execSync('node scripts/sync.mjs', { cwd: androidAppDir, stdio: 'inherit' });

console.log('[apk] Step 2/3: capacitor sync android...');
execSync('npx cap sync android', { cwd: androidAppDir, stdio: 'inherit' });

if (!existsSync(androidDir)) {
  console.log('[apk] android/ missing — running cap add android first...');
  execSync('npx cap add android', { cwd: androidAppDir, stdio: 'inherit' });
}

console.log('[apk] Step 3/3: gradle assembleDebug...');
const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
execSync(`${gradlew} assembleDebug`, { cwd: androidDir, stdio: 'inherit' });

const apk = resolve(androidDir, 'app/build/outputs/apk/debug/app-debug.apk');
console.log(`[apk] DONE: ${apk}`);
