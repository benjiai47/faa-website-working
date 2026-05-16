#!/usr/bin/env node
// One-shot sweep: upgrade the "Where We Work" mega-menu to the
// premium two-zone + bottom-strip layout. Two markup changes per
// page:
//
// 1. Refresh the left intro panel:
//    - Eyebrow stays "Where We Work" (rendered uppercase by CSS).
//    - NEW: add an <h3> heading "Industries where operations
//      determine AI value." between eyebrow and body.
//    - Tighten the body copy to the CEP version.
//    - Keep the existing "Explore all industries ->" link.
//
// 2. Insert a bottom insight strip after the tile grid, as a new
//    full-width grid child of .mega-menu-inner. Holds a one-line
//    methodology pivot + "View the Foundation AI Advisory
//    methodology ->" link.
//
// Idempotent: skips pages that already contain
//   .mega-menu-context__heading
// (the new heading is the unambiguous "already converted" marker).
//
// Run from repo root:
//   node scripts/_where-we-work-mega-redesign-sweep.mjs

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

// Refresh the intro panel.
const INTRO_RE = /<aside class="mega-menu-context">\s*<p class="mega-menu-context__eyebrow">Where We Work<\/p>\s*<p class="mega-menu-context__copy">[^<]*<\/p>\s*<a class="mega-menu-context__link" href="\/industries\/">Explore all industries&nbsp;<span aria-hidden="true">&rarr;<\/span><\/a>\s*<\/aside>/;
const INTRO_NEW = `<aside class="mega-menu-context">
        <p class="mega-menu-context__eyebrow">Where We Work</p>
        <h3 class="mega-menu-context__heading">Industries where operations determine AI value.</h3>
        <p class="mega-menu-context__copy">Foundation AI Advisory works with mid-market operators where data quality, workflow discipline, systems, and ownership decide whether AI creates measurable value or scales existing friction.</p>
        <a class="mega-menu-context__link" href="/industries/">Explore all industries&nbsp;<span aria-hidden="true">&rarr;</span></a>
      </aside>`;

// Insert insight strip. Anchor on the AI Data tile (last tile) +
// the two closing </div>s of .mega-industry-tiles and
// .mega-menu-context__right. Insert the strip between the second
// </div> (right column close) and the .mega-menu-inner close.
const STRIP_RE = /(class="mega-industry-tile mega-industry-tile--ai-data">[\s\S]*?<\/a>\s*<\/div>\s*<\/div>)(\s*<\/div>\s*<\/div>)/;
const STRIP_INSERT = `
      <div class="mega-menu-insight-strip">
        <p class="mega-menu-insight-strip__copy">Same methodology. Different operating realities. Foundation AI Advisory starts with data, workflow, ownership, and controls before AI is applied.</p>
        <a class="mega-menu-insight-strip__link" href="/methodology/">View the Foundation AI Advisory methodology&nbsp;<span aria-hidden="true">&rarr;</span></a>
      </div>`;

const files = await walk(ROOT);
let updated = 0;
let skipped = 0;
let notMatched = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep)) continue;

  let src = await readFile(file, 'utf8');
  if (src.includes('mega-menu-context__heading')) {
    skipped++;
    continue;
  }
  if (!INTRO_RE.test(src) || !STRIP_RE.test(src)) {
    notMatched++;
    continue;
  }
  src = src.replace(INTRO_RE, INTRO_NEW);
  src = src.replace(STRIP_RE, (_, captured, tail) => `${captured}${STRIP_INSERT}${tail}`);
  await writeFile(file, src, 'utf8');
  updated++;
  console.log('UPDATED', rel);
}

console.log(`\nDone. updated=${updated}, skipped=${skipped}, no-match=${notMatched}`);
