// Replace every "By Industry" with "Where We Work" across all HTML files.
// All grepped occurrences are in nav/title/eyebrow contexts; no body copy.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.posix.join(dir.replaceAll('\\', '/'), e.name);
    if (e.isDirectory()) {
      if (['node_modules', 'assets', '.git', 'squoosh-queue', 'squoosh-out', 'content', 'scripts'].includes(e.name)) continue;
      walk(p, out);
    } else if (e.name.toLowerCase().endsWith('.html')) {
      out.push(p);
    }
  }
  return out;
}

const files = walk('.');
let touched = 0;
let totalReps = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  s = s.split('By Industry').join('Where We Work');
  if (s !== before) {
    fs.writeFileSync(f, s);
    const count = (before.match(/By Industry/g) || []).length;
    console.log('  ', f, '— replaced', count, 'occurrence(s)');
    touched++;
    totalReps += count;
  }
}
console.log('Files updated:', touched, '— total replacements:', totalReps);
