#!/usr/bin/env node
// One-shot sweep: replace the AI Training (#mega-ai-training) mega-menu
// inner block on every page, swapping the lightweight text-only
// .mega-method-cards--two layout for an image-backed two-card layout
// (.mega-ai-training-cards / .mega-ai-training-card). Also normalizes
// the hrefs to the section anchors so every page deep-links the same
// way the desktop methodology pattern does.
//
// Idempotent — re-running it is a no-op once converted.
//
// Run from repo root:  node scripts/_ai-training-mega-image-cards.mjs

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

const NEW_BLOCK = `<div id="mega-ai-training" class="mega-menu" role="region" aria-label="AI Training">
    <div class="mega-menu-inner">
      <div class="mega-ai-training-cards">
        <a href="/ai-training-workforce-development/#ai-bootcamp" class="mega-ai-training-card mega-ai-training-card--bootcamp">
          <div class="mega-ai-training-card__image" aria-hidden="true"></div>
          <div class="mega-ai-training-card__content">
            <span class="mega-ai-training-card__num">Foundations</span>
            <h3 class="mega-ai-training-card__title">AI Training Bootcamp</h3>
            <p class="mega-ai-training-card__dek">Learning the basics of AI &mdash; from foundations to using AI to solve real business problems.</p>
          </div>
        </a>
        <a href="/ai-training-workforce-development/#workforce-development" class="mega-ai-training-card mega-ai-training-card--workforce">
          <div class="mega-ai-training-card__image" aria-hidden="true"></div>
          <div class="mega-ai-training-card__content">
            <span class="mega-ai-training-card__num">Applied</span>
            <h3 class="mega-ai-training-card__title">AI Workforce Development</h3>
            <p class="mega-ai-training-card__dek">Practical, hands-on, domain-specific training for executives, managers, and teams.</p>
          </div>
        </a>
      </div>
    </div>
  </div>`;

// Anchor on the marker class `mega-method-cards--two` inside
// #mega-ai-training. Match through the third closing </div>.
const RE =
  /<div id="mega-ai-training"[^>]*>\s*<div class="mega-menu-inner">\s*<div class="mega-method-cards mega-method-cards--two">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const files = await walk(ROOT);
let updated = 0;
let already = 0;
let skipped = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep)) continue;

  const src = await readFile(file, 'utf8');
  if (!src.includes('id="mega-ai-training"')) continue;

  if (src.includes('mega-ai-training-cards')) {
    already++;
    continue;
  }

  if (!RE.test(src)) {
    console.warn('SKIP (no regex match):', rel);
    skipped++;
    continue;
  }

  const next = src.replace(RE, NEW_BLOCK);
  if (next === src) {
    skipped++;
    continue;
  }

  await writeFile(file, next, 'utf8');
  updated++;
  console.log('UPDATED', rel);
}

console.log(`\nDone. updated=${updated}, already-converted=${already}, skipped=${skipped}`);
