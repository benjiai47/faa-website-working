// Pick up squoosh-out/, replace originals with WebP, sweep references.
// Steps:
//   1. Validate every .webp matches a .png on disk (in assets/ or assets/insights/).
//   2. Back up the original .png to assets/_originals/<basename>.
//   3. Move .webp into the original's folder.
//   4. Sweep code (HTML/JS/MJS/CSS/MD/JSON/XML) for the basename.png and rewrite to basename.webp.
//   5. Verify no remaining references to the old PNG filenames anywhere.
//   6. Re-run prerender so foundations series article HTML reflects the new image refs.
//   7. Report.
// Original PNGs in assets/ are NOT deleted yet — that happens after live verification.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

// =========================================================================
// 1. Inventory squoosh-out/ and match each to a source PNG
// =========================================================================
const webps = fs.readdirSync('squoosh-out').filter((f) => f.endsWith('.webp'));

function findOriginal(stem) {
  for (const dir of ['assets', 'assets/insights']) {
    const p = path.posix.join(dir, stem + '.png');
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const matches = [];
const unmatched = [];
for (const webp of webps) {
  const stem = webp.replace(/\.webp$/, '');
  const original = findOriginal(stem);
  if (original) matches.push({ webp, stem, original });
  else unmatched.push(webp);
}

if (unmatched.length) {
  console.log('UNMATCHED webps (no source .png found in assets/ or assets/insights/):');
  for (const u of unmatched) console.log('  ', u);
  console.log('Aborting. Investigate the filename mismatch.');
  process.exit(1);
}
console.log('Matched', matches.length, 'WebP(s) to source PNGs.');

// =========================================================================
// 2. Back up originals + move WebPs into place
// =========================================================================
fs.mkdirSync('assets/_originals', { recursive: true });
for (const m of matches) {
  const backupPath = path.posix.join('assets/_originals', path.basename(m.original));
  fs.copyFileSync(m.original, backupPath);
  const newPath = m.original.replace(/\.png$/, '.webp');
  fs.renameSync(path.posix.join('squoosh-out', m.webp), newPath);
  m.newPath = newPath;
}
console.log('Originals backed up to assets/_originals/, WebPs moved into place.');

// =========================================================================
// 3. Sweep code for references — basename.png -> basename.webp
// =========================================================================
function walkText(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.posix.join(dir.replaceAll('\\', '/'), entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'assets', '_originals', '.git', 'squoosh-queue', 'squoosh-out'].includes(entry.name)) continue;
      walkText(p, out);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (['.html', '.js', '.mjs', '.css', '.md', '.txt', '.json', '.xml'].includes(ext)) {
      out.push(p);
    }
  }
  return out;
}
const files = walkText('.');

let totalReplacements = 0;
const perFileChanges = {};
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  for (const m of matches) {
    const oldName = m.stem + '.png';
    const newName = m.stem + '.webp';
    const occurrences = s.split(oldName).length - 1;
    if (occurrences > 0) {
      s = s.split(oldName).join(newName);
      totalReplacements += occurrences;
      perFileChanges[f] = (perFileChanges[f] || 0) + occurrences;
    }
  }
  if (s !== before) fs.writeFileSync(f, s);
}
console.log('Reference sweep: rewrote', totalReplacements, 'occurrences across', Object.keys(perFileChanges).length, 'files.');

// =========================================================================
// 4. Verify nothing still references an old PNG basename
// =========================================================================
const remaining = [];
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of matches) {
    if (s.includes(m.stem + '.png')) {
      remaining.push({ file: f, name: m.stem + '.png' });
    }
  }
}
if (remaining.length) {
  console.log('WARNING: residual PNG references (would still 404 after originals are removed):');
  for (const r of remaining.slice(0, 20)) console.log('  ', r.file, '→', r.name);
  if (remaining.length > 20) console.log('  ...', remaining.length - 20, 'more');
} else {
  console.log('Clean: no residual PNG references in code.');
}

// =========================================================================
// 5. Re-run prerender (foundations articles bake their image into HTML)
// =========================================================================
// First we need to invalidate the <!--PRERENDERED--> marker so the script
// regenerates the body with updated image refs.
const foundationsFiles = [
  'insights-foundations-applied-ai-series.html',
  'insights-foundations-data-constraint.html',
  'insights-foundations-process-before-ai.html',
  'insights-foundations-ai-architecture.html',
  'insights-foundations-ai-roi-sequencing.html',
  'insights-foundations-ai-governance.html',
];
const insightFiles = [
  'insights/where-agents-earn-their-keep.html',
  'insights/mid-market-case-for-platform-agnostic.html',
  'insights/data-governance-non-enterprise-teams.html',
  'insights/automating-a-broken-process-scales-the-problem.html',
  'insights/how-work-actually-gets-done-vs-how-its-documented.html',
];
for (const f of [...foundationsFiles, ...insightFiles]) {
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, 'utf8');
  // Replace the entire <main>...</main> with a stub that the prerender will fill.
  // Prerender's replaceMainBody overwrites whatever is between <main> and </main>,
  // and skips files that have <!--PRERENDERED-->. So strip the marker.
  s = s.replace('<!--PRERENDERED-->', '');
  fs.writeFileSync(f, s);
}
console.log('Cleared <!--PRERENDERED--> marker on 11 pages so prerender will re-run.');

execSync('node scripts/prerender.mjs', { stdio: 'inherit' });
console.log('Prerender re-run complete.');

// =========================================================================
// 6. Final report
// =========================================================================
let totalOldBytes = 0, totalNewBytes = 0;
for (const m of matches) {
  totalOldBytes += fs.statSync(path.posix.join('assets/_originals', path.basename(m.original))).size;
  totalNewBytes += fs.statSync(m.newPath).size;
}
console.log('');
console.log('SUMMARY');
console.log('  Files compressed:', matches.length);
console.log('  Original total:  ', (totalOldBytes / 1024 / 1024).toFixed(1), 'MB');
console.log('  WebP total:      ', (totalNewBytes / 1024 / 1024).toFixed(1), 'MB');
console.log('  Reduction:       ', ((1 - totalNewBytes / totalOldBytes) * 100).toFixed(1), '%');
console.log('');
console.log('Originals are still on disk at assets/<file>.png (and backed up at assets/_originals/<file>.png).');
console.log('They will be deleted in the deploy commit AFTER live verification of the WebPs.');
