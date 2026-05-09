// Inject Executive Answer 2-col AEO section + FAQPage JSON-LD into all 10
// industry pages. Insertion point: just before <!-- INTRO --> (i.e., between
// hero close and first body section), matching the foundation/operations/
// agentic-ai pattern.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

const SITE = 'https://foundationaiadvisory.com';

const industries = [
  {
    file: 'industry-manufacturing-industrial-production.html',
    h2: 'AI in Manufacturing Starts With the Operating Floor, Not the Model',
    asideLabel: 'What this answers about AI in Manufacturing & Industrial Production',
    body: [
      'Manufacturing companies do not need more AI language. They need better control over margin, throughput, yield, schedule adherence, labor utilization, material usage, and operating visibility. FAA helps manufacturers improve the data and workflows underneath those outcomes before applying AI.',
      'In most mid-market manufacturing environments, the constraint is not a lack of technology. The constraint is fragmented operating data, inconsistent process discipline, disconnected systems, and manual reconciliation between what happened on the floor and what leadership sees in reports.',
      'AI can help manufacturing teams forecast demand, identify production bottlenecks, improve maintenance planning, support quality analysis, and reduce administrative drag. But those systems only work when item masters, production data, work orders, inventory records, costing assumptions, and process ownership are clean enough to trust.',
    ],
    qa: [
      { q: 'What does FAA do for manufacturing companies?', a: 'FAA helps manufacturing companies improve data, workflows, and operating systems before applying AI to production, quality, inventory, scheduling, maintenance, finance, and reporting problems.' },
      { q: 'Why does manufacturing AI fail?', a: 'Manufacturing AI fails when the data behind production, inventory, costing, labor, quality, and scheduling is incomplete, inconsistent, or disconnected from how work actually happens on the floor.' },
      { q: 'Where can AI create value in manufacturing?', a: 'AI can create value in forecasting, production planning, quality analysis, maintenance, inventory visibility, scheduling, margin analysis, and management reporting when the underlying data and workflows are governed.' },
      { q: 'Who should own manufacturing AI initiatives?', a: 'Ownership should sit with the business leaders responsible for the operating outcome, supported by IT for data access, architecture, security, integrations, and controls.' },
      { q: 'What outcomes should manufacturing AI improve?', a: 'Manufacturing AI should improve margin, throughput, cycle time, schedule adherence, labor utilization, quality visibility, inventory accuracy, and risk exposure.' },
    ],
  },
  {
    file: 'industry-engineering-construction-infrastructure.html',
    h2: 'AI in ECI Depends on Field-to-Office Control',
    asideLabel: 'What this answers about AI in Engineering, Construction & Infrastructure',
    body: [
      'Engineering, construction, and infrastructure companies operate across estimates, contracts, schedules, change orders, field updates, labor, equipment, vendors, billing, and project controls. The issue is rarely a lack of information. The issue is that information moves through too many handoffs, spreadsheets, emails, PDFs, project tools, and undocumented workarounds.',
      'FAA helps ECI companies strengthen the data and workflows that connect the field, project management, finance, and leadership before applying AI. Without that foundation, AI will accelerate the same problems that already create margin fade, billing delays, schedule slippage, and unclear accountability.',
      'AI can support project reporting, change order tracking, document review, risk identification, schedule analysis, field updates, and cash flow visibility. But it only works when project data is structured, ownership is clear, and workflows reflect how work actually gets done.',
    ],
    qa: [
      { q: 'What does FAA do for engineering, construction, and infrastructure companies?', a: 'FAA helps ECI companies improve project data, field-to-office workflows, reporting, controls, and operating systems before applying AI to project execution and financial visibility.' },
      { q: 'Why does AI fail in construction and infrastructure environments?', a: 'AI fails when project data is fragmented across estimates, schedules, change orders, field notes, invoices, contracts, and spreadsheets without clear ownership or consistent definitions.' },
      { q: 'Where can AI create value in ECI?', a: 'AI can create value in project reporting, change order management, document review, risk identification, schedule analysis, field updates, billing support, and cash flow visibility.' },
      { q: 'Who should own ECI AI initiatives?', a: 'Ownership should sit with the leaders accountable for project delivery, finance, or operations, supported by IT for secure access, integrations, architecture, and system controls.' },
      { q: 'What outcomes should ECI AI improve?', a: 'ECI AI should improve margin protection, billing cycle time, project visibility, schedule adherence, risk exposure, cash flow, and throughput across project operations.' },
    ],
  },
  {
    file: 'industry-transportation-logistics.html',
    h2: 'AI in Transportation and Logistics Depends on Flow',
    asideLabel: 'What this answers about AI in Transportation & Logistics',
    body: [
      'Transportation and logistics companies live on flow. Freight, dispatch, routing, capacity, inventory movement, driver availability, carrier performance, customer commitments, and exception handling all depend on timely and trustworthy operating data.',
      'FAA helps logistics operators strengthen the data and workflows behind dispatch, forecasting, freight visibility, customer service, billing, and exception management before applying AI. The goal is not AI for its own sake. The goal is faster decisions, fewer delays, better visibility, and tighter control over operating performance.',
      'AI can help with demand forecasting, route analysis, exception triage, customer communication, document handling, pricing support, and operational reporting. But if shipment data, carrier data, customer commitments, accessorial charges, and exception workflows are inconsistent, AI will create faster confusion rather than better execution.',
    ],
    qa: [
      { q: 'What does FAA do for transportation and logistics companies?', a: 'FAA helps transportation and logistics companies improve operating data, dispatch workflows, freight visibility, exception management, reporting, and AI readiness.' },
      { q: 'Why does logistics AI fail?', a: 'Logistics AI fails when shipment, carrier, customer, routing, pricing, billing, and exception data is fragmented or when workflows do not match how dispatch and operations actually run.' },
      { q: 'Where can AI create value in transportation and logistics?', a: 'AI can create value in forecasting, route analysis, exception triage, freight visibility, customer communication, billing support, document handling, and management reporting.' },
      { q: 'Who should own transportation and logistics AI initiatives?', a: 'Ownership should sit with the operating leader responsible for dispatch, freight flow, customer service, finance, or network performance, supported by IT for data access and controls.' },
      { q: 'What outcomes should logistics AI improve?', a: 'Logistics AI should improve throughput, cycle time, cash flow, operating visibility, margin control, service reliability, and risk exposure.' },
    ],
  },
  {
    file: 'industry-energy-natural-resources.html',
    h2: 'AI in Energy and Natural Resources Requires Reliable Operating Evidence',
    asideLabel: 'What this answers about AI in Energy & Natural Resources',
    body: [
      'Energy and natural resources companies operate in environments where asset reliability, regulatory exposure, field conditions, capital planning, safety, maintenance, and reporting discipline matter. The cost of weak data is not just inefficiency. It can create operational risk, compliance exposure, downtime, and poor capital allocation.',
      'FAA helps energy and natural resources operators strengthen the data governance, workflow control, and operating visibility required before AI is applied. The work starts with the reliability of the information used to make decisions, not with the AI model.',
      'AI can support maintenance planning, asset monitoring, field reporting, compliance workflows, forecasting, document review, and operational visibility. But those use cases depend on traceable data, clear ownership, and workflows that reflect actual operating conditions.',
    ],
    qa: [
      { q: 'What does FAA do for energy and natural resources companies?', a: 'FAA helps energy and natural resources companies improve operating data, asset workflows, reporting controls, field visibility, compliance readiness, and AI implementation discipline.' },
      { q: 'Why does AI fail in energy and natural resources?', a: 'AI fails when asset data, maintenance records, field reports, compliance documentation, and operating workflows are incomplete, inconsistent, or not governed.' },
      { q: 'Where can AI create value in energy and natural resources?', a: 'AI can create value in maintenance planning, asset reliability, field reporting, compliance support, forecasting, document review, capital planning, and operational visibility.' },
      { q: 'Who should own AI initiatives in energy and natural resources?', a: 'Ownership should sit with the operational, asset, compliance, or finance leaders accountable for the business outcome, supported by IT for access, security, architecture, and controls.' },
      { q: 'What outcomes should energy and natural resources AI improve?', a: 'AI should improve asset reliability, risk exposure, cycle time, operating visibility, capital planning, throughput, and compliance discipline.' },
    ],
  },
  {
    file: 'industry-distribution-wholesale.html',
    h2: 'AI in Distribution Starts With Inventory, Demand, and Exception Flow',
    asideLabel: 'What this answers about AI in Distribution & Wholesale',
    body: [
      'Distribution and wholesale companies depend on inventory accuracy, demand visibility, purchasing discipline, supplier performance, warehouse execution, pricing controls, and customer service. Small data issues compound quickly across purchasing, stocking, fulfillment, invoicing, and margin management.',
      'FAA helps distributors improve the data and workflows behind inventory, demand planning, purchasing, warehouse operations, customer commitments, and reporting before applying AI. AI can support faster decisions, but only when the operating foundation is controlled.',
      'AI can help with demand forecasting, replenishment, inventory exception management, customer service, pricing analysis, purchasing support, and operational reporting. But if item data, supplier records, inventory balances, pricing rules, and exception workflows are inconsistent, AI will amplify the wrong signals.',
    ],
    qa: [
      { q: 'What does FAA do for distribution and wholesale companies?', a: 'FAA helps distribution and wholesale companies improve inventory data, demand workflows, purchasing discipline, warehouse visibility, reporting, and AI readiness.' },
      { q: 'Why does AI fail in distribution and wholesale?', a: 'AI fails when item masters, inventory balances, supplier data, demand signals, pricing rules, and fulfillment workflows are inconsistent or not governed.' },
      { q: 'Where can AI create value in distribution and wholesale?', a: 'AI can create value in demand forecasting, replenishment, inventory exceptions, pricing analysis, purchasing support, customer service, warehouse visibility, and management reporting.' },
      { q: 'Who should own distribution AI initiatives?', a: 'Ownership should sit with the business leader accountable for inventory, purchasing, warehouse operations, customer service, finance, or margin performance, supported by IT for controls and system access.' },
      { q: 'What outcomes should distribution AI improve?', a: 'Distribution AI should improve margin, cash flow, inventory accuracy, order cycle time, throughput, service levels, and operational visibility.' },
    ],
  },
  {
    file: 'industry-industrial-equipment.html',
    h2: 'AI in Industrial Equipment Depends on Product, Service, and Parts Visibility',
    asideLabel: 'What this answers about AI in Industrial Equipment',
    body: [
      'Industrial equipment companies operate across sales, engineering, production, parts, service, warranty, field support, and customer commitments. The operating challenge is often not one system. It is the handoff between systems, departments, and lifecycle stages.',
      'FAA helps industrial equipment companies strengthen the data and workflows that connect equipment records, bills of material, service history, parts demand, warranty claims, customer records, and financial reporting before applying AI.',
      'AI can support service planning, aftermarket growth, warranty analysis, parts forecasting, quote support, customer service, field documentation, and operational reporting. But it requires governed product, customer, parts, and service data that teams can trust.',
    ],
    qa: [
      { q: 'What does FAA do for industrial equipment companies?', a: 'FAA helps industrial equipment companies improve product, parts, service, warranty, customer, and operating data before applying AI across equipment lifecycle workflows.' },
      { q: 'Why does AI fail in industrial equipment companies?', a: 'AI fails when equipment records, parts data, service history, warranty claims, bills of material, and customer data are fragmented or owned inconsistently across teams.' },
      { q: 'Where can AI create value in industrial equipment?', a: 'AI can create value in service planning, aftermarket support, parts forecasting, warranty analysis, quote support, field documentation, customer service, and management reporting.' },
      { q: 'Who should own industrial equipment AI initiatives?', a: 'Ownership should sit with the leader accountable for service, operations, aftermarket, engineering, finance, or customer outcomes, supported by IT for data access, security, and architecture.' },
      { q: 'What outcomes should industrial equipment AI improve?', a: 'Industrial equipment AI should improve service cycle time, aftermarket margin, parts availability, customer response time, risk exposure, cash flow, and operating visibility.' },
    ],
  },
  {
    file: 'industry-specialty-manufacturing.html',
    h2: 'AI in Specialty Manufacturing Has to Respect High-Mix Reality',
    asideLabel: 'What this answers about AI in Specialty Manufacturing',
    body: [
      'Specialty manufacturers often operate in high-mix, low-volume, engineer-to-order, configure-to-order, or custom production environments. Standard AI assumptions break when jobs, routings, materials, labor, quality requirements, and customer specifications vary heavily.',
      'FAA helps specialty manufacturers improve the data and workflows behind quoting, engineering, production planning, materials, quality, costing, scheduling, and reporting before applying AI. The goal is to make complex operations more visible and controllable without forcing the business into a generic model.',
      'AI can support quote analysis, engineering review, scheduling, material planning, quality insights, margin analysis, and exception management. But it depends on governed item data, job history, customer requirements, routing assumptions, and ownership of decision points.',
    ],
    qa: [
      { q: 'What does FAA do for specialty manufacturing companies?', a: 'FAA helps specialty manufacturers improve data, workflows, costing, scheduling, quality visibility, and AI readiness in high-mix, low-volume, custom, or engineer-to-order environments.' },
      { q: 'Why does AI fail in specialty manufacturing?', a: 'AI fails when job data, routings, material records, quality requirements, engineering assumptions, and customer specifications are inconsistent or not structured for decision-making.' },
      { q: 'Where can AI create value in specialty manufacturing?', a: 'AI can create value in quoting, engineering review, scheduling, material planning, quality analysis, margin visibility, exception management, and operational reporting.' },
      { q: 'Who should own specialty manufacturing AI initiatives?', a: 'Ownership should sit with the business leader accountable for quoting, engineering, production, quality, finance, or customer delivery, supported by IT for data architecture and controls.' },
      { q: 'What outcomes should specialty manufacturing AI improve?', a: 'Specialty manufacturing AI should improve margin, quote cycle time, schedule adherence, material availability, quality visibility, throughput, and risk exposure.' },
    ],
  },
  {
    file: 'industry-professional-technical-services.html',
    h2: 'AI in Professional Services Depends on Knowledge Work Discipline',
    asideLabel: 'What this answers about AI in Professional & Technical Services',
    body: [
      'Professional and technical services firms run on knowledge, judgment, delivery quality, utilization, project economics, client commitments, and repeatable execution. The challenge is that much of the operating system lives in documents, inboxes, meetings, spreadsheets, project tools, and individual expertise.',
      'FAA helps professional and technical services firms structure the data, workflows, knowledge assets, and delivery processes required before applying AI. The goal is not to replace expertise. The goal is to reduce friction, improve consistency, increase visibility, and protect margin.',
      'AI can support proposal development, project reporting, knowledge retrieval, document review, client communication, delivery workflows, utilization analysis, and management visibility. But it only works when knowledge is structured, ownership is clear, and workflows reflect how work is actually delivered.',
    ],
    qa: [
      { q: 'What does FAA do for professional and technical services firms?', a: 'FAA helps professional and technical services firms improve knowledge systems, delivery workflows, project data, utilization visibility, reporting, and AI readiness.' },
      { q: 'Why does AI fail in professional services?', a: 'AI fails when knowledge is scattered across documents, email, meetings, project tools, and individual expertise without structure, ownership, or clear delivery workflows.' },
      { q: 'Where can AI create value in professional and technical services?', a: 'AI can create value in proposal support, knowledge retrieval, document review, project reporting, client communication, utilization analysis, delivery workflows, and management visibility.' },
      { q: 'Who should own professional services AI initiatives?', a: 'Ownership should sit with the leader accountable for delivery, client outcomes, operations, finance, or practice performance, supported by IT for access, security, and controls.' },
      { q: 'What outcomes should professional services AI improve?', a: 'Professional services AI should improve margin, utilization, delivery cycle time, knowledge reuse, project visibility, client response time, and risk exposure.' },
    ],
  },
  {
    file: 'industry-financial-services-banking.html',
    h2: 'AI in Financial Services Requires Controls Before Automation',
    asideLabel: 'What this answers about AI in Financial Services & Banking',
    body: [
      'Financial services and banking environments depend on trust, controls, reporting accuracy, risk management, auditability, compliance, customer data, and operational discipline. AI cannot be treated as a bolt-on tool in this environment. It has to be designed around ownership, traceability, and control.',
      'FAA helps financial services and banking organizations strengthen the data, workflows, governance, and decision controls required before applying AI. The work starts with the operating environment, not the model.',
      'AI can support reporting, document review, customer operations, risk workflows, compliance support, finance operations, knowledge retrieval, and internal productivity. But it only works when data definitions, access rights, review processes, and accountability are clear.',
    ],
    qa: [
      { q: 'What does FAA do for financial services and banking organizations?', a: 'FAA helps financial services and banking organizations improve data governance, workflow control, reporting discipline, operational visibility, and AI readiness.' },
      { q: 'Why does AI fail in financial services and banking?', a: 'AI fails when customer data, reporting definitions, access controls, compliance workflows, risk processes, and ownership structures are unclear or poorly governed.' },
      { q: 'Where can AI create value in financial services and banking?', a: 'AI can create value in reporting, document review, customer operations, compliance support, risk workflows, finance operations, knowledge retrieval, and internal productivity.' },
      { q: 'Who should own AI initiatives in financial services and banking?', a: 'Ownership should sit with the business, risk, compliance, finance, or operations leader accountable for the outcome, supported by IT for access, security, architecture, and controls.' },
      { q: 'What outcomes should financial services AI improve?', a: 'Financial services AI should improve risk exposure, cycle time, reporting accuracy, operating visibility, customer response time, control discipline, and cost-to-serve.' },
    ],
  },
  {
    file: 'industry-ai-data-it-systems.html',
    h2: 'AI, Data, and IT Systems Need Business Ownership to Create Value',
    asideLabel: 'What this answers about AI, Data and IT Systems work',
    body: [
      'AI, data, and IT teams are often asked to turn fragmented operations into reliable systems. The issue is not only technical. It is business ownership, process clarity, data definitions, governance, prioritization, and adoption.',
      'FAA helps AI, data, and IT leaders connect technical execution to business outcomes. The work starts by clarifying what the business needs to improve, how the workflow actually runs, what data is trusted, and who owns the result.',
      'AI can support automation, knowledge retrieval, reporting, workflow orchestration, internal tools, and decision support. But without business ownership and governance, technical teams are left building around unclear requirements, inconsistent data, and undefined ROI.',
    ],
    qa: [
      { q: 'What does FAA do for AI, data, and IT systems teams?', a: 'FAA helps AI, data, and IT systems teams align technical work with business outcomes, data governance, workflow design, ownership, controls, and production-ready AI implementation.' },
      { q: 'Why do AI and data initiatives fail?', a: 'AI and data initiatives fail when they start with tools before the business problem, workflow, data ownership, governance model, and measurable outcome are clear.' },
      { q: 'Where can AI create value for IT and data teams?', a: 'AI can create value in workflow automation, knowledge retrieval, reporting, internal tools, decision support, documentation, service operations, and business process improvement.' },
      { q: 'Who should own AI and data initiatives?', a: 'Ownership should be shared between the business leader accountable for the outcome and the technical leader responsible for architecture, access, security, integration, and controls.' },
      { q: 'What outcomes should AI, data, and IT systems work improve?', a: 'AI, data, and IT systems work should improve operational visibility, cycle time, risk exposure, throughput, adoption, data quality, and measurable business execution.' },
    ],
  },
];

