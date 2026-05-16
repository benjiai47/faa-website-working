#!/usr/bin/env node
// One-shot sweep: add the LinkedIn link + icon to every footer
// that's missing it. The canonical block matches the one already
// live in index.html (line 804–809) and gets inserted right after
// the existing Contact link inside <nav aria-label="Legal">.
//
// Idempotent: skips pages that already contain
//   class="footer-social-link"
//
// Run from repo root:
//   node scripts/_footer-linkedin-sweep.mjs

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

// Match the existing Contact link followed by </nav> (the legal nav
// inside <footer>). The Contact <a> is the last link in the footer
// nav on pages that don't have LinkedIn — anchor on that boundary
// to insert the LinkedIn block.
const RE = /(<a href="\/contact\/" style="color: var\(--faa-white\); font-size: 13px;" class="hover:underline">Contact<\/a>)(\s*<\/nav>)/;

const LINKEDIN = `
        <a href="https://www.linkedin.com/company/foundation-ai-advisory" class="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="Foundation AI Advisory on LinkedIn" style="font-size: 13px;">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.94 8.98H3.72v10.54h3.22V8.98zM5.33 7.52c1.03 0 1.86-.84 1.86-1.86S6.36 3.8 5.33 3.8s-1.86.84-1.86 1.86.83 1.86 1.86 1.86zM20.53 13.56c0-3.03-1.62-4.44-3.78-4.44-1.74 0-2.52.96-2.95 1.63V8.98h-3.08c.04.99 0 10.54 0 10.54h3.21v-5.89c0-.31.02-.63.12-.85.26-.63.86-1.28 1.86-1.28 1.31 0 1.84.99 1.84 2.45v5.57h3.22l.01-5.96z"/>
          </svg>
          <span>LinkedIn</span>
        </a>`;

const files = await walk(ROOT);
let updated = 0;
let skipped = 0;
let notMatched = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep)) continue;

  const src = await readFile(file, 'utf8');
  if (src.includes('class="footer-social-link"')) {
    skipped++;
    continue;
  }
  if (!RE.test(src)) {
    notMatched++;
    console.log('NO MATCH', rel);
    continue;
  }
  const next = src.replace(RE, `$1${LINKEDIN}$2`);
  await writeFile(file, next, 'utf8');
  updated++;
  console.log('UPDATED', rel);
}

console.log(`\nDone. updated=${updated}, already-had-linkedin=${skipped}, no-match=${notMatched}`);
