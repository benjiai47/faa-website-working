# FAA Insight Article Graphics

This folder holds visual assets for FAA insight articles. Use the suggested filenames so HTML and markdown frontmatter references can be wired without renaming.

## Where Agents Earn Their Keep — and Where They Don't

Suggested filename:
`where-agents-earn-their-keep.png`

Recommended site path:
`/assets/insights/where-agents-earn-their-keep.png`

Currently wired:
The article frontmatter and insights-hub card use `/assets/insights/where-agents-earn-their-keep-card.png`. This is the card thumbnail today. A larger hero variant can be dropped in as `where-agents-earn-their-keep.png` and the frontmatter `image:` field updated to point to it.

Purpose:
Hero image for the full article page.

Visual direction:
Premium consulting-grade image showing AI agents as controlled operating participants inside structured workflows. The image should communicate where agents create leverage: exception detection, routing, workflow coordination, and decision preparation. It should also imply boundaries, controls, and human oversight. No text, no typography, no UI overlays.

## The Mid-Market Case for Platform-Agnostic AI

Suggested filename:
`mid-market-platform-agnostic-ai.png`

Recommended site path:
`/assets/insights/mid-market-platform-agnostic-ai.png`

Currently wired:
The article frontmatter and insights-hub card use `/assets/insights/mid-market-case-for-platform-agnostic-card.png`. This is the card thumbnail today. A larger hero variant can be dropped in as `mid-market-platform-agnostic-ai.png` and the frontmatter `image:` field updated to point to it.

Purpose:
Hero image for the full article page.

Visual direction:
Premium consulting-grade image showing a mid-market operating architecture with multiple business systems connected through a structured data and workflow layer. The image should communicate platform choice as an operating architecture decision, not a vendor-first decision. No text, no typography, no UI overlays.

## Usage Notes

- Do not place text inside images.
- Images should support the article copy, not carry the message.
- Keep FAA palette: deep navy, FAA blue gradients, white highlights, structured dimensional depth.
- Avoid generic AI art, glowing robots, chatbots, circuit boards, or SaaS dashboards.
- Visual tone should feel like Bain / BCG / EY-Parthenon insight imagery.

## How insight images are loaded

Insight pages under `/insights/<slug>.html` are dynamic-render stubs. They fetch `/content/insights/<slug>.md`, parse the YAML frontmatter, and inject the article body. The hero image is set from the frontmatter `image:` field. To change the image for an article, update that field in the markdown — no HTML edit required.

The `image:` field accepts a site-relative path beginning with `/assets/...`. Place new files in this folder and reference them by their site path.

## Existing files referenced by the live site

- `where-agents-earn-their-keep-card.png` — hub card thumbnail and current article hero
- `mid-market-case-for-platform-agnostic-card.png` — hub card thumbnail and current article hero
- `data-governance-non-enterprise-teams.png` — hub card thumbnail and article hero (other insight)
- `prompt-precision-context-engineering-operators.png` and `.mp4` — video insight assets
- `foundations-series-0[1-5]-*.png` — Foundations Series field-series imagery
- `homepage-pillar-*.png` — pillar previews used on the Insights hub
- `insight-data-*.png`, `insight-master-data-quality.png`, `human-in-the-loop-*.png` — supporting visuals

Do not delete files in this folder without confirming they are unreferenced. Run a repo-wide search before removing.
