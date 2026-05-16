#!/usr/bin/env node
// One-shot sweep: replace the inline style on the site-header logo
// <img> with a CSS class so the logo can be sized responsively. The
// inline style locked the logo at height: 48px on every viewport,
// which crowded the mobile header (logo + Assessment CTA + hamburger
// all competed for ~340px of content width on iPhone-class screens).
//
// After this sweep, .site-header-logo carries the styling. CSS sets
// 48px on desktop and 36px on mobile — proportionally shrinking the
// wordmark and freeing horizontal space for the CTA and hamburger.
//
// Idempotent: skips pages already converted to the class-based logo.
//
// Run from repo root:
//   node scripts/_site-header-logo-sweep.mjs

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

const OLD = '<img src="/assets/global-header-logo-wordmark.png" alt="Foundation AI Advisory" style="height:48px;width:auto;max-width:none;display:block;" />';
const NEW = '<img src="/assets/global-header-logo-wordmark.png" alt="Foundation AI Advisory" class="site-header-logo" />';

const files = await walk(ROOT);
let updated = 0;
let skipped = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep)) continue;

  const src = await readFile(file, 'utf8');
  if (src.includes('class="site-header-logo"')) {
    skipped++;
    continue;
  }
  if (!src.includes(OLD)) {
    skipped++;
    continue;
  }
  const next = src.replace(OLD, NEW);
  if (next === src) {
    skipped++;
    continue;
  }
  await writeFile(file, next, 'utf8');
  updated++;
  console.log('UPDATED', rel);
}

console.log(`\nDone. updated=${updated}, skipped=${skipped}`);
