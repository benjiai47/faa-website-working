// Throwaway: fix href/src="//..." double-slash artifacts produced by the
// clean-URLs migration when normalize() returned an already-absolute path.
// Preserves legitimate protocol-relative URLs (//www.example.com).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.posix.join(dir.replaceAll('\\', '/'), e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'squoosh-queue', 'squoosh-out', 'assets', 'content', 'scripts'].includes(e.name)) continue;
      walk(p, out);
    } else {
      const ext = path.extname(e.name).toLowerCase();
      if (['.html', '.xml', '.txt', '.js', '.mjs', '.css'].includes(ext)) out.push(p);
    }
  }
  return out;
}

const files = walk('.');
let fixedCount = 0;
let totalReps = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  // Match href=" //" or src=" //" where the next chars are NOT a hostname
  // (no dot in the immediate token). i.e., bug pattern //assets/, //styles.css
  // is fixed; legitimate //example.com is preserved.
  const re = /(href|src)="\/\/(?![a-zA-Z0-9-]+\.)/g;
  const matches = before.match(re) || [];
  if (matches.length) {
    s = s.replace(re, '$1="/');
    fs.writeFileSync(f, s);
    fixedCount++;
    totalReps += matches.length;
  }
}
console.log('Fixed double-slash in', fixedCount, 'files; total replacements:', totalReps);
