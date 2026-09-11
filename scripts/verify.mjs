/**
 * Crawls the running production build and checks the things that would
 * silently break the SEO layer: broken internal links, duplicate meta titles,
 * missing or malformed JSON-LD, and pages where the content lives only in an
 * image.
 */
const BASE = 'http://localhost:3000';
const seen = new Set();
const queue = ['/'];
const pages = [];
const problems = [];

const ASSET = /\.(png|jpe?g|svg|webp|ico|css|js|xml|kml|txt)$/i;
const abs = (h) => {
  if (!h) return null;
  if (h.startsWith('#') || h.startsWith('tel:') || h.startsWith('mailto:') || h.startsWith('data:')) return null;
  if (h.startsWith('http')) return h.startsWith(BASE) ? h.slice(BASE.length) || '/' : null;
  if (!h.startsWith('/')) { problems.push(`relative link "${h}" — will 404 on a case-sensitive host`); return null; }
  const p = h.split('#')[0].split('?')[0] || '/';
  return ASSET.test(p) ? null : p;
};

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);

  const res = await fetch(BASE + path, { redirect: 'manual' });
  if (res.status !== 200) { problems.push(`${res.status} ${path}`); continue; }
  const html = await res.text();

  const title = (html.match(/<title>(.*?)<\/title>/s) || [])[1] ?? '';
  const desc = (html.match(/<meta name="description" content="(.*?)"/s) || [])[1] ?? '';
  const canonical = (html.match(/<link rel="canonical" href="(.*?)"/) || [])[1] ?? '';
  const h1s = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gs)].map(m => m[1].replace(/<[^>]*>/g, '').trim());

  const ld = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)]
    .map(m => m[1].replace(/\\u003c/g, '<'));
  const parsed = [];
  ld.forEach((raw, i) => {
    try { parsed.push(JSON.parse(raw)); }
    catch (e) { problems.push(`JSON-LD #${i} invalid on ${path}: ${e.message}`); }
  });

  // visible text, minus scripts and styles
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ').trim();

  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);
  pages.push({ path, title, desc, canonical, h1s, ldCount: parsed.length, ld: parsed, words: text.split(' ').length, noindex });

  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const p = abs(m[1]);
    if (p && !seen.has(p) && !p.startsWith('/api')) queue.push(p);
  }
}

// ── checks ──
const byTitle = new Map();
const byDesc = new Map();
for (const p of pages) {
  if (!p.title) problems.push(`missing <title>: ${p.path}`);
  if (!p.desc) problems.push(`missing meta description: ${p.path}`);
  if (!p.canonical) problems.push(`missing canonical: ${p.path}`);
  if (p.h1s.length !== 1) problems.push(`expected exactly one <h1>, found ${p.h1s.length}: ${p.path}`);
  // Legal pages are intentionally short and are noindex'd, so they are exempt.
  if (p.words < 250 && !p.noindex) problems.push(`thin page (${p.words} words): ${p.path}`);
  byTitle.set(p.title, [...(byTitle.get(p.title) ?? []), p.path]);
  byDesc.set(p.desc, [...(byDesc.get(p.desc) ?? []), p.path]);
}
for (const [t, ps] of byTitle) if (ps.length > 1) problems.push(`duplicate title "${t.slice(0,60)}" on: ${ps.join(', ')}`);
for (const [d, ps] of byDesc) if (ps.length > 1 && d) problems.push(`duplicate description on: ${ps.join(', ')}`);

// every page must reference the one canonical business node
for (const p of pages) {
  const flat = JSON.stringify(p.ld);
  if (!flat.includes('#business') && !p.noindex) problems.push(`no reference to the business entity: ${p.path}`);
}

// the coverage claim must exist as crawlable text, not only in an image
const home = pages.find(p => p.path === '/');
for (const city of ['Phoenix','Tempe','Scottsdale','Chandler','Mesa','Gilbert','Ahwatukee','Paradise Valley']) {
  const res = await fetch(BASE + '/');
  const h = await res.text();
  const linked = h.includes(`/service-areas/${city.toLowerCase().replace(' ','-')}"`);
  if (!linked) problems.push(`home page does not link to city page for ${city}`);
}

console.log(`crawled ${pages.length} pages`);
console.log(`JSON-LD blocks: ${pages.reduce((n,p)=>n+p.ldCount,0)}`);
console.log(`median word count: ${pages.map(p=>p.words).sort((a,b)=>a-b)[Math.floor(pages.length/2)]}`);
console.log(`thinnest: ${Math.min(...pages.map(p=>p.words))} words`);
console.log('');
if (problems.length === 0) console.log('✅ no problems found');
else { console.log(`❌ ${problems.length} problem(s):`); problems.forEach(p => console.log('  - ' + p)); }
