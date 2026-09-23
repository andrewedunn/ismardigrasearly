# Repository Guidelines

## Project Structure & Module Organization
- `index.html` is the single page entry point and contains the page layout and metadata.
- `styles.css` holds all styling.
- `calculator.js` contains shared date logic; `script.js` handles DOM and URL updates.
- `YYYY.html` pages and `sitemap.xml` are generated; edit the shared source instead.
- Static assets live at the repo root (`favicon.svg`, `apple-touch-icon.png`, `og-image.png`).
- `is-mardi-gras-early.prd` captures product notes and positioning.

## Build, Test, and Development Commands
- No build step is required; this is a static site.
- Preview with `node scripts/serve.cjs` at `http://127.0.0.1:8000/` (supports clean year URLs).
- After changing the layout, shared calculator, or year list, run `node scripts/generate-years.cjs`.
- Verify generated files with `node scripts/generate-years.cjs --check`.

## Coding Style & Naming Conventions
- Indentation: 2 spaces in HTML/CSS/JS.
- JavaScript uses double quotes and semicolons.
- Prefer clear, descriptive names for DOM hooks (e.g., `mardiDate`, `breakdownTable`).
- File names are lowercase with hyphens when multi-word (e.g., `og-image.png`).

## Testing Guidelines
- No automated tests are present.
- Manual verification: open `index.html`, change the year input, and confirm the date, weekday, and classifications update without console errors.

## Commit & Pull Request Guidelines
- Commits use short, imperative, sentence-style messages (examples: "Initial site build", "Tighten links, add CNAME, ignore DS_Store").
- Keep commits focused on a single change area.
- PRs should include a concise description of the change and, for visual updates, before/after screenshots.

## Configuration & Content Notes
- SEO and social metadata live in `index.html`; update `og-image.png` if the hero look changes.
- Fonts load from Google Fonts; keep new type choices consistent with the existing aesthetic.
