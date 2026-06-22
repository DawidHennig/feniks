# FENIKS – AGENTS.md

## Stack
- Vanilla HTML/CSS/JS, no build tools, no package manager.
- Hosted on GitHub Pages (`CNAME` → `feniks-ppoz.pl`, `.nojekyll` present).
- Contact form uses FormSubmit.co (zero-config email forwarding, no CDN).

## Structure
- `index.html` – single-page site, all content inline.
- `styles.css` – all styles (1243 lines, minified to 16.3 KB).
- `script.js` – all JS (329 lines, minified to 9.0 KB).
- `projects-manifest.json` – portfolio project list with image paths (17 projects after AED merge).
- `projekty/` – one subdirectory per project, each with image files.
- `favicon.png` – FENIKS logo favicon (192x192 PNG).
- `debug.html`, `test-console.html` – ad-hoc debugging pages, not part of the site.

## Key conventions
- Portfolio is generated dynamically: `script.js:680` fetches `projects-manifest.json`, renders `.portfolio-project` cards, and opens a gallery modal on click.
- Image paths in `projects-manifest.json` are relative (`projekty/<id>/image_1.jpg`).
- Service cards open a detail modal on click (`script.js:384`).
- No lint, test, or typecheck commands exist. No CI workflows.

## Editing tips
- Changes to portfolio should update `projects-manifest.json` AND add image files under `projekty/<id>/`.
- FormSubmit.co public email: `feniks.kontakt@gmail.com` (configured in form `action` attribute).
- No local dev server needed – open `index.html` directly in a browser to test.
- For mobile, breakpoint is 768px (`styles.css:1190`). Gallery modal also has a 480px breakpoint.
