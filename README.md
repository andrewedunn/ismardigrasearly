# Is Mardi Gras Early?

A tiny static site that answers the age-old New Orleans question: is Mardi Gras early this year?

Yes, of course this was totally vibe coded.

## What’s inside

- Static HTML/CSS/JS
- Shared Mardi Gras date calculation (47 days before Easter), used by the browser and page generator
- Indexable year pages for 2018 and 2025–2030, with dates and verdicts in the HTML
- Mobile-first layout with tables and card views

## Run locally

Run `node scripts/serve.cjs` and open `http://127.0.0.1:8000/2026`.
The preview supports the extensionless `.html` URLs used on GitHub Pages.

## Update year pages

Edit `index.html` for the shared layout and `calculator.js` for the shared date
functions or `STATIC_YEARS` list. Then run:

```sh
node scripts/generate-years.cjs
node scripts/generate-years.cjs --check
```

Commit the generated `YYYY.html` files and `sitemap.xml` alongside source changes.
GitHub Pages serves these files directly from `main` at the repository root; no
build dependencies or deployment configuration changes are required.
The headline uses the existing **Two Buckets** verdict; the other verdicts remain
visible below it. All dates, counts, and classifications use the original math.

Year controls update the URL, title, answer, and metadata. Published years use
`/YYYY`; older query links such as `/?year=2026` select that year and normalize to
its path. A year path takes precedence over a conflicting query. Other years
(1583–9999) remain calculator-only query states canonicalized to the homepage.
Only real static pages appear in the sitemap and footer links.

## Verify after deployment

```sh
curl -sI https://ismardigrasearly.com/robots.txt  # 200, text/plain
curl -s https://ismardigrasearly.com/robots.txt  # User-agent and Sitemap
curl -sI https://ismardigrasearly.com/sitemap.xml  # 200, XML content type
curl -s https://ismardigrasearly.com/2026 | grep -E '<title>|canonical|id="yearAnswer"|id="mardiDate"'
curl -s https://ismardigrasearly.com/ | grep -F 'umami.dunn.us'
```

Also open `/2025`, `/2026`, and `/?year=2018`; change the year, reload, and use
Back/Forward. With JavaScript disabled, each published year must still show its
own answer, date, king-cake count, and three verdicts. Analytics remains Umami
(`5a2d210d-097d-49d0-b5dc-8baad80b6832`) plus the existing GoatCounter.
