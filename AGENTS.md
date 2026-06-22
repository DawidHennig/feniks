# FENIKS – AGENTS.md

## Stack
- Vanilla HTML/CSS/JS, no build tools, no package manager.
- Hosted on GitHub Pages (`CNAME` → `feniks-ppoz.pl`, `.nojekyll` present).
- Contact form uses EmailJS (loaded from CDN via `<script>` tag in `index.html`).

## Structure
- `index.html` – single-page site, all content inline.
- `styles.css` – all styles (1535 lines).
- `script.js` – all JS (704 lines).
- `projects-manifest.json` – portfolio project list with image paths.
- `projekty/` – one subdirectory per project, each with image files.
- `debug.html`, `test-console.html` – ad-hoc debugging pages, not part of the site.

## Key conventions
- Portfolio is generated dynamically: `script.js:680` fetches `projects-manifest.json`, renders `.portfolio-project` cards, and opens a gallery modal on click.
- Image paths in `projects-manifest.json` are relative (`projekty/<id>/image_1.jpg`).
- Service cards open a detail modal on click (`script.js:384`).
- No lint, test, or typecheck commands exist. No CI workflows.

## Editing tips
- Changes to portfolio should update `projects-manifest.json` AND add image files under `projekty/<id>/`.
- EmailJS public key (`script.js:150`) is hardcoded; `service_feniks_contact` and `template_feniks_form` are the service/template IDs.
- No local dev server needed – open `index.html` directly in a browser to test.
- For mobile, breakpoint is 768px (`styles.css:1190`). Gallery modal also has a 480px breakpoint.
