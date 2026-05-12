#!/usr/bin/env node
// One-shot sweep: surface the new /ai-frontiers/ page in the
// Insights mega-menu's Featured group across every page that has
// the menu, without cluttering the top nav.
//
// Inserts the AI Frontiers link as the FIRST item in the Featured
// column (immediately above AI Decision Questions).
//
// Idempotent — re-running it is a no-op once injected.
//
// Run from repo root: node scripts/_ai-frontiers-featured-link.mjs

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

// Anchor on the existing AI Decision Questions line in the Featured
// group. Inserts the AI Frontiers entry right before it, preserving
// the page's relative position and the indentation of the surrounding
// markup.
const NEEDLE = '<a href="/ai-decision-questions/" class="mega-link">AI Decision Questions<span class="mega-link-dek">For executives funding AI</span></a>';
const NEW_LINE = '<a href="/ai-frontiers/" class="mega-link">AI Frontiers<span class="mega-link-dek">Beyond the obvious use cases</span></a>\n          ';

const files = await walk(ROOT);
let updated = 0;
let already = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep)) continue;

  const src = await readFile(file, 'utf8');
  if (!src.includes(NEEDLE)) continue;

  if (src.includes('href="/ai-frontiers/"')) {
    already++;
    continue;
  }

  const next = src.replace(NEEDLE, NEW_LINE + NEEDLE);
  await writeFile(file, next, 'utf8');
  updated++;
  console.log('UPDATED', rel);
}

console.log(`\nDone. updated=${updated}, already=${already}`);
