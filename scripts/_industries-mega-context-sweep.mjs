#!/usr/bin/env node
// One-shot sweep: upgrade the global "Where We Work" mega-menu
// from a flat tile sitemap to a two-zone premium mega-menu —
// adds a left strategic context panel ("Where We Work" eyebrow +
// short positioning copy + "Explore all industries →" link) and
// wraps the existing 10-tile grid into a right-side panel.
//
// Markup change is identical on all 49 pages that include the
// shared nav block. Idempotent — skips pages already converted
// (detected by the .mega-menu--industries modifier class).
//
// Run from repo root:
//   node scripts/_industries-mega-context-sweep.mjs

import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.git')) continue;
    if (entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...await walk(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

// Match the whole industries mega-menu block. The body of
// .mega-industry-tiles is captured so the existing 10 anchors are
// preserved verbatim.
const RE = /<div id="mega-industries" class="mega-menu"([^>]*)>\s*<div class="mega-menu-inner">\s*<h4><a href="\/industries\/">Industries<\/a><\/h4>\s*(<div class="mega-industry-tiles">[\s\S]*?<\/div>)\s*<\/div>\s*<\/div>/;

const NEW = (attrs, tiles) => `<div id="mega-industries" class="mega-menu mega-menu--industries"${attrs}>
    <div class="mega-menu-inner">
      <aside class="mega-menu-context">
        <p class="mega-menu-context__eyebrow">Where We Work</p>
        <p class="mega-menu-context__copy">Mid-market operators where data, workflow, systems, and ownership determine whether AI creates measurable value.</p>
        <a class="mega-menu-context__link" href="/industries/">Explore all industries&nbsp;<span aria-hidden="true">&rarr;</span></a>
      </aside>
      <div class="mega-menu-context__right">
        ${tiles}
      </div>
    </div>
  </div>`;

const files = await walk(ROOT);
let updated = 0;
let skipped = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep)) continue;

  const src = await readFile(file, 'utf8');
  if (src.includes('mega-menu--industries')) {
    skipped++;
    continue;
  }
  const m = src.match(RE);
  if (!m) {
    skipped++;
    continue;
  }
  const next = src.replace(RE, NEW(m[1], m[2]));
  if (next === src) {
    skipped++;
    continue;
  }
  await writeFile(file, next, 'utf8');
  updated++;
  console.log('UPDATED', rel);
}

console.log(`\nDone. updated=${updated}, skipped=${skipped}`);
