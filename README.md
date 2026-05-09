# Foundation AI Advisory — Marketing Website

Source for [foundationaiadvisory.com](https://foundationaiadvisory.com).

A static HTML/CSS/JS site for Foundation AI Advisory, LLC — a business-first AI advisory firm for mid-market operators.

---

## Local development

This is a static site. The only dev dependency is Node.js (any modern LTS).

```bash
node scripts/server.js
```

Then open <http://localhost:8000>.

The local server adds `.html` to extensionless URLs and serves `404.html` on file-not-found, so the dev experience matches a host that does the same (Cloudflare Pages, Netlify, Vercel). On hosts that don't rewrite extensionless URLs (notably GitHub Pages), internal links would need a trailing `.html` or a folder/index.html structure.

To change the port:

```bash
PORT=3000 node scripts/server.js
```

---

## Folder structure

```
.
├── *.html                       # All page routes (top-nav, methodology, engagement, industries, insights)
├── insights/                    # Subfolder route for individual insight detail pages (dynamic-loaded markdown)
├── content/insights/*.md        # Markdown source for insight articles
├── assets/                      # Images, podcasts, favicons, hero backgrounds
│   ├── insights/                # Per-insight imagery
│   └── podcasts/                # Audio files
├── styles.css                   # Hand-authored FAA design system
├── tailwind-static.css          # Curated Tailwind utility subset (manually maintained, not built)
├── nav.js                       # Mega-menu open/close + sticky nav behavior
├── insight-detail.js            # Loads /content/insights/<slug>.md into insight pages
├── foundations-series.js        # Renders the 5-part Foundations field series
├── cookie-consent.js            # Cookie banner + consent persistence
├── scripts/server.js            # Local dev server only
├── robots.txt                   # Crawler directives (allows AI/answer engines for AEO)
├── sitemap.xml                  # SEO sitemap
└── llms.txt                     # AEO-friendly summary for LLM answer engines
```

## Page routing conventions

- **Top-level pages** use root-relative HTML files (`/about.html`, `/contact.html`, etc.).
- **Methodology pillars:** `/foundation.html`, `/operations.html`, `/agentic-ai.html`.
- **Engagement detail pages:** `/business-systems-assessment.html`, `/90-day-ai-execution-sprint.html`, `/ongoing-execution-expansion.html`.
- **Industry detail pages:** `/industry-<slug>.html` (10 pages).
- **Insight hub:** `/insights.html`. Individual insights live at `/insights/<slug>.html` and dynamically render markdown from `/content/insights/<slug>.md`.
- **Foundations Series stubs:** `/insights-foundations-*.html` (5 stubs rendered by `foundations-series.js`).

## Adding a new insight

1. Create `content/insights/<slug>.md` with frontmatter (see existing files for the schema: `title`, `slug`, `category`, `format`, `eyebrow`, `pillar`, `author`, `metaDescription`, `deck`, `excerpt`, `ctaLabel`, `ctaHref`, `image`).
2. Create a stub HTML file at `insights/<slug>.html` (copy any existing one and only the `<title>` and meta tags need to change — the article body is loaded dynamically).
3. Add the slug to the `allowedSlugs` set in [`insight-detail.js`](insight-detail.js).
4. Add a card on `insights.html` (in the appropriate pillar section).
5. Update `sitemap.xml` and `llms.txt` if you want it crawled/indexed.

## CTA conventions

Offer-specific CTAs route to `mailto:` with pre-filled subject lines (matches the consulting-firm pattern):

| Button text | Subject line |
|---|---|
| Start with a Business Systems Assessment | `Business Systems Assessment Inquiry` |
| Discuss the 90-Day AI Execution Sprint | `90-Day AI Execution Sprint Inquiry` |
| Explore Ongoing Work | `Ongoing Execution & Expansion Inquiry` |

All route to `blueprint@foundationaiadvisory.com`.

Privacy / data inquiries route to `privacy@foundationaiadvisory.com`.

## Design system

- **Palette:** navy (`--faa-navy`), FAA blue spectrum (`--faa-blue`, `--faa-blue-light`), white, gray scale (`--faa-gray-50` → `--faa-gray-600`).
- **Typography:** Source Serif 4 for headlines and long-form, system stack for UI.
- **Cards:** `.card` with consistent border / padding. Equal-height + bottom-aligned CTA via `flex flex-col h-full` + `mt-auto`.
- **Page hero:** `.page-hero` with `.page-hero-image` background and `.page-hero-overlay`.
- **Visual standard:** Industrial Precision — executive, structured, no SaaS-style flourish, no neon AI clichés.

## Deployment

The site is intentionally framework-free. Any static host works:

- **Cloudflare Pages / Netlify / Vercel:** drop-in deploy, extensionless URLs work natively.
- **GitHub Pages:** works for static files; extensionless URLs would need either `.html` appended in links or a folder/index.html structure migration.
- **S3 + CloudFront:** works with appropriate index document and routing rules.

Production canonicals and `sitemap.xml` use `https://foundationaiadvisory.com`.

## License

Proprietary. See [LICENSE](LICENSE).
