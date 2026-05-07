import { build } from 'esbuild';
import { readdirSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = resolve(root, 'src');

const categories = ['array', 'object', 'string', 'function', 'lang', 'collection', 'math', 'util'];

async function buildAll() {
  console.log('Building dodash...\n');

  // Build ESM
  await build({
    entryPoints: [
      resolve(src, 'index.js'),
      ...categories.map((cat) => resolve(src, cat, 'index.js')),
    ],
    outdir: resolve(root, 'dist/esm'),
    format: 'esm',
    bundle: false,
    platform: 'neutral',
    target: 'es2022',
    sourcemap: true,
    treeShaking: true,
  });
  console.log('✓ ESM build complete');

  // Build CJS
  await build({
    entryPoints: [
      resolve(src, 'index.js'),
      ...categories.map((cat) => resolve(src, cat, 'index.js')),
    ],
    outdir: resolve(root, 'dist/cjs'),
    format: 'cjs',
    bundle: true,
    platform: 'node',
    target: 'node18',
    sourcemap: true,
    outExtension: { '.js': '.cjs' },
  });
  console.log('✓ CJS build complete');

  // Build minified browser bundle
  const result = await build({
    entryPoints: [resolve(src, 'index.js')],
    outfile: resolve(root, 'dist/dodash.min.js'),
    format: 'esm',
    bundle: true,
    minify: true,
    platform: 'browser',
    target: 'es2022',
    sourcemap: true,
    metafile: true,
  });

  const outputSize = Object.values(result.metafile.outputs)[0]?.bytes ?? 0;
  console.log(`✓ Browser bundle: ${(outputSize / 1024).toFixed(1)} KB (minified)`);
  console.log('\nBuild complete!');
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
