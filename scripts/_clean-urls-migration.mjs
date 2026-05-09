// One-shot migration: convert every public .html page (except root
// index.html and 404.html) to a folder-based clean URL structure, update
// every internal link to root-relative + trailing-slash form, and leave a
// meta-refresh + canonical-tag redirect at each old .html path so legacy
// URLs continue to work.
//
// Hosting: GitHub Pages — true 301 redirects unsupported, so meta-refresh +
// rel=canonical is the best available fallback.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

const SITE = 'https://foundationaiadvisory.com';

// =========================================================================
// 1. Discover all public HTML files and decide what to do with each.
// =========================================================================
const ROOT_PRESERVED = new Set(['index.html', '404.html']);

function listHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (['node_modules', 'assets', '_originals', '.git', 'squoosh-queue', 'squoosh-out', 'content', 'scripts'].includes(entry.name)) continue;
      out.push(...listHtml(path.posix.join(dir.replaceAll('\\', '/'), entry.name)));
    } else if (entry.name.endsWith('.html')) {
      out.push(path.posix.join(dir.replaceAll('\\', '/'), entry.name));
    }
  }
  return out;
}

const allHtml = listHtml('.').map(p => p.replace(/^\.\//, ''));
const movable = allHtml.filter(p => !ROOT_PRESERVED.has(p));

// Build the public-page set (slugs without .html, e.g. "foundation",
// "insights/where-agents-earn-their-keep").
const pageSlugs = new Set(movable.map(p => p.replace(/\.html$/, '')));

// =========================================================================
// 2. Path-transform helpers
// =========================================================================

// Resolve a relative href/src (possibly with `../` prefixes) against a
// source file's location. Returns the absolute root-anchored path
// (e.g. "/insights/foo.html" or "/assets/bar.png").
function resolveRelative(srcFile, ref) {
  if (ref.startsWith('/') || /^https?:|^mailto:|^tel:|^#/.test(ref)) return null; // not relative
  const baseDir = path.posix.dirname(srcFile.replaceAll('\\', '/'));
  const joined = path.posix.normalize(path.posix.join(baseDir, ref));
  // strip any leading "./" or "../" leftovers
  return '/' + joined.replace(/^\.\//, '').replace(/^\.\.\//, '');
}

// Convert "<basename>.html" or "<basename>.html#anchor" → "/<basename>/" or "/<basename>/#anchor".
// Special case: "index.html" → "/" (with optional fragment/query).
function htmlToCleanUrl(absolutePath, hashOrQuery) {
  // absolutePath looks like "/foundation.html" or "/insights/foo.html" or "/index.html"
  let p = absolutePath.replace(/^\/+/, '');
  if (p === 'index.html' || p === '') return '/' + (hashOrQuery || '');
  if (!p.endsWith('.html')) return absolutePath + (hashOrQuery || '');
  const slug = p.replace(/\.html$/, '');
  return '/' + slug + '/' + (hashOrQuery || '');
}

// Top-level transform for a single HTML document. `srcFile` is the file's
// CURRENT location on disk (used to resolve `../` relatives correctly).
function transform(html, srcFile) {
  // (a) Internal href/src to .html files (relative). Match attribute, value,
  // optional hash/query.
  html = html.replace(
    /(href|src)="([^":#?]+?\.html)(#[^"]*|\?[^"]*)?"/g,
    (m, attr, ref, frag) => {
      // Skip external/special URLs.
      if (/^https?:|^\/\/|^mailto:|^tel:/.test(ref)) return m;
      // Resolve to absolute (root-anchored).
      let absolute;
      if (ref.startsWith('/')) {
        absolute = ref;
      } else {
        absolute = resolveRelative(srcFile, ref);
        if (!absolute) return m;
      }
      const clean = htmlToCleanUrl(absolute, frag || '');
      return `${attr}="${clean}"`;
    }
  );

  // (b) Absolute URLs to our domain that reference .html — convert to clean URL.
  html = html.replace(
    /(https?:\/\/foundationaiadvisory\.com)(\/[^\s"'<>?#]+?\.html)(#[^\s"'<>]*|\?[^\s"'<>]*)?/g,
    (m, origin, abspath, frag) => origin + htmlToCleanUrl(abspath, frag || '')
  );

  // (c) Make every other relative href/src root-anchored. Specifically:
  //   - href/src starting with "../"
  //   - href/src to known root-level assets when called from a non-root file
  //   - href/src to "assets/..." when called from any file
  // Strategy: compute the absolute path via resolveRelative, then output as root-relative.
  html = html.replace(
    /(href|src)="((?:\.\.\/|\.\/)?[^"#?:][^"#?]*?)(#[^"]*|\?[^"]*)?"/g,
    (m, attr, ref, frag) => {
      // Skip already-absolute or special.
      if (/^https?:|^\/\/|^\/|^mailto:|^tel:|^data:|^javascript:/.test(ref)) return m;
      // Skip pure anchors.
      if (ref === '' || ref.startsWith('#')) return m;
      // Skip unmistakably non-relative tokens like a single word (which is
      // probably already a same-folder reference we want to root-anchor).
      // Resolve.
      const absolute = resolveRelative(srcFile, ref);
      if (!absolute) return m;
      return `${attr}="${absolute}${frag || ''}"`;
    }
  );

  // (d) Any remaining "../assets/..." patterns (e.g. inside inline style attribute)
  html = html.replace(/(\.\.\/)+assets\//g, '/assets/');

  return html;
}

// =========================================================================
// 3. Build the redirect HTML for old .html paths
// =========================================================================
function buildRedirect(targetCleanUrl, oldPagePath) {
  const fullTarget = SITE + targetCleanUrl;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="refresh" content="0; url=${targetCleanUrl}" />
<link rel="canonical" href="${fullTarget}" />
<meta name="robots" content="noindex,follow" />
<title>Redirecting&hellip;</title>
<script>window.location.replace(${JSON.stringify(targetCleanUrl)});</script>
</head>
<body>
<p>This page has moved. <a href="${targetCleanUrl}">Continue to ${targetCleanUrl}</a>.</p>
</body>
</html>
`;
}

// =========================================================================
// 4. Run the migration
// =========================================================================

let movedCount = 0;
const migrationLog = [];

for (const oldPath of movable) {
  const slug = oldPath.replace(/\.html$/, '');
  const newPath = path.posix.join(slug, 'index.html');
  const cleanUrl = '/' + slug + '/';

  // Read original content + transform
  const original = fs.readFileSync(oldPath, 'utf8');
  const transformed = transform(original, '/' + oldPath);

  // Ensure target directory exists
  fs.mkdirSync(path.posix.dirname(newPath), { recursive: true });

  // Skip if newPath already exists with different content (shouldn't happen)
  fs.writeFileSync(newPath, transformed);

  // Replace old .html with redirect
  fs.writeFileSync(oldPath, buildRedirect(cleanUrl, '/' + oldPath));

  movedCount++;
  migrationLog.push({ old: '/' + oldPath, neu: cleanUrl, file: newPath });
}

// =========================================================================
// 5. Update root-preserved files (transform their internal links too)
// =========================================================================
for (const rootFile of ROOT_PRESERVED) {
  if (!fs.existsSync(rootFile)) continue;
  const original = fs.readFileSync(rootFile, 'utf8');
  const transformed = transform(original, '/' + rootFile);
  if (transformed !== original) {
    fs.writeFileSync(rootFile, transformed);
    console.log('  transformed in place:', rootFile);
  }
}

// =========================================================================
// 6. Update sitemap.xml — change every <loc> to clean URL
// =========================================================================
{
  const f = 'sitemap.xml';
  if (fs.existsSync(f)) {
    let s = fs.readFileSync(f, 'utf8');
    s = s.replace(
      /<loc>(https?:\/\/[^<\/]+)(\/[^<]+?\.html)<\/loc>/g,
      (m, origin, abspath) => '<loc>' + origin + htmlToCleanUrl(abspath, '') + '</loc>'
    );
    fs.writeFileSync(f, s);
    console.log('  sitemap.xml: URLs converted to clean form');
  }
}

// =========================================================================
// 7. Update llms.txt URLs
// =========================================================================
{
  const f = 'llms.txt';
  if (fs.existsSync(f)) {
    let s = fs.readFileSync(f, 'utf8');
    s = s.replace(
      /(https?:\/\/foundationaiadvisory\.com)(\/[^\s)]+?\.html)/g,
      (m, origin, abspath) => origin + htmlToCleanUrl(abspath, '')
    );
    fs.writeFileSync(f, s);
    console.log('  llms.txt: URLs converted');
  }
}

// =========================================================================
// 8. Update cookie-consent.js — the inline cookie-policy link
// =========================================================================
{
  const f = 'cookie-consent.js';
  let s = fs.readFileSync(f, 'utf8');
  if (s.includes('/cookie-policy.html')) {
    s = s.replace(/\/cookie-policy\.html/g, '/cookie-policy/');
    fs.writeFileSync(f, s);
    console.log('  cookie-consent.js: /cookie-policy.html -> /cookie-policy/');
  }
}

// =========================================================================
// 9. Summary
// =========================================================================
console.log('');
console.log('Pages converted:', movedCount);
console.log('Redirects placed at old paths:', movedCount);
console.log('');
fs.writeFileSync('scripts/_clean-urls-migration.log',
  migrationLog.map(e => e.old + ' -> ' + e.neu).join('\n') + '\n'
);
console.log('  Migration log written to scripts/_clean-urls-migration.log');
