// All-five AEO recommendations for industry pages, in one pass.
//   1. Related Insights 3-card rail above the closing CTA section.
//   2. Service JSON-LD with industry-specific BusinessAudience.
//   3. Inline links inside the visible Q&A (1-2 per page).
//   4. Visible "Where AI Can Create Value" use-case list + ItemList JSON-LD.
//   5. Homepage ItemList JSON-LD enumerating the 10 industries (handled in
//      a separate function at the bottom of this script).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

const SITE = 'https://foundationaiadvisory.com';
const ORG_FULL = {
  '@type': 'Organization',
  name: 'Foundation AI Advisory',
  url: SITE + '/',
  logo: SITE + '/assets/global-header-logo-wordmark.png',
};

// =========================================================================
// Insight catalog (used to build per-industry Related Insights rails).
// =========================================================================
const insights = {
  'foundations-data':       { href: 'insights-foundations-data-constraint.html',                 img: 'assets/insights/foundations-series-01-data-foundation.webp',          alt: 'Layered data foundation underneath a structured operating system',                 pill: 'Part 1 of 5', kicker: 'Foundations Series',     title: 'Data: The Constraint You Can&rsquo;t Outrun',                                          dek: 'Why mid-market AI initiatives stall on data quality, ownership, and structure before any model is involved.' },
  'foundations-process':    { href: 'insights-foundations-process-before-ai.html',               img: 'assets/insights/foundations-series-process-pathway.webp',             alt: 'Illuminated path through a complex maze, representing process redesign',           pill: 'Part 2 of 5', kicker: 'Foundations Series',     title: 'Process: Fix the System Before You Accelerate It',                                     dek: 'Why workflow redesign has to come before automation, and what changes when it does.' },
  'foundations-architecture': { href: 'insights-foundations-ai-architecture.html',               img: 'assets/insights/foundations-series-03-system-architecture.webp',      alt: 'System-of-systems architecture with controlled integration boundaries',            pill: 'Part 3 of 5', kicker: 'Foundations Series',     title: 'Architecture: The System Behind the System',                                          dek: 'The operating layers behind reliable applied AI in mid-market environments.' },
  'foundations-roi':        { href: 'insights-foundations-ai-roi-sequencing.html',               img: 'assets/insights/foundations-series-04-roi-sequencing.webp',           alt: 'Sequenced AI use cases prioritized by readiness',                                  pill: 'Part 4 of 5', kicker: 'Foundations Series',     title: 'ROI Sequencing: Where AI Actually Creates Value',                                     dek: 'How to sequence AI investments around margin, throughput, cycle time, cash flow, risk, and operational visibility.' },
  'foundations-governance': { href: 'insights-foundations-ai-governance.html',                   img: 'assets/insights/foundations-series-05-governance-system.webp',        alt: 'Governance scaffolding around AI: ownership, controls, escalation, traceability',  pill: 'Part 5 of 5', kicker: 'Foundations Series',     title: 'Governance: The System That Holds It Together',                                       dek: 'Lightweight governance for mid-market AI: ownership, controls, escalation paths, and human oversight at the right points.' },
  'how-work':               { href: 'insights/how-work-actually-gets-done-vs-how-its-documented.html', img: 'assets/insights/human-in-the-loop-workflow-mapping.webp',         alt: 'Two professionals mapping decision workflows and process logic',                   pill: 'Brief',       kicker: 'Workflow Optimization',  title: 'How Work Actually Gets Done vs. How It&rsquo;s Documented',                            dek: 'The gap between documented process and operating reality is where AI most often fails.' },
  'automating-broken':      { href: 'insights/automating-a-broken-process-scales-the-problem.html', img: 'assets/insights/automating-broken-process-workflow-flow.webp',       alt: 'Abstract visualization of data flows curving across structured operating platforms', pill: 'Article',     kicker: 'Workflow Optimization',  title: 'Automating a Broken Process Scales the Problem',                                       dek: 'Automation amplifies whatever it inherits. A method for finding and fixing the workflow before AI extends it.' },
  'data-gov':               { href: 'insights/data-governance-non-enterprise-teams.html',         img: 'assets/insights/data-governance-non-enterprise-teams.webp',           alt: 'Infographic explaining lightweight data governance for non-enterprise teams',      pill: 'Infographic', kicker: 'Data Curation &amp; Governance', title: 'Data Governance for Non-Enterprise Teams',                                            dek: 'A lightweight, enforceable governance model for mid-market teams that need trusted data without enterprise data-office overhead.' },
  'where-agents':           { href: 'insights/where-agents-earn-their-keep.html',                 img: 'assets/insights/where-agents-earn-their-keep-card.webp',              alt: 'Abstract visualization of unstructured data flowing through filtering gates',      pill: 'Article',     kicker: 'AI Design &amp; Implementation', title: 'Where Agents Earn Their Keep &mdash; and Where They Don&rsquo;t',                     dek: 'A decision framework grounded in margin, throughput, cycle time, and risk. Built for operators making capital decisions, not for teams chasing demos.' },
  'platform-agnostic':      { href: 'insights/mid-market-case-for-platform-agnostic.html',        img: 'assets/insights/mid-market-case-for-platform-agnostic-card.webp',     alt: 'Abstract visualization of complex data flowing through layered architecture panels', pill: 'Article',   kicker: 'AI Design &amp; Implementation', title: 'The Mid-Market Case for Platform-Agnostic AI',                                        dek: 'Azure. OpenAI. Claude. Google. The right answer is the stack your business can run, govern, and scale &mdash; not the one a vendor is selling this quarter.' },
};

