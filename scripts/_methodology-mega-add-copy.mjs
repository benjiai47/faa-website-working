#!/usr/bin/env node
// One-shot sweep: add one explanatory sentence (.mega-pillar-card__copy)
// to each of the three Methodology mega-menu pillar cards. Runs after
// the previous sweep that introduced .mega-pillar-card markup.
//
// Idempotent — re-running it is a no-op once cards have __copy added.
//
// Run from repo root:  node scripts/_methodology-mega-add-copy.mjs

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

// Map each pillar's existing dek line to the new copy sentence we want
// to inject right after it. We match the full dek <p> so we know which
// card we're inside without parsing the surrounding structure.
const INJECTIONS = [
  {
    deks: '<p class="mega-pillar-card__dek">Data before anything else</p>',
    copy: '<p class="mega-pillar-card__copy">Clean, governed, accessible data creates the foundation for reliable reporting, workflow stability, and AI readiness.</p>',
  },
  {
    deks: '<p class="mega-pillar-card__dek">Fix process before applying AI</p>',
    copy: '<p class="mega-pillar-card__copy">Map how work actually gets done, remove friction, clarify ownership, and improve flow before automation scales the process.</p>',
  },
  {
    deks: '<p class="mega-pillar-card__dek">Designed around measurable outcomes</p>',
    copy: '<p class="mega-pillar-card__copy">Apply AI to optimized workflows with defined ownership, controls, ROI logic, and a path to production.</p>',
  },
];

const files = await walk(ROOT);
let updated = 0;
let already = 0;
let skipped = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep)) continue;

  const src = await readFile(file, 'utf8');
  if (!src.includes('mega-pillar-cards')) continue;

  if (src.includes('mega-pillar-card__copy')) {
    already++;
    continue;
  }

  let next = src;
  let allMatched = true;
  for (const { deks, copy } of INJECTIONS) {
    if (!next.includes(deks)) {
      allMatched = false;
      break;
    }
    // Inject the new <p> immediately after the dek, on its own line,
    // preserving the existing 12-space indent.
    next = next.replace(
      deks,
      deks + '\n            ' + copy,
    );
  }

  if (!allMatched) {
    console.warn('SKIP (dek not found):', rel);
    skipped++;
    continue;
  }

  if (next === src) {
    skipped++;
    continue;
  }

  await writeFile(file, next, 'utf8');
  updated++;
  console.log('UPDATED', rel);
}

console.log(`\nDone. updated=${updated}, already-converted=${already}, skipped=${skipped}`);
