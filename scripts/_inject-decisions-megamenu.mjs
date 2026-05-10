// Throwaway: inject the "AI Decision Questions" link into the Featured
// column of the Insights mega-menu on every page that already has the
// menu. The Insights mega-menu is hand-duplicated per page (no shared
// partial), so this script does the sweep idempotently.
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
    } else if (e.name === 'index.html' || e.name.endsWith('.html')) {
      out.push(p);
    }
  }
  return out;
}

// Existing Featured-column anchor (Foundations Series link is the first
// entry on every page) — we insert above it. The new link will be a
// no-op on the AI Decision Questions page itself (already authored
// inline in the new file), so we skip that path explicitly.
const ANCHOR = '<a href="/insights/#foundations-series" class="mega-link">Foundations Series<span class="mega-link-dek">Five-part field series</span></a>';
const NEW_LINK = '<a href="/ai-decision-questions/" class="mega-link">AI Decision Questions<span class="mega-link-dek">For executives funding AI</span></a>\n          ';

const SKIP_PATHS = new Set([
  'ai-decision-questions/index.html',
]);

let touched = 0;
let already = 0;
let nohook = 0;
for (const f of walk('.')) {
  const norm = f.replace(/\\/g, '/').replace(/^\.\//, '');
  if (SKIP_PATHS.has(norm)) continue;
  const before = fs.readFileSync(f, 'utf8');
  if (!before.includes(ANCHOR)) { nohook++; continue; }
  if (before.includes('href="/ai-decision-questions/"')) { already++; continue; }
  const after = before.replace(ANCHOR, NEW_LINK + ANCHOR);
  if (after === before) { nohook++; continue; }
  fs.writeFileSync(f, after);
  touched++;
  console.log('updated:', f);
}
console.log('Done. Touched:', touched, 'Already:', already, 'No-hook:', nohook);
