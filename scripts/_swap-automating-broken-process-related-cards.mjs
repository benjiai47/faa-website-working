// Throwaway: swap related-insight card images for the "Automating a
// Broken Process Scales the Problem" article on the 4 pages that
// surface it as a related-insight card. The article hero and the
// Insights index card were already swapped via inline Edit. This
// script targets the remaining 4 files using a precise multi-line
// anchor that includes the article URL and the existing image src.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

const FILES = [
  'industry-manufacturing-industrial-production/index.html',
  'industry-professional-technical-services/index.html',
  'industry-transportation-logistics/index.html',
  'operations/index.html',
];

const OLD = '<a href="/insights/automating-a-broken-process-scales-the-problem/" class="card">\n        <div class="card-image">\n          <img src="/assets/insights/automating-broken-process-workflow-flow.webp" alt="Abstract visualization of data flows curving across structured operating platforms" loading="lazy" />';
const NEW = '<a href="/insights/automating-a-broken-process-scales-the-problem/" class="card">\n        <div class="card-image">\n          <img src="/assets/insights/automating-a-broken-process-scales-the-problem.webp" alt="Mountain trail signpost contrasting two paths — \'Automate a Broken Process: Scales the Problem\' (faster failure, more errors, higher risk) versus \'Fix the Workflow First: Scales the Outcome\' (faster results, fewer errors, lower risk)." loading="lazy" />';

let touched = 0, already = 0, nohook = 0;
for (const f of FILES) {
  if (!fs.existsSync(f)) { console.warn('missing:', f); continue; }
  const before = fs.readFileSync(f, 'utf8');
  if (before.includes(NEW)) { already++; continue; }
  if (!before.includes(OLD)) { nohook++; console.warn('no-hook:', f); continue; }
  fs.writeFileSync(f, before.replace(OLD, NEW));
  touched++;
  console.log('updated:', f);
}
console.log('Done. Touched:', touched, 'Already:', already, 'No-hook:', nohook);
