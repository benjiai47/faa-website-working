// Final pass: handle the remaining 8 pages with flat 6-anchor nav
// using regex so whitespace variants don't matter (some pages have
// the whole nav on one line, some have trailing blank lines).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

const FILES = [
  'insight/index.html',
  'insights-foundations-ai-architecture/index.html',
  'insights-foundations-ai-governance/index.html',
  'insights-foundations-ai-roi-sequencing/index.html',
  'insights-foundations-applied-ai-series/index.html',
  'insights-foundations-data-constraint/index.html',
  'insights-foundations-process-before-ai/index.html',
  'insights-prompt-precision-context-engineering-operators/index.html',
];

// Regex: <nav class="hidden xl:flex...">  ... <a href="/about/">About</a>  </nav>
// Match anything in between, non-greedy, allowing any whitespace.
const NAV_RE = /<nav class="hidden xl:flex items-center gap-6 h-full mx-6" aria-label="Primary">[\s\S]*?<a href="\/about\/" class="utilnav-link" style="height:96px;">About<\/a>\s*<\/nav>/;

const NEW_NAV = `<nav class="hidden xl:flex items-center gap-6 h-full mx-6" aria-label="Primary">
      <button type="button" class="utilnav-link" data-mega="methodology" aria-expanded="false" aria-controls="mega-methodology" aria-haspopup="true">
        Methodology
        <svg class="caret" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>
      </button>
      <button type="button" class="utilnav-link" data-mega="industries" aria-expanded="false" aria-controls="mega-industries" aria-haspopup="true">
        Where We Work
        <svg class="caret" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>
      </button>
      <button type="button" class="utilnav-link" data-mega="insights" aria-expanded="false" aria-controls="mega-insights" aria-haspopup="true" aria-current="page">
        Insights
        <svg class="caret" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>
      </button>
      <a href="/about/" class="utilnav-link" style="height:96px;">About</a>
    </nav>`;