// =========================================================================
// Per-industry data blocks
// =========================================================================
const industries = [
  { file: 'industry-manufacturing-industrial-production.html',     name: 'Manufacturing & Industrial Production',
    audience: 'Manufacturing & Industrial Production Operators',
    serviceDesc: "FAA's mid-market AI advisory practice for manufacturing — improving data, workflows, and operating systems behind production, quality, inventory, scheduling, maintenance, finance, and reporting before AI is applied.",
    serviceOutput: 'AI tied to one of six manufacturing outcomes: margin, throughput, cycle time, schedule adherence, labor utilization, or inventory accuracy — applied on top of governed data and aligned workflows.',
    useCaseHeading: 'Where AI Can Create Value in Manufacturing',
    useCases: ['Demand and production forecasting','Production planning','Quality analysis','Maintenance planning','Inventory visibility','Scheduling','Margin analysis','Management reporting'],
    relatedKeys: ['foundations-process','how-work','automating-broken'],
    inlineLinks: [
      { old: '<dd>FAA helps manufacturing companies improve data, workflows, and operating systems before applying AI to production, quality, inventory, scheduling, maintenance, finance, and reporting problems.</dd>',
        new: '<dd>FAA helps manufacturing companies improve <a href="foundation.html">data</a>, <a href="operations.html">workflows</a>, and operating systems before applying AI to production, quality, inventory, scheduling, maintenance, finance, and reporting problems.</dd>' },
      { old: '<dd>Manufacturing AI should improve margin, throughput, cycle time, schedule adherence, labor utilization, quality visibility, inventory accuracy, and risk exposure.</dd>',
        new: '<dd>Manufacturing AI should improve <a href="business-systems-assessment.html">margin, throughput, cycle time, schedule adherence, labor utilization, quality visibility, inventory accuracy, and risk exposure</a>.</dd>' },
    ],
  },
  { file: 'industry-engineering-construction-infrastructure.html', name: 'Engineering, Construction & Infrastructure',
    audience: 'Engineering, Construction, and Infrastructure (ECI) Operators',
    serviceDesc: "FAA's mid-market AI advisory practice for engineering, construction, and infrastructure — strengthening project data, field-to-office workflows, reporting, and controls before AI is applied to project execution and financial visibility.",
    serviceOutput: 'AI tied to ECI outcomes: margin protection, billing cycle time, project visibility, schedule adherence, risk exposure, cash flow, and throughput across project operations.',
    useCaseHeading: 'Where AI Can Create Value in ECI',
    useCases: ['Project reporting','Change order management','Document review','Risk identification','Schedule analysis','Field updates','Billing support','Cash flow visibility'],
    relatedKeys: ['foundations-data','how-work','foundations-process'],
    inlineLinks: [
      { old: '<dd>FAA helps ECI companies improve project data, field-to-office workflows, reporting, controls, and operating systems before applying AI to project execution and financial visibility.</dd>',
        new: '<dd>FAA helps ECI companies improve <a href="foundation.html">project data</a>, <a href="operations.html">field-to-office workflows</a>, reporting, controls, and operating systems before applying AI to project execution and financial visibility.</dd>' },
      { old: '<dd>ECI AI should improve margin protection, billing cycle time, project visibility, schedule adherence, risk exposure, cash flow, and throughput across project operations.</dd>',
        new: '<dd>ECI AI should improve <a href="business-systems-assessment.html">margin protection, billing cycle time, project visibility, schedule adherence, risk exposure, cash flow, and throughput</a> across project operations.</dd>' },
    ],
  },
  { file: 'industry-transportation-logistics.html', name: 'Transportation & Logistics',
    audience: 'Transportation and Logistics Operators',
    serviceDesc: "FAA's mid-market AI advisory practice for transportation and logistics — improving operating data, dispatch workflows, freight visibility, exception management, and reporting before AI is applied.",
    serviceOutput: 'AI tied to logistics outcomes: throughput, cycle time, cash flow, operating visibility, margin control, service reliability, and risk exposure.',
    useCaseHeading: 'Where AI Can Create Value in Transportation & Logistics',
    useCases: ['Demand and freight forecasting','Route analysis','Exception triage','Freight visibility','Customer communication','Billing support','Document handling','Management reporting'],
    relatedKeys: ['automating-broken','foundations-roi','where-agents'],
    inlineLinks: [
      { old: '<dd>FAA helps transportation and logistics companies improve operating data, dispatch workflows, freight visibility, exception management, reporting, and AI readiness.</dd>',
        new: '<dd>FAA helps transportation and logistics companies improve <a href="foundation.html">operating data</a>, <a href="operations.html">dispatch workflows</a>, freight visibility, exception management, reporting, and AI readiness.</dd>' },
      { old: '<dd>Logistics AI should improve throughput, cycle time, cash flow, operating visibility, margin control, service reliability, and risk exposure.</dd>',
        new: '<dd>Logistics AI should improve <a href="business-systems-assessment.html">throughput, cycle time, cash flow, operating visibility, margin control, service reliability, and risk exposure</a>.</dd>' },
    ],
  },
  { file: 'industry-energy-natural-resources.html', name: 'Energy & Natural Resources',
    audience: 'Energy and Natural Resources Operators',
    serviceDesc: "FAA's mid-market AI advisory practice for energy and natural resources — strengthening operating data, asset workflows, reporting controls, field visibility, and compliance readiness before AI is applied.",
    serviceOutput: 'AI tied to energy outcomes: asset reliability, risk exposure, cycle time, operating visibility, capital planning, throughput, and compliance discipline.',
    useCaseHeading: 'Where AI Can Create Value in Energy & Natural Resources',
    useCases: ['Maintenance planning','Asset reliability','Field reporting','Compliance support','Forecasting','Document review','Capital planning','Operational visibility'],
    relatedKeys: ['foundations-data','foundations-governance','data-gov'],
    inlineLinks: [
      { old: '<dd>FAA helps energy and natural resources companies improve operating data, asset workflows, reporting controls, field visibility, compliance readiness, and AI implementation discipline.</dd>',
        new: '<dd>FAA helps energy and natural resources companies improve <a href="foundation.html">operating data</a>, <a href="operations.html">asset workflows</a>, reporting controls, field visibility, compliance readiness, and AI implementation discipline.</dd>' },
      { old: '<dd>AI should improve asset reliability, risk exposure, cycle time, operating visibility, capital planning, throughput, and compliance discipline.</dd>',
        new: '<dd>AI should improve <a href="business-systems-assessment.html">asset reliability, risk exposure, cycle time, operating visibility, capital planning, throughput, and compliance discipline</a>.</dd>' },
    ],
  },
  { file: 'industry-distribution-wholesale.html', name: 'Distribution & Wholesale',
    audience: 'Distribution and Wholesale Operators',
    serviceDesc: "FAA's mid-market AI advisory practice for distribution and wholesale — improving inventory data, demand workflows, purchasing discipline, warehouse visibility, and reporting before AI is applied.",
    serviceOutput: 'AI tied to distribution outcomes: margin, cash flow, inventory accuracy, order cycle time, throughput, service levels, and operational visibility.',
    useCaseHeading: 'Where AI Can Create Value in Distribution & Wholesale',
    useCases: ['Demand forecasting','Replenishment','Inventory exceptions','Pricing analysis','Purchasing support','Customer service','Warehouse visibility','Management reporting'],
    relatedKeys: ['foundations-data','data-gov','where-agents'],
    inlineLinks: [
      { old: '<dd>FAA helps distribution and wholesale companies improve inventory data, demand workflows, purchasing discipline, warehouse visibility, reporting, and AI readiness.</dd>',
        new: '<dd>FAA helps distribution and wholesale companies improve <a href="foundation.html">inventory data</a>, <a href="operations.html">demand workflows</a>, purchasing discipline, warehouse visibility, reporting, and AI readiness.</dd>' },
      { old: '<dd>Distribution AI should improve margin, cash flow, inventory accuracy, order cycle time, throughput, service levels, and operational visibility.</dd>',
        new: '<dd>Distribution AI should improve <a href="business-systems-assessment.html">margin, cash flow, inventory accuracy, order cycle time, throughput, service levels, and operational visibility</a>.</dd>' },
    ],
  },
  { file: 'industry-industrial-equipment.html', name: 'Industrial Equipment',
    audience: 'Industrial Equipment Operators',
    serviceDesc: "FAA's mid-market AI advisory practice for industrial equipment — improving product, parts, service, warranty, customer, and operating data before AI is applied across equipment lifecycle workflows.",
    serviceOutput: 'AI tied to industrial-equipment outcomes: service cycle time, aftermarket margin, parts availability, customer response time, risk exposure, cash flow, and operating visibility.',
    useCaseHeading: 'Where AI Can Create Value in Industrial Equipment',
    useCases: ['Service planning','Aftermarket support','Parts forecasting','Warranty analysis','Quote support','Field documentation','Customer service','Management reporting'],
    relatedKeys: ['foundations-data','foundations-architecture','where-agents'],
    inlineLinks: [
      { old: '<dd>FAA helps industrial equipment companies improve product, parts, service, warranty, customer, and operating data before applying AI across equipment lifecycle workflows.</dd>',
        new: '<dd>FAA helps industrial equipment companies improve <a href="foundation.html">product, parts, service, warranty, customer, and operating data</a> before applying AI across <a href="operations.html">equipment lifecycle workflows</a>.</dd>' },
      { old: '<dd>Industrial equipment AI should improve service cycle time, aftermarket margin, parts availability, customer response time, risk exposure, cash flow, and operating visibility.</dd>',
        new: '<dd>Industrial equipment AI should improve <a href="business-systems-assessment.html">service cycle time, aftermarket margin, parts availability, customer response time, risk exposure, cash flow, and operating visibility</a>.</dd>' },
    ],
  },
  { file: 'industry-specialty-manufacturing.html', name: 'Specialty Manufacturing',
    audience: 'Specialty Manufacturing Operators',
    serviceDesc: "FAA's mid-market AI advisory practice for specialty manufacturers — improving data, workflows, costing, scheduling, quality visibility, and AI readiness in high-mix, low-volume, custom, or engineer-to-order environments.",
    serviceOutput: 'AI tied to specialty-manufacturing outcomes: margin, quote cycle time, schedule adherence, material availability, quality visibility, throughput, and risk exposure.',
    useCaseHeading: 'Where AI Can Create Value in Specialty Manufacturing',
    useCases: ['Quote analysis','Engineering review','Scheduling','Material planning','Quality analysis','Margin visibility','Exception management','Operational reporting'],
    relatedKeys: ['foundations-process','foundations-data','how-work'],
    inlineLinks: [
      { old: '<dd>FAA helps specialty manufacturers improve data, workflows, costing, scheduling, quality visibility, and AI readiness in high-mix, low-volume, custom, or engineer-to-order environments.</dd>',
        new: '<dd>FAA helps specialty manufacturers improve <a href="foundation.html">data</a>, <a href="operations.html">workflows</a>, costing, scheduling, quality visibility, and AI readiness in high-mix, low-volume, custom, or engineer-to-order environments.</dd>' },
      { old: '<dd>Specialty manufacturing AI should improve margin, quote cycle time, schedule adherence, material availability, quality visibility, throughput, and risk exposure.</dd>',
        new: '<dd>Specialty manufacturing AI should improve <a href="business-systems-assessment.html">margin, quote cycle time, schedule adherence, material availability, quality visibility, throughput, and risk exposure</a>.</dd>' },
    ],
  },
  { file: 'industry-professional-technical-services.html', name: 'Professional & Technical Services',
    audience: 'Professional and Technical Services Firms',
    serviceDesc: "FAA's mid-market AI advisory practice for professional and technical services firms — structuring knowledge, delivery workflows, project data, utilization visibility, and reporting before AI is applied.",
    serviceOutput: 'AI tied to professional-services outcomes: margin, utilization, delivery cycle time, knowledge reuse, project visibility, client response time, and risk exposure.',
    useCaseHeading: 'Where AI Can Create Value in Professional & Technical Services',
    useCases: ['Proposal support','Knowledge retrieval','Document review','Project reporting','Client communication','Utilization analysis','Delivery workflows','Management visibility'],
    relatedKeys: ['where-agents','automating-broken','foundations-process'],
    inlineLinks: [
      { old: '<dd>FAA helps professional and technical services firms improve knowledge systems, delivery workflows, project data, utilization visibility, reporting, and AI readiness.</dd>',
        new: '<dd>FAA helps professional and technical services firms improve <a href="foundation.html">knowledge systems</a>, <a href="operations.html">delivery workflows</a>, project data, utilization visibility, reporting, and AI readiness.</dd>' },
      { old: '<dd>Professional services AI should improve margin, utilization, delivery cycle time, knowledge reuse, project visibility, client response time, and risk exposure.</dd>',
        new: '<dd>Professional services AI should improve <a href="business-systems-assessment.html">margin, utilization, delivery cycle time, knowledge reuse, project visibility, client response time, and risk exposure</a>.</dd>' },
    ],
  },
  { file: 'industry-financial-services-banking.html', name: 'Financial Services & Banking',
    audience: 'Financial Services and Banking Organizations',
    serviceDesc: "FAA's mid-market AI advisory practice for financial services and banking — strengthening data governance, workflow control, reporting discipline, and operational visibility before AI is applied.",
    serviceOutput: 'AI tied to financial-services outcomes: risk exposure, cycle time, reporting accuracy, operating visibility, customer response time, control discipline, and cost-to-serve.',
    useCaseHeading: 'Where AI Can Create Value in Financial Services & Banking',
    useCases: ['Reporting','Document review','Customer operations','Compliance support','Risk workflows','Finance operations','Knowledge retrieval','Internal productivity'],
    relatedKeys: ['foundations-governance','data-gov','where-agents'],
    inlineLinks: [
      { old: '<dd>FAA helps financial services and banking organizations improve data governance, workflow control, reporting discipline, operational visibility, and AI readiness.</dd>',
        new: '<dd>FAA helps financial services and banking organizations improve <a href="foundation.html">data governance</a>, <a href="operations.html">workflow control</a>, reporting discipline, operational visibility, and AI readiness.</dd>' },
      { old: '<dd>Financial services AI should improve risk exposure, cycle time, reporting accuracy, operating visibility, customer response time, control discipline, and cost-to-serve.</dd>',
        new: '<dd>Financial services AI should improve <a href="business-systems-assessment.html">risk exposure, cycle time, reporting accuracy, operating visibility, customer response time, control discipline, and cost-to-serve</a>.</dd>' },
    ],
  },
  { file: 'industry-ai-data-it-systems.html', name: 'AI, Data & IT Systems',
    audience: 'AI, Data, and IT Systems Leaders',
    serviceDesc: "FAA's mid-market AI advisory practice for AI, data, and IT systems leaders — aligning technical work with business outcomes, data governance, workflow design, ownership, and production-ready AI implementation.",
    serviceOutput: 'AI tied to operating outcomes: operational visibility, cycle time, risk exposure, throughput, adoption, data quality, and measurable business execution.',
    useCaseHeading: 'Where AI Can Create Value for AI, Data & IT Systems Teams',
    useCases: ['Workflow automation','Knowledge retrieval','Reporting','Internal tools','Decision support','Documentation','Service operations','Business process improvement'],
    relatedKeys: ['foundations-architecture','platform-agnostic','foundations-roi'],
    inlineLinks: [
      { old: '<dd>FAA helps AI, data, and IT systems teams align technical work with business outcomes, data governance, workflow design, ownership, controls, and production-ready AI implementation.</dd>',
        new: '<dd>FAA helps AI, data, and IT systems teams align technical work with business outcomes, <a href="foundation.html">data governance</a>, <a href="operations.html">workflow design</a>, ownership, controls, and <a href="agentic-ai.html">production-ready AI implementation</a>.</dd>' },
      { old: '<dd>AI, data, and IT systems work should improve operational visibility, cycle time, risk exposure, throughput, adoption, data quality, and measurable business execution.</dd>',
        new: '<dd>AI, data, and IT systems work should improve <a href="business-systems-assessment.html">operational visibility, cycle time, risk exposure, throughput, adoption, data quality, and measurable business execution</a>.</dd>' },
    ],
  },
];

