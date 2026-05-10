// Throwaway: wrap the "Industries" mega-menu heading in a link to
// /industries/ on every page that carries the header. The mega-menu is
// hand-duplicated per page (no shared partial), so this is a sweep.
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
    } else if (e.name.endsWith('.html')) {
      out.push(p);
    }
  }
  return out;
}

const OLD = '<h4>Industries</h4>';
const NEW = '<h4><a href="/industries/">Industries</a></h4>';

let touched = 0, already = 0, nohook = 0;
for (const f of walk('.')) {
  const before = fs.readFileSync(f, 'utf8');
  if (before.includes(NEW)) { already++; continue; }
  if (!before.includes(OLD)) { nohook++; continue; }
  const after = before.replace(OLD, NEW);
  fs.writeFileSync(f, after);
  touched++;
  console.log('updated:', f);
}
console.log('Done. Touched:', touched, 'Already:', already, 'No-hook:', nohook);
