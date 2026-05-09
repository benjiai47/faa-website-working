// Throwaway: wire each individual industry detail page's hero to use the
// matching homepage industry card image as a darkened background. The
// homepage card images already exist at /assets/homepage-industry-*.webp;
// this script edits each page's <section class="page-hero"> to:
//   1. add the .industry-hero modifier class
//   2. swap the inline background-image on .page-hero-image to point at
//      the matching existing asset, using a root-relative URL
// All darkening is handled in CSS (.industry-hero .page-hero-overlay).
// No new image files are produced.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

// page slug -> existing homepage card asset (filename only; root-relative
// path is constructed below)
const MAPPING = {
  'industry-manufacturing-industrial-production':       'homepage-industry-manufacturing-industrial-production.webp',
  'industry-engineering-construction-infrastructure':   'homepage-industry-engineering-construction-infrastructure.webp',
  'industry-transportation-logistics':                  'homepage-industry-transportation-logistics.webp',
  'industry-energy-natural-resources':                  'homepage-industry-energy-natural-resources.webp',
  'industry-distribution-wholesale':                    'homepage-industry-distribution-wholesale.webp',
  'industry-industrial-equipment':                      'homepage-industry-industrial-equipment.webp',
  'industry-specialty-manufacturing':                   'homepage-industry-specialty-manufacturing.webp',
  'industry-professional-technical-services':           'homepage-industry-professional-technical-services.webp',
  'industry-financial-services-banking':                'homepage-industry-financial-services-banking.webp',
  'industry-ai-data-it-systems':                        'homepage-industry-ai-data-it-systems.webp',
};

let touched = 0;
for (const [slug, asset] of Object.entries(MAPPING)) {
  const file = path.join(slug, 'index.html');
  if (!fs.existsSync(file)) {
    console.warn('SKIP missing:', file);
    continue;
  }
  // Sanity: the asset must already exist; we are NOT generating new files.
  const assetPath = path.join('assets', asset);
  if (!fs.existsSync(assetPath)) {
    console.warn('SKIP missing asset:', assetPath);
    continue;
  }

  const before = fs.readFileSync(file, 'utf8');
  let s = before;

  // 1. Add .industry-hero modifier on the <section> (idempotent).
  s = s.replace(
    /<section class="page-hero">/,
    '<section class="page-hero industry-hero">'
  );

  // 2. Swap the inline background-image to the matching homepage card asset
  //    using a root-relative URL. Match the existing global-flow URL so we
  //    do not touch any other inline backgrounds elsewhere in the file.
  s = s.replace(
    /<div class="page-hero-image" style="background-image: url\('assets\/global-page-hero-background-flow\.webp'\);" aria-hidden="true"><\/div>/,
    `<div class="page-hero-image" style="background-image: url('/assets/${asset}');" aria-hidden="true"></div>`
  );

  if (s !== before) {
    fs.writeFileSync(file, s);
    touched++;
    console.log('updated:', file, '->', asset);
  } else {
    console.log('no-op:', file);
  }
}
console.log('Done. Files touched:', touched);
