// Throwaway: relocate the .footer-attribution paragraph from BELOW the
// existing logo/copyright + legal-nav row to ABOVE it. Same content,
// same class, just different sibling order inside the footer container.
// Pairs with a CSS update that flips the spacing rhythm (margin-bottom
// instead of margin-top, hairline divider removed).
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

// The current footer has:
//   <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
//     ...left + right rows...
//   </div>
//   <p class="footer-attribution">Built in-house ...</p>
//
// We want:
//   <p class="footer-attribution">Built in-house ...</p>
//   <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
//     ...left + right rows...
//   </div>
//
// Strategy: find the attribution <p> sitting at the SAME indentation as
// the flex row's closing </div> (4 spaces). Remove it from there. Then
// insert it directly above the flex row's opening tag, with the same
// 4-space indent. Idempotent — if the <p> is already above the flex
// row in a file, leave it alone.

const ATTRIBUTION_LINE_RE = /^    <p class="footer-attribution">[^<]*<\/p>\r?\n/m;
const FLEX_ROW_OPEN = '    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-5">';

let touched = 0, already = 0, nohook = 0;
for (const f of walk('.')) {
  const before = fs.readFileSync(f, 'utf8');
  if (!before.includes('class="footer-attribution"')) { nohook++; continue; }

  // Detect whether the <p> is already above the flex row (idempotency).
  // We look at the order of the two anchor strings in the file.
  const pIndex = before.indexOf('<p class="footer-attribution"');
  const flexIndex = before.indexOf(FLEX_ROW_OPEN);
  if (pIndex < 0 || flexIndex < 0) { nohook++; continue; }
  if (pIndex < flexIndex) { already++; continue; }

  // Pull the attribution line out of its current location.
  const match = before.match(ATTRIBUTION_LINE_RE);
  if (!match) { nohook++; continue; }
  const lineWithNewline = match[0];
  const without = before.replace(ATTRIBUTION_LINE_RE, '');

  // Re-insert just above the flex-row opening tag.
  const after = without.replace(FLEX_ROW_OPEN, lineWithNewline + FLEX_ROW_OPEN);
  if (after === without) { nohook++; continue; }

  fs.writeFileSync(f, after);
  touched++;
  console.log('moved:', f);
}
console.log('Done. Moved:', touched, 'Already-above:', already, 'No-hook:', nohook);
