// Throwaway: consolidate the three top-level methodology nav links
// (Data Curation & Governance / Workflow Optimization / AI Design &
// Implementation) into a single "Methodology" mega-menu trigger, and
// inject the new mega-methodology panel containing the three pillars
// plus the new AI Training & Workforce Development enablement card.
//
// Touches every page that carries the standard FAA header. Skip the
// new AI Training page (already authored inline with the new nav) and
// any legacy .html redirect shims (no header to update).
//
// Adds aria-current="page" to the Methodology button on the four
// methodology destinations: /foundation/, /operations/, /agentic-ai/,
// /ai-training-workforce-development/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.posix.join(dir.replaceAll('\\', '/'), e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'squoosh-queue', 'squoosh-out', 'assets', 'content', 'scripts'].includes(e.name)) continue;
      walk(p, out);
    } else if (e.name === 'index.html') {
      out.push(p);
    }
  }
  return out;
}

// Pages within the methodology section — get aria-current="page" on
// the Methodology button.
const METHODOLOGY_PAGES = new Set([
  'foundation/index.html',
  'operations/index.html',
  'agentic-ai/index.html',
  'ai-training-workforce-development/index.html',
]);

// The three existing top-level methodology links + their plausible
// aria-current variants. We match the WHOLE block (3 anchors) and
// replace with a single Methodology button.
function buildOldBlock(currentSlug) {
  // currentSlug is /foundation/, /operations/, /agentic-ai/, or null
  const ac = (slug) => slug === currentSlug ? ' aria-current="page"' : '';
  return [
    `      <a href="/foundation/" class="utilnav-link" style="height:96px;"${ac('/foundation/')}>Data Curation &amp; Governance</a>`,
    `      <a href="/operations/" class="utilnav-link" style="height:96px;"${ac('/operations/')}>Workflow Optimization</a>`,
    `      <a href="/agentic-ai/" class="utilnav-link" style="height:96px;"${ac('/agentic-ai/')}>AI Design &amp; Implementation</a>`,
  ].join('\n');
}

function buildNewButton(pageFile) {
  // Add aria-current to the Methodology button if the page belongs to
  // the methodology section.
  const norm = pageFile.replace(/\\/g, '/').replace(/^\.\//, '');
  const isMethodologyPage = METHODOLOGY_PAGES.has(norm);
  const ac = isMethodologyPage ? ' aria-current="page"' : '';
  return `      <button type="button" class="utilnav-link" data-mega="methodology" aria-expanded="false" aria-controls="mega-methodology" aria-haspopup="true"${ac}>
        Methodology
        <svg class="caret" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>
      </button>`;
}

const NEW_MEGA_BLOCK = `
  <div id="mega-methodology" class="mega-menu" role="region" aria-label="Methodology">
    <div class="mega-menu-inner">
      <div class="mega-method-layout">
        <div class="mega-method-core">
          <h4 class="mega-group-heading">Core Methodology</h4>
          <div class="mega-method-cards">
            <a href="/foundation/" class="mega-method-card">
              <span class="mega-method-num">01</span>
              <span class="mega-method-title">Data Curation<br />&amp; Governance</span>
              <span class="mega-method-dek">Data before anything else</span>
            </a>
            <a href="/operations/" class="mega-method-card">
              <span class="mega-method-num">02</span>
              <span class="mega-method-title">Workflow<br />Optimization</span>
              <span class="mega-method-dek">Fix process before applying AI</span>
            </a>
            <a href="/agentic-ai/" class="mega-method-card">
              <span class="mega-method-num">03</span>
              <span class="mega-method-title">AI Design<br />&amp; Implementation</span>
              <span class="mega-method-dek">Designed around measurable outcomes</span>
            </a>
          </div>
        </div>
        <div class="mega-method-enablement">
          <h4 class="mega-group-heading">Enablement</h4>
          <a href="/ai-training-workforce-development/" class="mega-method-card mega-method-card--enablement">
            <span class="mega-method-title">AI Training<br />&amp; Workforce Development</span>
            <span class="mega-method-dek">Practical capability before scaling AI</span>
          </a>
        </div>
      </div>
    </div>
  </div>
`;

// Anchor for inserting the new mega-methodology panel — just before
// the existing mega-industries panel, which is the consistent pattern
// across every page that carries the standard header.
const MEGA_ANCHOR = `  <div id="mega-industries" class="mega-menu" role="region" aria-label="Industries">`;

let touched = 0, already = 0, nohook = 0;
for (const f of walk('.')) {
  const norm = f.replace(/\\/g, '/').replace(/^\.\//, '');
  // The new AI Training page was authored inline with the new nav —
  // skip it.
  if (norm === 'ai-training-workforce-development/index.html') { already++; continue; }

  const before = fs.readFileSync(f, 'utf8');

  // Skip pages that already have the new methodology mega-menu
  // (idempotency safety).
  if (before.includes('id="mega-methodology"')) { already++; continue; }

  // Detect which methodology page (if any) this file is so we add
  // aria-current correctly. None = no aria-current.
  let currentSlug = null;
  if (norm === 'foundation/index.html') currentSlug = '/foundation/';
  else if (norm === 'operations/index.html') currentSlug = '/operations/';
  else if (norm === 'agentic-ai/index.html') currentSlug = '/agentic-ai/';

  const oldBlock = buildOldBlock(currentSlug);
  if (!before.includes(oldBlock)) { nohook++; continue; }

  // Replace the three links with a single button.
  let after = before.replace(oldBlock, buildNewButton(f));

  // Insert the new mega-methodology panel before the mega-industries
  // anchor.
  if (after.includes(MEGA_ANCHOR)) {
    after = after.replace(MEGA_ANCHOR, NEW_MEGA_BLOCK + '\n' + MEGA_ANCHOR);
  } else {
    console.warn('mega anchor missing:', f);
    nohook++;
    continue;
  }

  fs.writeFileSync(f, after);
  touched++;
  console.log('updated:', f);
}
console.log('Done. Touched:', touched, 'Already:', already, 'No-hook:', nohook);
