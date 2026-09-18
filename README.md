# Lint Away Duct Cleaning — Site & Backend

Next.js 16 (App Router) + Supabase, deployed on Vercel.

Built for a **service-area business with no Google Maps pin**. That constraint drives
almost every technical decision here, so it is worth stating up front: with no map
listing, the site's own structured data and its per-city pages *are* the local
footprint. There is nothing else telling Google or an AI assistant that Lint Away
covers Gilbert.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in the values below
npm run dev                  # http://localhost:3000
npm run build                # production build
node scripts/verify.mjs      # crawl checks (needs `npm start` running)
node scripts/check-schema.mjs
```

---

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables**. None of them
are `NEXT_PUBLIC_`, and none should be — they are all server-only.

| Variable | Required | What it does |
|---|---|---|
| `SUPABASE_URL` | for lead storage | Your project URL, e.g. `https://abcdefg.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | for lead storage | Service-role key. **Server-only.** Bypasses RLS by design — see below. |
| `RESEND_API_KEY` | for lead email | Resend API key |
| `LEAD_NOTIFICATION_EMAIL` | for lead email | Where new leads go. Comma-separate for several recipients. |
| `LEAD_FROM_EMAIL` | optional | Defaults to `Lint Away Website <leads@send.lintawayductcleaning.com>`. Must be on a domain verified in Resend. |

If **neither** sink is configured the form still returns success and the lead is
logged to the server console with a warning, so nothing 500s during setup — but
leads are not being captured. Configure at least one before launch.

### Supabase setup

1. Create a project (any region; `us-west-1` is closest to Phoenix).
2. SQL Editor → paste and run `supabase/schema.sql`.
3. Settings → API → copy the URL and the **service_role** key into Vercel.

RLS is on with **no permissive policy** for `anon` or `authenticated`. That is
deliberate: the browser never talks to the database. Only the `/api/quote` route
writes, using the service-role key. There is no client-side key that could be used
to read the lead list.

To review leads: Supabase → Table Editor → `leads`, or query the
`lead_performance` view, which shows which city/service pages actually convert.

---

## Architecture

```
src/
  data/          business.ts, cities.ts, services.ts, articles.json, content.ts
  lib/schema.ts  every JSON-LD builder
  components/    Nav, Footer, QuoteForm, CityGrid, CtaBanner, JsonLd, SiteEffects
  app/
    page.tsx                                  home (ported from the design)
    services/[service]/                       4 service pages
    service-areas/[city]/                     8 city pages
    service-areas/[city]/[service]/           13 city×service pages
    blog/[slug]/                              18 guides
    api/quote/route.ts                        lead intake
    sitemap.ts robots.ts llms.txt/ llms-full.txt/ geositemap.xml/ locations.kml/ feed.xml/
```

Content lives in the repo as typed data, not in a database. For a site this size
that is faster (everything prerenders to static HTML), cheaper (no database reads
on page views), better for SEO (no runtime fetch between crawler and content), and
more private — the only thing in Supabase is customer leads. Editing a city blurb
is a code change, which is the right trade at 8 cities and 18 articles.

### Where the content came from

`scripts/parse-articles.py` reads the 20 `.docx` deliverables, deduplicates the two
pairs of near-identical commercial pieces (18 unique remain), and classifies each by
target city and service into `src/data/articles.json`. Re-run it if new articles
land:

```bash
python3 scripts/parse-articles.py
```

---

## The SEO / AEO layer

### Structured data
One canonical business node at `{url}/#business`, referenced by `@id` from every
other node rather than re-declared. Re-declaring the business on every page creates
competing entities; one strong node is what a Knowledge Graph or an LLM's retrieval
index can actually resolve.

`areaServed` carries **both** a `GeoCircle` (30-mile radius from the Valley centroid)
and explicit `City` nodes with coordinates. Different engines read different ones.

**No `streetAddress` anywhere.** A service-area business that publishes a street
address it does not serve customers from risks Google Business Profile suspension,
and it corrupts the entity graph. `addressLocality` + `addressRegion` only.

Types emitted: `HVACBusiness`/`LocalBusiness`, `WebSite`, `Service`, `ReserveAction`,
`FAQPage`, `BlogPosting`, `BreadcrumbList`, `ItemList`, `City`, `GeoCircle`,
`GeoCoordinates`, `OpeningHoursSpecification`, `ContactPoint`, `SpeakableSpecification`.

### No pricing, anywhere
The site publishes no prices, price ranges or flat rates — not in the copy, not in
`src/data`, and not in the structured data. Every job is quoted after an on-site look.

That means **no `Offer` node**. A schema.org `Offer` without price information is not a
partial Offer, it is an invalid one — Google reports the absent price as an error — and
an `Offer` carrying an invented range would misrepresent what a customer pays. In its
place each `Service` carries a `ReserveAction` pointing at the contact page, so the thing
an engine surfaces is "get a free quote" rather than "starting at $X". `priceRange` is
gone from the `LocalBusiness` node for the same reason.

`scripts/check-schema.mjs` enforces this with an **inverted** guard: it fails if an
`Offer`, `AggregateOffer` or `PriceSpecification` node appears, or if any node carries
`price`, `priceRange`, `priceCurrency`, `minPrice`, `maxPrice`, `lowPrice`, `highPrice`
or `priceSpecification`. Re-adding pricing is therefore a deliberate act that breaks the
build checks, not something that can drift back in.