function decode(s) {
  return s.replace(/&mdash;/g, '—').replace(/&rsquo;/g, '’').replace(/&amp;/g, '&');
}

function buildSection(p) {
  const items = p.qa.map(({ q, a }) => `          <div class="aeo-faq-item">
            <dt>${q}</dt>
            <dd>${a}</dd>
          </div>`).join('\n');
  const bodyParas = p.body.map(t => `        <p class="body-lg mt-5" style="color: var(--faa-gray-600);">
          ${t}
        </p>`).join('\n');
  return `
<!-- ============================================================= -->
<!-- EXECUTIVE ANSWER (AEO)                                        -->
<!-- ============================================================= -->
<section class="bg-white">
  <div class="container-faa section-y">
    <div class="methodology-intro-grid">
      <div class="methodology-intro-text">
        <div class="eyebrow" style="color: var(--faa-navy);">Executive Answer</div>
        <h2 class="h2 mt-3">${p.h2}</h2>
${bodyParas}
        <a href="mailto:blueprint@foundationaiadvisory.com?subject=Business%20Systems%20Assessment%20Inquiry" class="read-link" style="display: inline-block; margin-top: 28px; font-size: 15px; font-weight: 600;">Start with a Business Systems Assessment&nbsp;<span class="arrow">&rarr;</span></a>
      </div>

      <aside class="methodology-aeo" aria-label="${p.asideLabel}">
        <div class="eyebrow" style="color: var(--faa-navy);">What This Answers</div>
        <dl class="aeo-faq" style="margin-top: 20px;">
${items}
        </dl>
      </aside>
    </div>
  </div>
</section>

`;
}

