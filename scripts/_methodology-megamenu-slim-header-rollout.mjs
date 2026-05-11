// Second pass: bring the slim-header pages (the 13 nested insight
// articles plus a couple of others) up to the same header structure
// as the rest of the site — replace the entire flat nav with the
// new mega-menu nav, and inject all three mega-menu panels
// (methodology, industries, insights) before </header>.
//
// On these pages, /insights/ is the active section, so the Insights
// button (not the Methodology button) carries aria-current="page".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

// All slim-header pages identified by the first sweep's no-hook list.
const FILES = [
  'insight/index.html',
  'insights/automating-a-broken-process-scales-the-problem/index.html',
  'insights/data-governance-non-enterprise-teams/index.html',
  'insights/designing-for-human-in-the-loop-before-you-design-for-ai/index.html',
  'insights/how-work-actually-gets-done-vs-how-its-documented/index.html',
  'insights/master-data-is-the-bottleneck-nobody-wants-to-own/index.html',
  'insights/master-data-quality-silent-killer-ai-projects/index.html',
  'insights/mid-market-case-for-platform-agnostic/index.html',
  'insights/the-7-problem-why-your-ai-ready-data-probably-isnt/index.html',
  'insights/the-frontier-gap-different-results-from-same-ai-tools/index.html',
  'insights/where-agents-earn-their-keep/index.html',
  'insights/why-applied-ai-fails-without-clean-data/index.html',
  'insights/your-workflows-werent-built-for-agents/index.html',
  'insights-prompt-precision-context-engineering-operators/index.html',
];

const OLD_NAV = `    <nav class="hidden xl:flex items-center gap-6 h-full mx-6" aria-label="Primary">
      <a href="/foundation/" class="utilnav-link" style="height:96px;">Data Curation &amp; Governance</a>
      <a href="/operations/" class="utilnav-link" style="height:96px;">Workflow Optimization</a>
      <a href="/agentic-ai/" class="utilnav-link" style="height:96px;">AI Design &amp; Implementation</a>
      <a href="/industries/" class="utilnav-link" style="height:96px;">Where We Work</a>
      <a href="/insights/" class="utilnav-link is-active" style="height:96px;" aria-current="page">Insights</a>
      <a href="/about/" class="utilnav-link" style="height:96px;">About</a>
    </nav>`;

const NEW_NAV = `    <nav class="hidden xl:flex items-center gap-6 h-full mx-6" aria-label="Primary">
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

// The three mega-menu panels inserted before </header>.
const MEGA_PANELS = `
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

let touched = 0, already = 0, nohook = 0;
for (const f of FILES) {
  if (!fs.existsSync(f)) { console.warn('missing:', f); continue; }
  const before = fs.readFileSync(f, 'utf8');

  if (before.includes('id="mega-methodology"')) { already++; continue; }
  if (!before.includes(OLD_NAV)) {
    console.warn('nav anchor missing:', f);
    nohook++;
    continue;
  }

  // 1. Replace the slim nav with the new mega-menu nav.
  let after = before.replace(OLD_NAV, NEW_NAV);

  // 2. Inject the three mega-menu panels before </header>.
  if (after.includes('</header>')) {
    after = after.replace('</header>', MEGA_PANELS + '</header>');
  } else {
    console.warn('no </header> anchor:', f);
    nohook++;
    continue;
  }

  fs.writeFileSync(f, after);
  touched++;
  console.log('updated:', f);
}
console.log('Done. Touched:', touched, 'Already:', already, 'No-hook:', nohook);
