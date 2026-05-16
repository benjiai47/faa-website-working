#!/usr/bin/env node
// One-shot sweep: insert a mobile-only "Assessment" CTA into the
// site header on every page that has the desktop "Business Systems
// Assessment" mailto button. The new CTA sits BEFORE the desktop
// button in the right-side container so source order is:
//
//   [Client Workspace link]
//   [mobile-header-cta — visible <640px]
//   [Business Systems Assessment — visible >=640px]
//   [mobile menu toggle — injected by nav.js, visible <1280px]
//
// Visibility is purely CSS (see .mobile-header-cta in styles.css):
// inline-flex by default, display:none at >=640px so the full
// desktop button takes over.
//
// Idempotent: skips pages that already include the new CTA.
//
// Run from repo root:
//   node scripts/_mobile-header-cta-sweep.mjs

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

// The exact desktop BSA button signature, identical across pages.
const DESKTOP_BSA = '<a href="mailto:blueprint@foundationaiadvisory.com?subject=Business%20Systems%20Assessment%20Inquiry" class="btn btn-primary hidden sm:inline-flex">Business Systems Assessment</a>';

// Mobile CTA — same href so behavior matches the desktop button.
// Compact "Assessment" label fits cleanly in the header on small
// viewports without crowding the hamburger.
const MOBILE_CTA = '<a href="mailto:blueprint@foundationaiadvisory.com?subject=Business%20Systems%20Assessment%20Inquiry" class="mobile-header-cta" aria-label="Start a Business Systems Assessment">Assessment</a>';

// Insert the mobile CTA before the desktop button.
const REPLACEMENT = `${MOBILE_CTA}\n      ${DESKTOP_BSA}`;

const files = await walk(ROOT);
let updated = 0;
let skipped = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep)) continue;

  const src = await readFile(file, 'utf8');

  // Skip pages that already have the mobile CTA wired in.
  if (src.includes('class="mobile-header-cta"')) {
    skipped++;
    continue;
  }

  if (!src.includes(DESKTOP_BSA)) {
    skipped++;
    continue;
  }

  const next = src.replace(DESKTOP_BSA, REPLACEMENT);
  if (next === src) {
    skipped++;
    continue;
  }

  await writeFile(file, next, 'utf8');
  updated++;
  console.log('UPDATED', rel);
}

console.log(`\nDone. updated=${updated}, skipped=${skipped}`);
