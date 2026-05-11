#!/usr/bin/env node
// One-shot sweep across every page header:
//
//   1. Convert the four <button data-mega="..."> dropdown triggers
//      to <a data-mega="..." href="/topic/"> anchors so clicking
//      the label navigates to the topic landing page while hover/
//      focus continues to open the dropdown.
//   2. Inject a new "Home" link as the first item in the primary
//      nav, before Methodology.
//   3. Preserve any existing aria-current="page" attribute on the
//      relevant trigger so per-page active states still work.
//
// Idempotent — re-running it is a no-op once converted.
//
// Run from repo root:  node scripts/_nav-anchor-conversion-and-home.mjs

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

// Map each data-mega trigger to its landing page URL.
const HREFS = {
  methodology: '/methodology/',
  'ai-training': '/ai-training-workforce-development/',
  industries: '/industries/',
  insights: '/insights/',
};

// Match the entire <button data-mega="..."> ... </button> block.
// Capture: the data-mega value, the inner content (label + caret).
const BUTTON_RE =
  /<button type="button" class="utilnav-link" data-mega="([^"]+)"([^>]*)>\s*([\s\S]*?)\s*<\/button>/g;

// Match the primary <nav> opening so we can inject Home as the first item.
// We look for the marker <button data-mega="methodology"> which previously
// led the list. After this sweep that becomes an <a data-mega="methodology">,
// so the marker we use to find the insertion point is broader.
const HOME_LINK = '      <a href="/" class="utilnav-link" style="height:96px;">Home</a>\n      ';

const files = await walk(ROOT);
let updated = 0;
let already = 0;
let skipped = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep)) continue;

  const src = await readFile(file, 'utf8');
  if (!src.includes('data-mega=')) continue;

  let next = src;
  let didConvert = false;
  let didInjectHome = false;

  // ---- Step 1: convert buttons to anchors -------------------------
  next = next.replace(BUTTON_RE, (_match, dataMega, extraAttrs, inner) => {
    const href = HREFS[dataMega];
    if (!href) return _match; // unknown trigger — leave it
    didConvert = true;
    // The dropdown items inside .mega-menu still call closeMenu(true)
    // on click; their hrefs navigate normally. The <a> here mirrors
    // the original button's attributes (aria-controls, aria-expanded,
    // aria-haspopup, optional aria-current). Adding style height:96px
    // to match the existing About link rhythm.
    return `<a href="${href}" class="utilnav-link" data-mega="${dataMega}"${extraAttrs} style="height:96px;">\n        ${inner.trim()}\n      </a>`;
  });

  // ---- Step 2: inject Home link before the first nav button/anchor.
  // After step 1, the first trigger is the methodology anchor. Look
  // for either the old button form (if step 1 skipped) or the new
  // anchor form. Inject Home right before it inside the <nav>.
  if (!next.includes('href="/" class="utilnav-link"') ||
      !next.match(/<a href="\/" class="utilnav-link"[^>]*>\s*Home\s*<\/a>/)) {
    // Find the first methodology trigger (anchor preferred, fallback button)
    const triggerIdx = next.search(/<a href="\/methodology\/" class="utilnav-link" data-mega="methodology"/);
    if (triggerIdx !== -1) {
      // Walk back to the start of the indent on that line
      let lineStart = next.lastIndexOf('\n', triggerIdx) + 1;
      const indent = next.slice(lineStart, triggerIdx);
      const homeLine = `${indent}<a href="/" class="utilnav-link" style="height:96px;">Home</a>\n${indent}`;
      next = next.slice(0, lineStart) + homeLine + next.slice(lineStart);
      didInjectHome = true;
    }
  }

  if (!didConvert && !didInjectHome) {
    already++;
    continue;
  }

  if (next === src) {
    skipped++;
    continue;
  }

  await writeFile(file, next, 'utf8');
  updated++;
  console.log('UPDATED', rel, didConvert ? '[buttons]' : '', didInjectHome ? '[home]' : '');
}

console.log(`\nDone. updated=${updated}, already-converted=${already}, skipped=${skipped}`);
