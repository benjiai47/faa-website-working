// One-shot: install the new Executive Answer section on foundation.html
// just below the hero and above "What We See in the Field". Replace the
// existing 3-Q&A bottom Common Questions block (and its FAQPage schema)
// with a single 5-Q&A FAQPage on the new top section.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

const file = 'foundation.html';
let html = fs.readFileSync(file, 'utf8');

// =========================================================================
// 1. Visible markup
// =========================================================================
const newSection = `
<!-- ============================================================= -->
<!-- EXECUTIVE ANSWER (AEO)                                        -->
<!-- ============================================================= -->
<section class="bg-white">
  <div class="container-faa section-y">
    <div class="methodology-intro-grid">
      <div class="methodology-intro-text">
        <div class="eyebrow" style="color: var(--faa-navy);">Executive Answer</div>
        <h2 class="h2 mt-3">Data Curation &amp; Governance Makes AI Trustworthy</h2>
        <p class="body-lg mt-5" style="color: var(--faa-gray-600);">
          Before AI can improve a business, the business has to know which data it trusts, who owns it, how it is defined, and where it breaks. Data Curation &amp; Governance is the work of turning scattered operational data into a structured, governed, and usable foundation for decision-making, reporting, workflow automation, and AI.
        </p>
        <p class="body-lg mt-5" style="color: var(--faa-gray-600);">
          For mid-market operators, the problem is rarely a total lack of data. The problem is that ERP data, finance reports, spreadsheets, field systems, CRM records, and operational workarounds often tell different versions of the truth. AI will not resolve those conflicts on its own. It will inherit them, accelerate them, and make them harder to trace.
        </p>
        <p class="body-lg mt-5" style="color: var(--faa-gray-600);">
          FAA starts here because trustworthy AI depends on trustworthy inputs. Clean data alone is not enough. The data must be governed, defined, accessible, and tied to clear business ownership.
        </p>
        <a href="mailto:blueprint@foundationaiadvisory.com?subject=Business%20Systems%20Assessment%20Inquiry" class="read-link" style="display: inline-block; margin-top: 28px; font-size: 15px; font-weight: 600;">Assess your data foundation&nbsp;<span class="arrow">&rarr;</span></a>
      </div>

      <aside class="methodology-aeo" aria-label="What this answers about Data Curation and Governance">
        <div class="eyebrow" style="color: var(--faa-navy);">What This Answers</div>
        <dl class="aeo-faq" style="margin-top: 20px;">
          <div class="aeo-faq-item">
            <dt>What is Data Curation &amp; Governance?</dt>
            <dd>Data Curation &amp; Governance is the process of cleaning, structuring, defining, owning, and controlling business data so it can be trusted for reporting, workflows, decision-making, and AI.</dd>
          </div>
          <div class="aeo-faq-item">
            <dt>Why does FAA start with data before AI?</dt>
            <dd>AI depends on the quality of the information underneath it. If definitions conflict, ownership is unclear, or source systems disagree, AI will amplify the problem instead of solving it.</dd>
          </div>
          <div class="aeo-faq-item">
            <dt>Who should own data governance?</dt>
            <dd>Ownership should sit with the business function that understands the data and its operational impact, supported by IT for access, architecture, security, and system controls.</dd>
          </div>
          <div class="aeo-faq-item">
            <dt>What business outcomes does better data governance improve?</dt>
            <dd>Better data governance improves operational visibility, cycle time, cash flow, margin, risk exposure, and throughput by reducing reconciliation work, reporting conflict, rework, and decision delays.</dd>
          </div>
          <div class="aeo-faq-item">
            <dt>How does data governance prepare a company for AI?</dt>
            <dd>It gives AI systems reliable inputs, clear definitions, traceable sources, access rules, and accountable owners, which makes outputs easier to validate, monitor, and use in real operations.</dd>
          </div>
        </dl>
        <p class="aeo-closing">The goal is not cleaner data for its own sake. The goal is a business foundation strong enough to support automation, analytics, and AI without scaling confusion.</p>
      </aside>
    </div>
  </div>
</section>

`;

// Insert between hero close and the THE PROBLEM comment block.
const insertAnchor = '<!-- ============================================================= -->\n<!-- 1. THE PROBLEM                                                -->';
if (!html.includes(insertAnchor)) throw new Error('insert anchor not found');
html = html.replace(insertAnchor, newSection.trimEnd() + '\n\n' + insertAnchor);

// =========================================================================
// 2. Remove the bottom "Common Questions" block (5-Q&A top section
//    supersedes it; keeping both would create duplicate FAQ noise on a
//    single page).
// =========================================================================
const bottomFaqRe = /\n*<!-- =+ -->\n<!-- COMMON QUESTIONS\s+-->\n<!-- =+ -->\n<section class="bg-white border-t"[\s\S]*?<\/section>\n/;
if (!bottomFaqRe.test(html)) throw new Error('bottom Common Questions block not found');
html = html.replace(bottomFaqRe, '\n');

// =========================================================================
// 3. Replace the existing 3-Q&A FAQPage JSON-LD with the new 5-Q&A version.
// =========================================================================
const newSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Data Curation & Governance?',
      acceptedAnswer: { '@type': 'Answer', text: 'Data Curation & Governance is the process of cleaning, structuring, defining, owning, and controlling business data so it can be trusted for reporting, workflows, decision-making, and AI.' },
    },
    {
      '@type': 'Question',
      name: 'Why does FAA start with data before AI?',
      acceptedAnswer: { '@type': 'Answer', text: 'AI depends on the quality of the information underneath it. If definitions conflict, ownership is unclear, or source systems disagree, AI will amplify the problem instead of solving it.' },
    },
    {
      '@type': 'Question',
      name: 'Who should own data governance?',
      acceptedAnswer: { '@type': 'Answer', text: 'Ownership should sit with the business function that understands the data and its operational impact, supported by IT for access, architecture, security, and system controls.' },
    },
    {
      '@type': 'Question',
      name: 'What business outcomes does better data governance improve?',
      acceptedAnswer: { '@type': 'Answer', text: 'Better data governance improves operational visibility, cycle time, cash flow, margin, risk exposure, and throughput by reducing reconciliation work, reporting conflict, rework, and decision delays.' },
    },
    {
      '@type': 'Question',
      name: 'How does data governance prepare a company for AI?',
      acceptedAnswer: { '@type': 'Answer', text: 'It gives AI systems reliable inputs, clear definitions, traceable sources, access rules, and accountable owners, which makes outputs easier to validate, monitor, and use in real operations.' },
    },
  ],
};

const oldSchemaRe = /<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?<\/script>/;
const newSchemaTag = '<script type="application/ld+json">' + JSON.stringify(newSchema) + '</script>';
if (!oldSchemaRe.test(html)) throw new Error('existing FAQPage schema not found');
html = html.replace(oldSchemaRe, newSchemaTag);

fs.writeFileSync(file, html);
console.log('  foundation.html: Executive Answer section installed; bottom Common Questions removed; FAQPage schema replaced (5 Q&A).');