// =========================================================================
// Builders
// =========================================================================

function buildUseCaseBlock(p) {
  const items = p.useCases.map(uc => `            <li>${uc}</li>`).join('\n');
  return `        <div class="aeo-usecases">
          <div class="kicker" style="color: var(--faa-navy);">${p.useCaseHeading}</div>
          <ul class="aeo-usecase-list">
${items}
          </ul>
        </div>
        `;
}

function buildItemListSchema(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: p.useCaseHeading,
    itemListElement: p.useCases.map((uc, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: uc,
    })),
  };
}

function buildServiceSchema(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Mid-Market AI Advisory',
    name: 'Foundation AI Advisory for ' + p.name,
    provider: ORG_FULL,
    areaServed: 'United States',
    audience: {
      '@type': 'BusinessAudience',
      name: p.audience,
      audienceType: 'Mid-Market Operators in ' + p.name,
    },
    description: p.serviceDesc,
    serviceOutput: p.serviceOutput,
    url: SITE + '/' + p.file,
  };
}

function buildRelatedRail(p) {
  const cards = p.relatedKeys.map(k => {
    const c = insights[k];
    if (!c) throw new Error('unknown insight key: ' + k);
    return `      <a href="${c.href}" class="card">
        <div class="card-image">
          <img src="${c.img}" alt="${c.alt}" loading="lazy" />
          <span class="pill">${c.pill}</span>
        </div>
        <div class="p-6 flex flex-col gap-3 flex-1">
          <span class="kicker">${c.kicker}</span>
          <h3 style="font-size: 19px; font-weight: 600; line-height: 1.3;">${c.title}</h3>
          <p style="color: var(--faa-gray-600); font-size: 15px; line-height: 1.55;">${c.dek}</p>
          <span class="read-link mt-auto">Read &rarr;</span>
        </div>
      </a>`;
  }).join('\n\n');
  return `
<!-- ============================================================= -->
<!-- RELATED INSIGHTS                                              -->
<!-- ============================================================= -->
<section class="bg-white border-t" style="border-color: var(--faa-gray-100);">
  <div class="container-faa section-y">
    <div class="flex flex-col gap-3 mb-10 lg:mb-12 max-w-3xl">
      <div class="eyebrow" style="color: var(--faa-navy);">Related Insights</div>
      <h2 class="h2">Related Thinking</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
${cards}
    </div>
    <div class="mt-10">
      <a href="insights.html" class="read-link">View all insights&nbsp;<span class="arrow">&rarr;</span></a>
    </div>
  </div>
</section>

`;
}