Three blog articles still mention dollar figures. Those are in the source `.docx`
deliverables and they are warnings about lowball competitors ("companies advertising $49
or $99 whole-home cleaning..."), not Lint Away's prices — including one guide whose whole
subject is what duct cleaning costs in Phoenix. They are left as written; the checks
above cover the site's own claims, not article body copy.

### Programmatic pages, gated on real content
City × service pages exist **only** where a supporting article backs them —
13 pages out of a possible 32. The other 19 would be near-duplicates of each other,
which is the textbook doorway-page pattern Google has filtered since 2015, and which
LLMs deduplicate down to a single citation anyway. Fewer differentiated pages beat
more thin ones. The gate is `supportingArticles()` in `src/data/content.ts`; add an
article targeting a city+service and its page appears automatically.

### AI answer engines
- **`/llms.txt`** — a markdown map of the business, its coverage, services and guides.
- **`/llms-full.txt`** — every guide in full as clean markdown (~120 KB), so an
  assistant can quote the real text rather than a paraphrase scraped through a nav.
- **`robots.txt`** names and allows 17 AI crawlers explicitly (GPTBot, ClaudeBot,
  PerplexityBot, OAI-SearchBot, Google-Extended, Applebot-Extended, CCBot and
  others). Several of these are opt-out by user-agent, so being named and allowed
  makes the intent unambiguous.
- **Answer blocks** (`.answer-block`) open every service, city and city×service
  page: a definitional first sentence naming the service, the provider and the
  places, written to be lifted verbatim. `speakable` in the JSON-LD points at them.

`llms.txt` is a convention rather than a ratified standard and support varies by
vendor. It costs one route and no maintenance, so it is worth having regardless.

### The video strip loads nothing until you click it
The three YouTube Shorts on the homepage (`src/components/ShortsStrip.tsx`,
`src/data/videos.ts`) render as facades: a self-hosted 720x1280 WebP still per card, about
50KB each, in `public/shorts/`. The first click swaps that one card for a real
`youtube-nocookie.com` player, already playing.

Three live `<iframe>` embeds would pull roughly 500KB-1MB of YouTube player JavaScript on
every homepage visit and set cookies before anyone clicked anything — the heaviest thing
on the page by an order of magnitude, for content most visitors scroll past. On a site
built to rank, that is a self-inflicted Core Web Vitals wound.

Each card also carries a plain link to the video, so a crawler or a failed hydration finds
three real followable links rather than three dead `<div>`s.

`uploadDate` in `src/data/videos.ts` is unset. Fill it in (YouTube Studio -> Content, ISO
format `2024-08-14`) and the page will emit `VideoObject` structured data for that video,
which is what makes it eligible for a video rich result. Google treats `uploadDate` as
required, so the markup is gated on it rather than shipped with a guessed date.

To swap a video: change the `id` in `src/data/videos.ts` and drop a matching
`public/shorts/<id>.webp` in (the source is `https://i.ytimg.com/vi/<id>/oardefault.jpg`,
resized to 720x1280).

### The crawlable coverage list
The original design showed the service area as a scrolling collage image. That
communicates nothing to a crawler or an LLM — an `alt` string is not a link. The
belt is still there (it looks good), with `<CityGrid />` beneath it: real links to
eight real landing pages. This was the single biggest structural gap in the design.

---

## Things that need a human decision before launch

1. **"5.0 on Google · 200+ reviews"** in the hero, and `socialProof` in
   `src/data/business.ts` (4.9 / 187). These conflict with each other, and if there
   is no Google Business Profile, the Google rating claim cannot be substantiated.
   Verify the real numbers or change the copy. `/reviews` deliberately emits **no**
   `AggregateRating` markup for the same reason — marking up unverifiable review
   counts is a manual-action risk. The plumbing is ready when real reviews exist.

2. **Get a Google Business Profile with a hidden address.** A service-area business
   *can* have one — you set a service area and hide the street address. This is by
   far the highest-leverage local SEO action available and no amount of on-site work
   substitutes for it. Everything in this repo is built to complement it, not replace it.

3. **`business.ts` placeholders** — verify `email`, `foundingDate`, the `sameAs`
   social URLs, and the `certifications` list. `sameAs` in particular feeds entity
   resolution, so a wrong URL is worse than a missing one.

4. **The van illustration.** The design ships an animated SVG van with a comment
   block explaining how to swap in the real `van.png`. Left as the SVG because it
   animates; swapping is a design call.

5. **WordPress cutover.** `next.config.ts` already 301s the old URL structure
   (`/air-duct-cleaning-services`, `/blogs/:slug`, etc.). Before pointing DNS, export
   the live WordPress URL list and confirm every ranking URL has a destination.

---

## Deploying

```bash
git push origin main
```

Then in Vercel: **Add New → Project → import the repo**. Framework preset is
detected as Next.js; no build settings need changing. Add the environment variables,
deploy, then **Settings → Domains** to attach `lintawayductcleaning.com`.

After the first production deploy:

- Google Search Console → add the property → submit `/sitemap.xml`
- Bing Webmaster Tools → same, and enable IndexNow
- Confirm `/llms.txt`, `/robots.txt` and `/geositemap.xml` all return 200
- Run the JSON-LD through Google's Rich Results Test on one city page and one article

---

## Verification

`scripts/verify.mjs` crawls the running build and fails on: broken or relative
internal links, missing `<title>` / meta description / canonical, pages without
exactly one `<h1>`, thin pages under 250 words, duplicate titles or descriptions
across pages, invalid JSON-LD, any page not referencing the business entity, and any
city missing a crawlable link from the homepage.

`scripts/check-schema.mjs` walks every JSON-LD node and fails on a `PostalAddress`
with a `streetAddress`, non-numeric coordinates, a `Question` without an answer, an
any pricing node or price field (see "No pricing, anywhere" above), and missing expected
types.

Current state: **52 pages crawled, 182 JSON-LD blocks, median 1,031 words, 0 problems.**
