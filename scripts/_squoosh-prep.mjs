// One-shot: build the squoosh batch queue.
// - Inventories every PNG > 500 KB under assets/.
// - Greps the codebase to confirm each is actually referenced.
// - Sorts referenced files into a queue with per-file target sizes and
//   resize hints based on display context.
// - Copies referenced files to squoosh-queue/ for drag-and-drop.
// - Writes squoosh-queue/_targets.txt — the printable checklist.
// - Reports orphans (PNGs not referenced anywhere) for later cleanup.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

const SIZE_FLOOR = 500 * 1024;

// =========================================================================
// 1. Find every PNG > floor
// =========================================================================
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.posix.join(dir.replaceAll('\\', '/'), entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '_originals') continue;
      out.push(...walk(p));
    } else if (entry.name.toLowerCase().endsWith('.png')) {
      out.push(p);
    }
  }
  return out;
}
const pngs = walk('assets').map((p) => ({ path: p, size: fs.statSync(p).size }))
  .filter((x) => x.size >= SIZE_FLOOR)
  .sort((a, b) => b.size - a.size);

// =========================================================================
// 2. Build a single concatenated text blob of every code/markup file we care
//    about. Then for each PNG, count occurrences of its basename. Cheap, fast.
// =========================================================================
function readAll(globs) {
  const texts = [];
  function add(dir, recur = true) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.posix.join(dir.replaceAll('\\', '/'), entry.name);
      if (entry.isDirectory()) {
        if (recur && !['node_modules', 'assets', '_originals', '.git'].includes(entry.name)) add(p);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      if (['.html', '.js', '.mjs', '.css', '.md', '.txt', '.json', '.xml'].includes(ext)) {
        texts.push(fs.readFileSync(p, 'utf8'));
      }
    }
  }
  add('.');
  return texts.join('\n');
}
const corpus = readAll();

// =========================================================================
// 3. Classify each PNG
// =========================================================================
function targetForPath(p, basename) {
  // Returns { sizeKB, resizeWidth, note }.
  // Display-aware targets:
  //   - hero carousel/full-width on homepage: ~1920px, 350 KB
  //   - pillar/insight card thumbnails: ~1200px, 200 KB
  //   - foundations series + page heroes: ~1920px, 300 KB
  //   - headshots, og: ~1200px, 120 KB
  //   - everything else > 500 KB: 250 KB cap, 1920 max width
  if (basename.startsWith('homepage-hero-')) return { sizeKB: 350, resizeWidth: 1920, note: 'home hero carousel' };
  if (basename.startsWith('homepage-pillar-')) return { sizeKB: 200, resizeWidth: 1200, note: 'home pillar thumbnail' };
  if (basename.startsWith('homepage-methodology-hero-')) return { sizeKB: 200, resizeWidth: 1200, note: 'home methodology pillar' };
  if (basename.startsWith('homepage-insights-')) return { sizeKB: 150, resizeWidth: 1200, note: 'home insights teaser' };
  if (basename.includes('-hero-')) return { sizeKB: 300, resizeWidth: 1920, note: 'page hero' };
  if (basename.includes('foundations-series-')) return { sizeKB: 300, resizeWidth: 1920, note: 'foundations series article hero' };
  if (basename.includes('about-leadership-')) return { sizeKB: 120, resizeWidth: 800, note: 'leadership headshot' };
  if (basename.includes('-card.png')) return { sizeKB: 150, resizeWidth: 1200, note: 'insight card thumbnail' };
  if (p.includes('/insights/')) return { sizeKB: 250, resizeWidth: 1600, note: 'insight art' };
  return { sizeKB: 250, resizeWidth: 1920, note: 'general' };
}

