# Scripts

| Script | Purpose |
|---|---|
| `parse-articles.py` | Parses the `.docx` article deliverables into `src/data/articles.json`, deduplicating near-identical pieces and classifying each by target city and service. Re-run when new articles land. |
| `html2jsx.py` | Converts a standalone HTML design into JSX (attribute renaming, inline styles to objects, void tags, comments). Used for the original port; kept for the next one. |
| `verify.mjs` | Crawls a running production build and fails on broken or relative internal links, missing title/description/canonical, pages without exactly one `<h1>`, thin pages, duplicate titles or descriptions, invalid JSON-LD, and any city missing a crawlable homepage link. |
| `check-schema.mjs` | Walks every JSON-LD node and fails on a `PostalAddress` with a `streetAddress`, non-numeric coordinates, unanswered `Question`s, `Offer`s without pricing, and missing expected types. |
| `shots.mjs` | Playwright screenshots of the main page types, desktop and mobile. |

`verify.mjs` and `check-schema.mjs` need the site running:

```bash
npm run build && npm start &
node scripts/verify.mjs
node scripts/check-schema.mjs
```