// =========================================================================
// Run per-industry edits
// =========================================================================
let touched = 0;
for (const p of industries) {
  let html = fs.readFileSync(p.file, 'utf8');
  let changed = false;

  // (3) Inline links inside Q&A
  for (const e of p.inlineLinks) {
    if (html.includes(e.old)) {
      html = html.replace(e.old, e.new);
      changed = true;
    } else {
      console.log('  WARN: inline-link target not found in', p.file);
    }
  }

  // (4) Visible use-case block — insert between the body paragraphs and the
  // CTA in the LEFT Executive Answer column.
  const ctaAnchor = '<a href="mailto:blueprint@foundationaiadvisory.com?subject=Business%20Systems%20Assessment%20Inquiry" class="read-link" style="display: inline-block; margin-top: 28px; font-size: 15px; font-weight: 600;">Start with a Business Systems Assessment';
  if (html.includes(ctaAnchor) && !html.includes(p.useCaseHeading)) {
    html = html.replace(ctaAnchor, buildUseCaseBlock(p) + '\n        ' + ctaAnchor);
    changed = true;
  }

  // (4) ItemList JSON-LD for the use-case list
  if (!html.includes('"@type":"ItemList","name":"' + p.useCaseHeading + '"')) {
    const itemListTag = '<script type="application/ld+json">' + JSON.stringify(buildItemListSchema(p)) + '</script>';
    html = html.replace('</head>', itemListTag + '\n</head>');
    changed = true;
  }

  // (2) Service JSON-LD with industry-specific BusinessAudience
  if (!html.includes('"@type":"Service","serviceType":"Mid-Market AI Advisory"')) {
    const serviceTag = '<script type="application/ld+json">' + JSON.stringify(buildServiceSchema(p)) + '</script>';
    html = html.replace('</head>', serviceTag + '\n</head>');
    changed = true;
  }

  // (1) Related Insights rail above the closing CTA
  if (!html.includes('<!-- RELATED INSIGHTS')) {
    const closingAnchor = '<!-- CLOSING CTA -->';
    if (html.includes(closingAnchor)) {
      html = html.replace(closingAnchor, buildRelatedRail(p).trimEnd() + '\n\n' + closingAnchor);
      changed = true;
    } else {
      console.log('  WARN: CLOSING CTA anchor not found in', p.file);
    }
  }

  if (changed) {
    fs.writeFileSync(p.file, html);
    console.log('  installed:', p.file);
    touched++;
  }
}

// =========================================================================
// (5) Homepage ItemList of industries
// =========================================================================
{
  const file = 'index.html';
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('"@type":"ItemList","name":"Industries Foundation AI Advisory Serves"')) {
    console.log('  homepage ItemList already present, skipping');
  } else {
    const homepageItemList = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Industries Foundation AI Advisory Serves',
      description: 'Mid-market industries where Foundation AI Advisory applies its data-, workflow-, and AI-readiness methodology.',
      itemListElement: industries.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        url: SITE + '/' + p.file,
      })),
    };
    const tag = '<script type="application/ld+json">' + JSON.stringify(homepageItemList) + '</script>';
    html = html.replace('</head>', tag + '\n</head>');
    fs.writeFileSync(file, html);
    console.log('  homepage: industries ItemList JSON-LD added (' + industries.length + ' items)');
  }
}

console.log('\nIndustry pages updated:', touched, '/', industries.length);
