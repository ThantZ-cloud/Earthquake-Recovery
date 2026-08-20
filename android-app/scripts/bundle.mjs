/**
 * bundle.mjs
 * Bundles src/native-bridge.js into a single IIFE (web/native-bridge.js)
 * using esbuild. No-op for plain web — the bridge self-guards.
 *
 * Usage: npm run bundle
 */
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '..', 'web');
mkdirSync(outDir, { recursive: true });

await build({
  entryPoints: [resolve(here, '..', 'src/native-bridge.js')],
  outfile: resolve(outDir, 'native-bridge.js'),
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['chrome110'],
  minify: true,
  sourcemap: false,
  logLevel: 'info',
});

console.log('[bundle] web/native-bridge.js written');
