#!/usr/bin/env node
// One-shot backfill: for insight article pages that have a byline
// but no date (because their Article JSON-LD never carried a
// datePublished field), assign a random date between May 1 and
// May 15, 2026, write it into the Article JSON-LD (both
// datePublished and dateModified), and re-stamp the visible byline
// to include the date.
//
// Idempotent: skips pages that already have a date span in their
// byline.
//
// Random selection is seeded from a hash of the file's slug so
// re-runs produce the same dates per article (stable but visually
// "scattered" across the May 1–15 window). Skips the legacy
// /insight/index.html dynamic renderer page.
//
// Run from repo root:
//   node scripts/_insights-backfill-dates.mjs

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const ROOT = process.cwd();

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.git') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

function formatDate(iso) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return '';
  const [, y, mo, d] = m;
  return `${MONTHS[parseInt(mo,10)-1]} ${parseInt(d,10)}, ${y}`;
}

// Deterministic "random" date in May 1–15, 2026 derived from a hash
// of the path. This lets re-runs produce the same date per article
// while still scattering dates across the window.
function pickDate(relPath) {
  const h = createHash('sha256').update(relPath).digest();
  const day = (h[0] % 15) + 1; // 1..15
  return `2026-05-${String(day).padStart(2, '0')}`;
}

const files = await walk(ROOT);
let scanned = 0, backfilled = 0, skipped = 0, ignored = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep)) continue;

  const src = await readFile(file, 'utf8');

  // Must be an article detail page.
  if (!src.includes('class="insight-detail-image"') ||
      !src.includes('class="insight-detail-body"')) continue;

  // Must currently carry the byline element (i.e., the previous
  // article-byline sweep already ran).
  if (!src.includes('class="insight-article-byline"')) continue;

  scanned++;

  // Skip the legacy /insight/ dynamic renderer page — it's not a
  // real published article, just a fallback endpoint.
  if (rel === 'insight' + path.sep + 'index.html' || rel === 'insight\\index.html') {
    ignored++;
    console.log(`SKIP (legacy renderer): ${rel}`);
    continue;
  }

  // Idempotency: skip if the byline already has a date span.
  if (src.includes('insight-article-byline__date')) {
    skipped++;
    continue;
  }

  // Detect existing author from the byline.
  const authorMatch = src.match(/<p class="insight-article-byline">By ([^<]+)<\/p>/);
  if (!authorMatch) {
    console.log(`NO BYLINE: ${rel}`);
    continue;
  }
  const author = authorMatch[1].trim();

  // Generate the date for this article.
  const dateIso = pickDate(rel.replace(/\\/g, '/'));
  const dateFormatted = formatDate(dateIso);

  let next = src;

  // 1) Insert datePublished + dateModified into the Article JSON-LD
  //    (immediately before "author":{). Skip if already present.
  if (!/"@type":"Article"[^]*?"datePublished"/.test(next)) {
    next = next.replace(
      /("@type":"Article",[^]*?)("author":\{)/,
      (full, prefix, authorStart) => `${prefix}"datePublished":"${dateIso}","dateModified":"${dateIso}",${authorStart}`
    );
  }

  // 2) Re-stamp the byline to include the date span.
  next = next.replace(
    /<p class="insight-article-byline">By ([^<]+)<\/p>/,
    (full, who) => `<p class="insight-article-byline">By ${who.trim()}<span class="insight-article-byline__sep" aria-hidden="true">&middot;</span><span class="insight-article-byline__date">${dateFormatted}</span></p>`
  );

  if (next === src) {
    console.log(`UNCHANGED: ${rel} (regex did not match)`);
    continue;
  }

  await writeFile(file, next, 'utf8');
  backfilled++;
  console.log(`${rel} — ${author} · ${dateFormatted}`);
}

console.log('');
console.log(`Done. scanned=${scanned}, backfilled=${backfilled}, already-dated=${skipped}, ignored-legacy=${ignored}`);
