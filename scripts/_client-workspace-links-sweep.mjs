#!/usr/bin/env node
// One-shot sweep: add the Client Workspace utility access link to
// every page's header (CTA wrapper, immediately before the BSA
// button) and to every page's footer legal nav (immediately before
// the Privacy link).
//
// Idempotent — re-running it is a no-op once injected.
//
// Run from repo root: node scripts/_client-workspace-links-sweep.mjs

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

// Header CTA wrapper — the marker is the existing BSA CTA button.
// Two known forms in the repo: mailto-based and link-based. Match
// both and insert the utility link immediately before either.
const HEADER_LOCK_SVG = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.2" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 7V5a2.5 2.5 0 1 1 5 0v2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
const HEADER_LINK = `<a href="/client-workspace/" class="utility-access-link">${HEADER_LOCK_SVG}<span>Client Workspace</span></a>\n      `;

const HEADER_TARGETS = [
  '<a href="mailto:blueprint@foundationaiadvisory.com?subject=Business%20Systems%20Assessment%20Inquiry" class="btn btn-primary hidden sm:inline-flex">Business Systems Assessment</a>',
  '<a href="/business-systems-assessment/" class="btn btn-primary hidden sm:inline-flex">Business Systems Assessment</a>',
];

// Footer legal nav — inject Client Workspace immediately before
// the existing Privacy link.
const FOOTER_TARGET = '<a href="/privacy-policy/" style="color: var(--faa-white); font-size: 13px;" class="hover:underline">Privacy</a>';
const FOOTER_LINK = '<a href="/client-workspace/" style="color: var(--faa-white); font-size: 13px;" class="hover:underline">Client Workspace</a>\n        ';

const files = await walk(ROOT);
let headersUpdated = 0;
let footersUpdated = 0;
let alreadyHeader = 0;
let alreadyFooter = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep)) continue;

  let src = await readFile(file, 'utf8');
  const before = src;

  // Header injection
  const alreadyInHeader = src.includes('class="utility-access-link"');
  if (alreadyInHeader) {
    alreadyHeader++;
  } else {
    for (const target of HEADER_TARGETS) {
      if (src.includes(target)) {
        src = src.replace(target, HEADER_LINK + target);
        headersUpdated++;
        break;
      }
    }
  }

  // Footer injection — only the legal nav inside <footer>, anchored
  // on the Privacy link. Skip if already injected.
  const alreadyInFooter = /<a href="\/client-workspace\/"[^>]*>Client Workspace<\/a>[\s\S]{0,80}Privacy/.test(src);
  if (alreadyInFooter) {
    alreadyFooter++;
  } else if (src.includes(FOOTER_TARGET)) {
    src = src.replace(FOOTER_TARGET, FOOTER_LINK + FOOTER_TARGET);
    footersUpdated++;
  }

  if (src !== before) {
    await writeFile(file, src, 'utf8');
    console.log('UPDATED', rel);
  }
}

console.log(`\nDone.`);
console.log(`  header injections:  ${headersUpdated} (already had link: ${alreadyHeader})`);
console.log(`  footer injections:  ${footersUpdated} (already had link: ${alreadyFooter})`);
