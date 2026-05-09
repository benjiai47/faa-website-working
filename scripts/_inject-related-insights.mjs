// Inject a "Related Insights" 3-card rail into each pillar page,
// immediately above the existing subscribe section.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

const rails = {
  'foundation.html': {
    eyebrow: 'Related Insights',
    h2: 'Recent Thinking on Data',
    pillarLabel: 'Data Curation &amp; Governance',
    cards: [
      {
        href: 'insights-foundations-data-constraint.html',
        img: 'assets/insights/foundations-series-01-data-foundation.webp',
        alt: 'Layered data foundation underneath a structured operating system',
        pill: 'Part 1 of 5',
        kicker: 'Foundations Series',
        title: 'Data: The Constraint You Can&rsquo;t Outrun',
        dek: 'Why mid-market AI initiatives stall on data quality, ownership, and structure before any model is involved.',
      },
      {
        href: 'insights/data-governance-non-enterprise-teams.html',
        img: 'assets/insights/data-governance-non-enterprise-teams.webp',
        alt: 'Infographic explaining lightweight data governance for non-enterprise teams',
        pill: 'Infographic',
        kicker: 'Data Curation &amp; Governance',
        title: 'Data Governance for Non-Enterprise Teams',
        dek: 'A lightweight, enforceable governance model for mid-market teams that need trusted data without enterprise data-office overhead.',
      },
      {
        href: 'insights-foundations-ai-governance.html',
        img: 'assets/insights/foundations-series-05-governance-system.webp',
        alt: 'Governance scaffolding around AI: ownership, controls, escalation, traceability',
        pill: 'Part 5 of 5',
        kicker: 'Foundations Series',
        title: 'Governance: The System That Holds It Together',
        dek: 'Lightweight governance for mid-market AI: ownership, controls, escalation paths, and human oversight at the right points.',
      },
    ],
  },

  'operations.html': {
    eyebrow: 'Related Insights',
    h2: 'Recent Thinking on Workflow',
    pillarLabel: 'Workflow Optimization',
    cards: [
      {
        href: 'insights-foundations-process-before-ai.html',
        img: 'assets/insights/foundations-series-process-pathway.webp',
        alt: 'Illuminated path through a complex maze, representing process redesign',
        pill: 'Part 2 of 5',
        kicker: 'Foundations Series',
        title: 'Process: Fix the System Before You Accelerate It',
        dek: 'Why workflow redesign has to come before automation, and what changes when it does.',
      },
      {
        href: 'insights/automating-a-broken-process-scales-the-problem.html',
        img: 'assets/insights/automating-broken-process-workflow-flow.webp',
        alt: 'Abstract visualization of data flows curving across structured operating platforms',
        pill: 'Article',
        kicker: 'Workflow Optimization',
        title: 'Automating a Broken Process Scales the Problem',
        dek: 'Automation amplifies whatever it inherits. A method for finding and fixing the workflow before AI extends it.',
      },
      {
        href: 'insights/how-work-actually-gets-done-vs-how-its-documented.html',
        img: 'assets/insights/human-in-the-loop-workflow-mapping.webp',
        alt: 'Two professionals mapping decision workflows and process logic',
        pill: 'Brief',
        kicker: 'Workflow Optimization',
        title: 'How Work Actually Gets Done vs. How It&rsquo;s Documented',
        dek: 'The gap between documented process and operating reality is where AI most often fails.',
      },
    ],
  },

  'agentic-ai.html': {
    eyebrow: 'Related Insights',
    h2: 'Recent Thinking on AI Implementation',
    pillarLabel: 'AI Design &amp; Implementation',
    cards: [
      {
        href: 'insights-foundations-ai-architecture.html',
        img: 'assets/insights/foundations-series-03-system-architecture.webp',
        alt: 'System-of-systems architecture diagram with controlled integration boundaries',
        pill: 'Part 3 of 5',
        kicker: 'Foundations Series',
        title: 'Architecture: The System Behind the System',
        dek: 'The operating layers behind reliable applied AI in mid-market environments.',
      },
      {
        href: 'insights/where-agents-earn-their-keep.html',
        img: 'assets/insights/where-agents-earn-their-keep-card.webp',
        alt: 'Abstract visualization of unstructured data flowing through filtering gates',
        pill: 'Article',
        kicker: 'AI Design &amp; Implementation',
        title: 'Where Agents Earn Their Keep &mdash; and Where They Don&rsquo;t',
        dek: 'A decision framework grounded in margin, throughput, cycle time, and risk. Built for operators making capital decisions, not for teams chasing demos.',
      },
      {
        href: 'insights/mid-market-case-for-platform-agnostic.html',
        img: 'assets/insights/mid-market-case-for-platform-agnostic-card.webp',
        alt: 'Abstract visualization of complex data flowing through layered architecture panels',
        pill: 'Article',
        kicker: 'AI Design &amp; Implementation',
        title: 'The Mid-Market Case for Platform-Agnostic AI',
        dek: 'Azure. OpenAI. Claude. Google. The right answer is the stack your business can run, govern, and scale &mdash; not the one a vendor is selling this quarter.',
      },
    ],
  },
};

function buildSection(rail) {
  const cards = rail.cards.map(c => `      <a href="${c.href}" class="card">
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
      </a>`).join('\n\n');
  return `
<!-- ============================================================= -->
<!-- RELATED INSIGHTS                                              -->
<!-- ============================================================= -->
<section class="bg-white border-t" style="border-color: var(--faa-gray-100);">
  <div class="container-faa section-y">
    <div class="flex flex-col gap-3 mb-10 lg:mb-12 max-w-3xl">
      <div class="eyebrow" style="color: var(--faa-navy);">${rail.eyebrow}</div>
      <h2 class="h2">${rail.h2}</h2>
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

for (const [file, rail] of Object.entries(rails)) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('<!-- RELATED INSIGHTS')) {
    console.log('  ', file, '— Related Insights already present, skipping');
    continue;
  }
  // Insert directly before the LAST `<section style="background: var(--faa-gray-50);">`
  // (which is the subscribe section).
  const subscribeAnchor = '<section style="background: var(--faa-gray-50);">';
  const lastIdx = html.lastIndexOf(subscribeAnchor);
  if (lastIdx < 0) throw new Error('subscribe section not found in ' + file);
  html = html.slice(0, lastIdx) + buildSection(rail).trimEnd() + '\n\n' + html.slice(lastIdx);
  fs.writeFileSync(file, html);
  console.log('  ', file, '— Related Insights rail injected (3 cards)');
}
