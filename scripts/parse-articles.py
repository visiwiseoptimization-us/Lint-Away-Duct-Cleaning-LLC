import re, json, os, unicodedata

SRC = '/mnt/user-data/uploads/Downloads/VWO/ladc-extracted/_ALL_LADC.txt'
OUT = 'content/articles'
os.makedirs(OUT, exist_ok=True)

CITIES = {
    'Phoenix':'phoenix','Tempe':'tempe','Scottsdale':'scottsdale','Chandler':'chandler',
    'Mesa':'mesa','Gilbert':'gilbert','Ahwatukee':'ahwatukee','Paradise Valley':'paradise-valley',
}
# order matters: most specific first
SERVICES = [
    ('commercial-dryer-vent-cleaning',  ['commercial dryer vent','apartment dryer vent','laundromat dryer vent','multifamily dryer']),
    ('commercial-air-duct-cleaning',    ['commercial air duct','medical office air duct','commercial properties','commercial property']),
    ('residential-dryer-vent-cleaning', ['residential dryer vent','dryer vent cleaning in','dryer vent cleaning after','dryer vent']),
    ('residential-air-duct-cleaning',   ['air duct cleaning in','air duct cleaning cost','what does air duct','how long does air duct','air duct cleaning vs','air duct']),
]

def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii','ignore').decode()
    s = re.sub(r"[^\w\s-]", '', s).strip().lower()
    return re.sub(r"[\s_]+", '-', s)[:70].strip('-')

def is_heading(line):
    w = line.split()
    if not (2 <= len(w) <= 14): return False
    if line.endswith(('.', ':', ',', ';', '?')) and not line.endswith('?'): return False
    if line.endswith('.'): return False
    # headings are title-ish: most words capitalized
    caps = sum(1 for x in w if x[:1].isupper())
    return caps >= max(2, int(len(w)*0.5))

raw = open(SRC, encoding='utf8').read()
chunks = [c for c in raw.split('<<<FILE:') if c.strip()]
articles = []
seen_meta = {}

for ch in chunks:
    fname, body = ch.split('>>>', 1)
    fname = fname.strip()
    lines = [l.strip() for l in body.split('\n') if l.strip()]
    meta_title = meta_desc = None
    rest = []
    for l in lines:
        if l.lower().startswith('meta title:') and not meta_title:
            meta_title = l.split(':',1)[1].strip()
        elif l.lower().startswith('meta description:') and not meta_desc:
            meta_desc = l.split(':',1)[1].strip()
        else:
            rest.append(l)
    if not rest: continue
    h1 = rest[0]
    body_lines = rest[1:]

    # dedupe near-identical articles by meta title + first body line
    key = (meta_title or h1)[:60].lower()
    if key in seen_meta:
        # keep the longer one
        prev = seen_meta[key]
        if len(body) <= prev['_len']:
            continue
        articles = [a for a in articles if a['slug'] != prev['slug']]

    blocks = []
    for l in body_lines:
        blocks.append({'type':'h2' if is_heading(l) else 'p', 'text': l})

    text_all = (h1 + ' ' + ' '.join(body_lines))
    low = text_all.lower()

    # primary city = most mentioned in title, else most mentioned in body
    city = None
    head = (meta_title or '') + ' ' + h1
    hits = [c for c in CITIES if re.search(r'\b'+re.escape(c)+r'\b', head)]
    if hits:
        # prefer the more specific municipality over the metro name
        hits.sort(key=lambda c: (c in ('Phoenix','Arizona'), -head.lower().find(c.lower())))
        city = hits[0]
    if not city:
        counts = {c: len(re.findall(r'\b'+re.escape(c)+r'\b', text_all)) for c in CITIES}
        if max(counts.values()) >= 3:
            city = max(counts, key=counts.get)

    service = None
    hay = ((meta_title or '') + ' ' + h1).lower()
    for sid, pats in SERVICES:
        if any(p in hay for p in pats):
            service = sid; break
    if not service:
        for sid, pats in SERVICES:
            if any(p in low for p in pats):
                service = sid; break

    cities_mentioned = sorted({c for c in CITIES if re.search(r'\b'+re.escape(c)+r'\b', text_all)})

    # month/date from filename
    m = re.search(r'-(June|July|August)-', fname)
    month = m.group(1) if m else ('August' if 'Commercial' in fname else 'July')
    date = {'June':'2026-06-22','July':'2026-07-20','August':'2026-08-19'}[month]

    kind = 'blog' if 'Onsite Blog' in fname or 'Onsite-Blog' in fname else 'article'
    slug = slugify(meta_title or h1)

    a = {
        'slug': slug, 'source': fname, 'kind': kind,
        'metaTitle': meta_title or h1, 'metaDescription': meta_desc or '',
        'h1': h1, 'date': date,
        'city': city, 'cityCities': cities_mentioned, 'service': service,
        'wordCount': len(text_all.split()),
        'blocks': blocks,
        '_len': len(body),
    }
    seen_meta[key] = a
    articles.append(a)

for a in articles: a.pop('_len', None)
articles.sort(key=lambda x: (x['date'], x['slug']))
json.dump(articles, open('src/data/articles.json','w'), indent=2, ensure_ascii=False)

print(f'{len(articles)} articles')
for a in articles:
    print(f"  {a['slug'][:52]:<54} city={str(a['city']):<16} svc={str(a['service'])}")
