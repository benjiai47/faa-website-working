#!/usr/bin/env node
// One-shot sweep:
// (1) Rename the visible nav label "AI Advisory" -> "AI Perspectives"
//     on the trigger anchor that opens the Insights mega-menu.
// (2) Rebuild the entire <div id="mega-insights"> block into the
//     new structure: positioning intro line + 3-column grid where
//     Featured is the shaded anchor on the left, By Pillar in the
//     middle, By Format secondary on the right. Route stays
//     /insights/.
//
// Idempotent — re-running is a no-op once converted.
//
// Run from repo root:
//   node scripts/_ai-perspectives-mega-menu-rebuild.mjs

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

// New mega-insights block (label + structure + microcopy per spec)
const NEW_BLOCK = `<div id="mega-insights" class="mega-menu" role="region" aria-label="AI Perspectives">
    <div class="mega-menu-inner">
      <p class="mega-insights-intro">Practical AI perspectives for executives improving data, workflows, and operating systems before automation.</p>
      <div class="mega-grid-3">
        <div class="mega-insights-featured">
          <h4 class="mega-group-heading">Featured</h4>
          <a href="/ai-frontiers/" class="mega-link">AI Frontiers<span class="mega-link-dek">Beyond the obvious use cases</span></a>
          <a href="/insights/#foundations-series" class="mega-link">Foundations Series<span class="mega-link-dek">Five-part field series</span></a>
          <a href="/insights/#subscribe" class="mega-link">Subscribe<span class="mega-link-dek">Get the running record</span></a>
          <a href="/insights/" class="mega-link">All AI Perspectives<span class="mega-link-dek">The full hub</span></a>
        </div>
        <div>
          <h4 class="mega-group-heading">By Pillar</h4>
          <a href="/foundation/" class="mega-link">Data Curation &amp; Governance<span class="mega-link-dek">Fix the records AI depends on</span></a>
          <a href="/operations/" class="mega-link">Workflow Optimization<span class="mega-link-dek">Remove friction before automation</span></a>
          <a href="/agentic-ai/" class="mega-link">AI Design &amp; Implementation<span class="mega-link-dek">Deploy AI with ownership and controls</span></a>
        </div>
        <div class="mega-insights-format">
          <h4 class="mega-group-heading">By Format</h4>
          <a href="/insights/?format=article" class="mega-link">Articles<span class="mega-link-dek">Long-form analysis</span></a>
          <a href="/insights/?format=brief" class="mega-link">Briefs<span class="mega-link-dek">Short-form executive reads</span></a>
          <a href="/insights/?format=field-note" class="mega-link">Field Notes<span class="mega-link-dek">Lessons from the engagement floor</span></a>
          <a href="/insights/?format=infographic" class="mega-link">Infographics<span class="mega-link-dek">Visual operating explainers</span></a>
          <a href="/insights/?format=podcast" class="mega-link">Podcast<span class="mega-link-dek">Operator conversations</span></a>
          <a href="/insights/?format=video" class="mega-link">Video<span class="mega-link-dek">Working sessions</span></a>
        </div>
      </div>
    </div>
  </div>`;

// Match the full mega-insights block end-to-end. Anchor on the open
// tag with id="mega-insights" and the existing aria-label string,
// then match lazily through the third closing </div> that exits
// the menu wrapper.
const INSIGHTS_BLOCK_RE =
  /<div id="mega-insights"[^>]*>\s*<div class="mega-menu-inner">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

// Match the trigger anchor's visible label. The trigger has the
// data-mega="insights" attribute; the label text "AI Advisory"
// (or older "Insights") sits between the opening tag and the SVG
// caret. Capture surrounding whitespace so we preserve indentation.
const TRIGGER_LABEL_RE =
  /(<a[^>]*data-mega="insights"[^>]*>\s*)(AI Advisory|Insights)(\s*<svg)/;

const files = await walk(ROOT);
let labelRenamed = 0;
let blockRebuilt = 0;
let alreadyLabel = 0;
let alreadyBlock = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep)) continue;

  let src = await readFile(file, 'utf8');
  const before = src;

  // Step 1: rename trigger label
  if (TRIGGER_LABEL_RE.test(src)) {
    src = src.replace(TRIGGER_LABEL_RE, '$1AI Perspectives$3');
    labelRenamed++;
  } else if (src.includes('data-mega="insights"') && src.includes('AI Perspectives')) {
    alreadyLabel++;
  }

  // Step 2: rebuild mega-insights block
  if (src.includes('mega-insights-featured') || src.includes('mega-insights-intro')) {
    alreadyBlock++;
  } else if (INSIGHTS_BLOCK_RE.test(src)) {
    src = src.replace(INSIGHTS_BLOCK_RE, NEW_BLOCK);
    blockRebuilt++;
  }

  if (src !== before) {
    await writeFile(file, src, 'utf8');
    console.log('UPDATED', rel);
  }
}

console.log(`\nDone.`);
console.log(`  trigger labels renamed: ${labelRenamed} (already done: ${alreadyLabel})`);
console.log(`  mega-insights blocks rebuilt: ${blockRebuilt} (already done: ${alreadyBlock})`);
