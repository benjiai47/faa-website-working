#!/usr/bin/env node
// One-shot sweep: replace every user-facing occurrence of the
// "FAA" short name with the full "Foundation AI Advisory" across
// all HTML files. Only the uppercase abbreviation is replaced —
// the lowercase `faa` token is reserved exclusively for CSS
// identifiers (--faa-navy, --faa-gray-100, .container-faa, etc.)
// and changing those would break the entire site.
//
// Safety rules:
// 1. Match \bFAA\b only (case-sensitive, all caps, word-bounded).
//    Lowercase `faa` inside CSS class/variable names is NEVER
//    touched.
// 2. Skip text inside HTML comments (<!-- ... -->) so internal
//    developer documentation stays unchanged.
// 3. Skip text inside <style> blocks — defensive even though none
//    of the HTML pages currently inline styles that contain "FAA".
//
// Run from repo root:
//   node scripts/_faa-to-full-name-sweep.mjs

import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const FROM = /\bFAA\b/g;
const TO = 'Foundation AI Advisory';

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

// Split source into segments where odd-indexed segments are
// protected regions (comments or <style> blocks) that should NOT
// be touched. Even-indexed segments are normal HTML where the
// replacement applies.
function replaceOutsideProtected(src) {
  const PROTECT = /(<!--[\s\S]*?-->|<style\b[\s\S]*?<\/style>)/g;
  const parts = src.split(PROTECT);
  return parts.map((segment, i) => {
    if (i % 2 === 1) return segment; // protected — leave alone
    return segment.replace(FROM, TO);
  }).join('');
}

const files = await walk(ROOT);
let updated = 0;
let skipped = 0;
let totalReplacements = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep)) continue;

  const src = await readFile(file, 'utf8');
  const next = replaceOutsideProtected(src);
  if (next === src) {
    skipped++;
    continue;
  }
  // Count actual replacements made (rough — counts matches in the
  // OLD source minus matches that were inside protected blocks).
  const oldMatches = (src.match(FROM) || []).length;
  const newMatches = (next.match(FROM) || []).length;
  const made = oldMatches - newMatches;
  totalReplacements += made;
  await writeFile(file, next, 'utf8');
  updated++;
  console.log(`UPDATED ${rel} (${made} replacement${made === 1 ? '' : 's'})`);
}

console.log(`\nDone. updated=${updated}, skipped=${skipped}, total replacements=${totalReplacements}`);
