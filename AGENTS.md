# Repository Guidelines

## Project Structure & Module Organization
- `index.html` is the single page entry point and contains the page layout and metadata.
- `styles.css` holds all styling.
- `script.js` contains the client-side date logic and DOM updates.
- Static assets live at the repo root (`favicon.svg`, `apple-touch-icon.png`, `og-image.png`).
- `is-mardi-gras-early.prd` captures product notes and positioning.

## Build, Test, and Development Commands
- No build step is required; this is a static site.
- Run locally by opening `index.html` in a browser.
- Optional local server: `python3 -m http.server` and open `http://localhost:8000/`.

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