const MEGA_PANELS = `
  <div id="mega-methodology" class="mega-menu" role="region" aria-label="Methodology">
    <div class="mega-menu-inner">
      <div class="mega-method-layout">
        <div class="mega-method-core">
          <h4 class="mega-group-heading">Core Methodology</h4>
          <div class="mega-method-cards">
            <a href="/foundation/" class="mega-method-card"><span class="mega-method-num">01</span><span class="mega-method-title">Data Curation<br />&amp; Governance</span><span class="mega-method-dek">Data before anything else</span></a>
            <a href="/operations/" class="mega-method-card"><span class="mega-method-num">02</span><span class="mega-method-title">Workflow<br />Optimization</span><span class="mega-method-dek">Fix process before applying AI</span></a>
            <a href="/agentic-ai/" class="mega-method-card"><span class="mega-method-num">03</span><span class="mega-method-title">AI Design<br />&amp; Implementation</span><span class="mega-method-dek">Designed around measurable outcomes</span></a>
          </div>
        </div>
        <div class="mega-method-enablement">
          <h4 class="mega-group-heading">Enablement</h4>
          <a href="/ai-training-workforce-development/" class="mega-method-card mega-method-card--enablement"><span class="mega-method-title">AI Training<br />&amp; Workforce Development</span><span class="mega-method-dek">Practical capability before scaling AI</span></a>
        </div>
      </div>
    </div>
  </div>
  <div id="mega-industries" class="mega-menu" role="region" aria-label="Industries">
    <div class="mega-menu-inner">
      <h4><a href="/industries/">Industries</a></h4>
      <div class="mega-grid">
        <a href="/industry-manufacturing-industrial-production/" class="mega-link">Manufacturing &amp; Industrial Production<span class="mega-link-dek">Throughput, yield, plant floor</span></a>
        <a href="/industry-engineering-construction-infrastructure/" class="mega-link">Engineering, Construction &amp; Infrastructure (ECI)<span class="mega-link-dek">Field-to-office, project controls</span></a>
        <a href="/industry-transportation-logistics/" class="mega-link">Transportation &amp; Logistics<span class="mega-link-dek">Forecasting, dispatch, freight</span></a>
        <a href="/industry-energy-natural-resources/" class="mega-link">Energy &amp; Natural Resources<span class="mega-link-dek">Asset reliability, regulatory trails</span></a>
        <a href="/industry-distribution-wholesale/" class="mega-link">Distribution &amp; Wholesale<span class="mega-link-dek">Inventory, demand, exception flow</span></a>
        <a href="/industry-industrial-equipment/" class="mega-link">Industrial Equipment<span class="mega-link-dek">Aftermarket, parts, service</span></a>
        <a href="/industry-specialty-manufacturing/" class="mega-link">Specialty Manufacturing<span class="mega-link-dek">High-mix, low-volume reality</span></a>
        <a href="/industry-professional-technical-services/" class="mega-link">Professional &amp; Technical Services<span class="mega-link-dek">Knowledge work, delivery systems</span></a>
        <a href="/industry-financial-services-banking/" class="mega-link">Financial Services &amp; Banking<span class="mega-link-dek">Controls, reporting, risk</span></a>
        <a href="/industry-ai-data-it-systems/" class="mega-link">AI, Data &amp; IT Systems<span class="mega-link-dek">System owners, data teams</span></a>
      </div>
    </div>
  </div>
  <div id="mega-insights" class="mega-menu" role="region" aria-label="Insights">
    <div class="mega-menu-inner">
      <div class="mega-grid-3">
        <div>
          <h4 class="mega-group-heading">By Pillar</h4>
          <a href="/foundation/" class="mega-link">Data Curation &amp; Governance<span class="mega-link-dek">Data before anything else</span></a>
          <a href="/operations/" class="mega-link">Workflow Optimization<span class="mega-link-dek">Fix process, then apply AI</span></a>
          <a href="/agentic-ai/" class="mega-link">AI Design &amp; Implementation<span class="mega-link-dek">Designed around measurable outcomes</span></a>
        </div>
        <div>
          <h4 class="mega-group-heading">By Format</h4>
          <a href="/insights/?format=article" class="mega-link">Articles<span class="mega-link-dek">Long-form analysis</span></a>
          <a href="/insights/?format=brief" class="mega-link">Briefs<span class="mega-link-dek">Short-form analyses</span></a>
          <a href="/insights/?format=field-note" class="mega-link">Field Notes<span class="mega-link-dek">From the engagement floor</span></a>
          <a href="/insights/?format=infographic" class="mega-link">Infographics<span class="mega-link-dek">Visual operating explainers</span></a>
          <a href="/insights/?format=podcast" class="mega-link">Podcast<span class="mega-link-dek">Operator conversations</span></a>
          <a href="/insights/?format=video" class="mega-link">Video<span class="mega-link-dek">Working sessions</span></a>
        </div>
        <div>
          <h4 class="mega-group-heading">Featured</h4>
          <a href="/ai-decision-questions/" class="mega-link">AI Decision Questions<span class="mega-link-dek">For executives funding AI</span></a>
          <a href="/insights/#foundations-series" class="mega-link">Foundations Series<span class="mega-link-dek">Five-part field series</span></a>
          <a href="/insights/" class="mega-link">All Insights<span class="mega-link-dek">The full hub</span></a>
          <a href="/insights/#subscribe" class="mega-link">Subscribe<span class="mega-link-dek">Get the running record</span></a>
        </div>
      </div>
    </div>
  </div>
`;

let touched = 0, nohook = 0;
for (const f of FILES) {
  if (!fs.existsSync(f)) { console.warn('missing:', f); continue; }
  const before = fs.readFileSync(f, 'utf8');
  if (before.includes('id="mega-methodology"')) { console.log('already done:', f); continue; }
  if (!NAV_RE.test(before)) { nohook++; console.warn('nav regex no match:', f); continue; }
  let after = before.replace(NAV_RE, NEW_NAV);
  after = after.replace('</header>', MEGA_PANELS + '</header>');
  fs.writeFileSync(f, after);
  touched++;
  console.log('updated:', f);
}
console.log('Done. Touched:', touched, 'No-hook:', nohook);
