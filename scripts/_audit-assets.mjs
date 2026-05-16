// Audit-only — scans every code file for /assets/ and /content/ references,
// compares against files on disk under assets/ and content/.
// Reports: missing references, unreferenced files, oversized files.
// Read-only: makes no changes.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';

const ROOT = process.cwd();

function walk(dir, exts) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.git')) continue;
    if (e.name === 'node_modules' || e.name === 'scripts') continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, exts));
    else if (!exts || exts.some(x => e.name.endsWith(x))) out.push(p);
  }
  return out;
}

const codeFiles = walk(ROOT, ['.html', '.js', '.css', '.md', '.mjs']);

const referenced = new Set();
// Match any /assets/ or /content/ path that appears in code, regardless
// of the attribute or CSS construct around it. Liberal on purpose — we'd
// rather miss-flag than miss-detect.
const reRef = /["'(\s](\/(?:assets|content)\/[^"')\s]+)/g;
for (const f of codeFiles) {
  const s = readFileSync(f, 'utf8');
  let m;
  while ((m = reRef.exec(s)) !== null) {
    let h = m[1];
    h = h.split('#')[0].split('?')[0].replace(/[)'"]+$/, '');
    referenced.add(h);
  }
}

const assetsDir = join(ROOT, 'assets');
const onDisk = existsSync(assetsDir)
  ? walk(assetsDir, null).map(p => '/' + relative(ROOT, p).split('\\').join('/'))
  : [];

const missing = [];
for (const r of referenced) {
  const fp = join(ROOT, r);
  if (!existsSync(fp)) missing.push(r);
}

const referencedFiles = new Set();
for (const r of referenced) referencedFiles.add(r);

const unused = onDisk.filter(a => !referencedFiles.has(a));

// Oversized images (>500KB)
const big = [];
for (const a of onDisk) {
  const fp = join(ROOT, a);
  try {
    const st = statSync(fp);
    if (st.size > 500 * 1024) big.push({ path: a, kb: Math.round(st.size / 1024) });
  } catch {}
}
big.sort((a, b) => b.kb - a.kb);

console.log('=== ASSET AUDIT ===');
console.log('Referenced asset paths:', referenced.size);
console.log('Asset files on disk:', onDisk.length);
console.log('\nMISSING (referenced but file does not exist):', missing.length);
missing.slice(0, 20).forEach(m => console.log('  ' + m));

console.log('\nUNUSED (file exists, never referenced):', unused.length);
unused.slice(0, 40).forEach(u => console.log('  ' + u));

console.log('\nOVERSIZED (>500KB):', big.length);
big.slice(0, 20).forEach(b => console.log('  ' + b.kb + ' KB  ' + b.path));