const queue = [];
const orphans = [];
for (const { path: p, size } of pngs) {
  const basename = path.basename(p);
  // Count occurrences of the basename in the corpus
  const refs = (corpus.match(new RegExp(basename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  if (refs === 0) {
    orphans.push({ p, size, basename });
    continue;
  }
  const { sizeKB, resizeWidth, note } = targetForPath(p, basename);
  queue.push({ p, basename, size, sizeKB, resizeWidth, note, refs });
}

// =========================================================================
// 4. Make squoosh-queue/, copy files
// =========================================================================
fs.rmSync('squoosh-queue', { recursive: true, force: true });
fs.mkdirSync('squoosh-queue', { recursive: true });
for (const item of queue) {
  fs.copyFileSync(item.p, path.posix.join('squoosh-queue', item.basename));
}
fs.mkdirSync('squoosh-out', { recursive: true });
fs.mkdirSync('assets/_originals', { recursive: true });

// =========================================================================
// 5. Write _targets.txt
// =========================================================================
function fmt(n) { return (n / 1024).toFixed(0).padStart(6) + ' KB'; }
const lines = [];
lines.push('SQUOOSH BATCH — FAA WEBSITE');
lines.push('---------------------------');
lines.push('Settings for every file: codec=WebP, quality=80 (use 85 for headshots),');
lines.push('Resize=ON if file is wider than the listed target width.');
lines.push('Save downloads into:  ' + path.posix.join(process.cwd().replaceAll('\\', '/'), 'squoosh-out'));
lines.push('');
lines.push('Files to compress (' + queue.length + '):');
lines.push('');
lines.push('  current      target  resize    file');
lines.push('  ---------  --------  ------    ----');
let totalCurrent = 0, totalTarget = 0;
for (const item of queue) {
  totalCurrent += item.size;
  totalTarget += item.sizeKB * 1024;
  lines.push('  ' + fmt(item.size) + '  ≤ ' + String(item.sizeKB).padStart(4) + ' KB  ' + String(item.resizeWidth).padStart(4) + 'px  ' + item.basename + '   (' + item.note + ', ' + item.refs + ' ref' + (item.refs === 1 ? '' : 's') + ')');
}
lines.push('');
lines.push('  Totals: current ' + fmt(totalCurrent) + '  ->  target ≤ ' + fmt(totalTarget));
lines.push('  Expected savings: ~' + ((1 - totalTarget / totalCurrent) * 100).toFixed(0) + '%');
lines.push('');
if (orphans.length) {
  lines.push('Orphans (PNGs > 500 KB with zero references — flagged for separate cleanup, NOT in queue):');
  for (const o of orphans) {
    lines.push('  ' + fmt(o.size) + '  ' + o.p);
  }
  lines.push('');
}
lines.push('Workflow:');
lines.push('  1. Open https://squoosh.app');
lines.push('  2. Drag a file from squoosh-queue/ into the page');
lines.push('  3. Right side: codec WebP, quality 80, Resize ON to width listed above');
lines.push('  4. Verify output size <= target (bottom of right panel)');
lines.push('  5. Click download (bottom-right of right panel)');
lines.push('  6. Save into squoosh-out/ keeping default filename');
lines.push('  7. Repeat for every file in squoosh-queue/');
lines.push('  8. When finished, tell Claude: "squoosh-out is ready"');

fs.writeFileSync('squoosh-queue/_targets.txt', lines.join('\n') + '\n');

// =========================================================================
// 6. Update .gitignore
// =========================================================================
const gitignorePath = '.gitignore';
let gi = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';
const adds = ['squoosh-queue/', 'squoosh-out/', 'assets/_originals/'];
let giChanged = false;
for (const line of adds) {
  if (!gi.split(/\r?\n/).map((l) => l.trim()).includes(line)) {
    if (gi && !gi.endsWith('\n')) gi += '\n';
    gi += line + '\n';
    giChanged = true;
  }
}
if (giChanged) fs.writeFileSync(gitignorePath, gi);

console.log('SQUOOSH BATCH PREPARED');
console.log('  Queue size:', queue.length, 'files');
console.log('  Orphans flagged:', orphans.length, '(not in queue)');
console.log('  Total source bytes:', (totalCurrent / 1024 / 1024).toFixed(1), 'MB');
console.log('  Total target bytes:', (totalTarget / 1024 / 1024).toFixed(1), 'MB');
console.log('  .gitignore updated:', giChanged);
console.log('');
console.log('Next steps:');
console.log('  1. Open squoosh-queue/_targets.txt for the per-file checklist');
console.log('  2. Open https://squoosh.app');
console.log('  3. Drag files in one at a time, save downloads to squoosh-out/');
console.log('  4. When done, tell Claude: "squoosh-out is ready"');