function buildSchema(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: p.qa.map(({ q, a }) => ({
      '@type': 'Question',
      name: decode(q),
      acceptedAnswer: { '@type': 'Answer', text: decode(a) },
    })),
  };
}

let touched = 0;
for (const p of industries) {
  let html = fs.readFileSync(p.file, 'utf8');
  if (html.includes('EXECUTIVE ANSWER (AEO)')) { console.log('  already has section:', p.file); continue; }

  // Insert before the <!-- INTRO --> comment block
  const introAnchor = '<!-- INTRO -->';
  if (!html.includes(introAnchor)) throw new Error('INTRO anchor not found in ' + p.file);
  html = html.replace(introAnchor, buildSection(p).trimEnd() + '\n\n' + introAnchor);

  // Inject FAQPage JSON-LD just before </head>
  if (html.includes('"@type":"FAQPage"')) {
    console.log('  WARNING — existing FAQPage on', p.file, '; merging by replacing.');
    const oldRe = /<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"FAQPage"[\s\S]*?<\/script>/;
    html = html.replace(oldRe, '<script type="application/ld+json">' + JSON.stringify(buildSchema(p)) + '</script>');
  } else {
    const tag = '<script type="application/ld+json">' + JSON.stringify(buildSchema(p)) + '</script>';
    html = html.replace('</head>', tag + '\n</head>');
  }

  fs.writeFileSync(p.file, html);
  console.log('  installed:', p.file);
  touched++;
}
console.log('Industry pages updated:', touched, '/', industries.length);
