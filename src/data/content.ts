import articlesRaw from './articles.json';
import { cities, cityBySlug, type City } from './cities';
import { services, serviceBySlug, type Service } from './services';

export type Block = { type: 'h2' | 'p'; text: string };

export type Article = {
  slug: string;
  source: string;
  kind: 'article' | 'blog';
  metaTitle: string;
  metaDescription: string;
  h1: string;
  date: string;
  /** Primary city this piece targets, or null for evergreen educational pieces. */
  city: string | null;
  /** Every city named anywhere in the body — used for the internal link graph. */
  cityCities: string[];
  service: string | null;
  wordCount: number;
  blocks: Block[];
};

export const articles = articlesRaw as Article[];

export const articleBySlug = new Map(articles.map((a) => [a.slug, a]));

/** Reading time at 225 wpm, rounded up. */
export const readingMinutes = (a: Article) => Math.max(1, Math.ceil(a.wordCount / 225));

/**
 * Which city + service combinations have real supporting content behind them.
 *
 * This gate is the whole quality argument for the programmatic pages. 8 cities
 * x 4 services would be 32 URLs, but only a subset have an article to build a
 * genuine page from. Publishing the other combinations would produce near-
 * duplicate thin pages, which suppress the good ones along with themselves.
 * So a city+service page only exists where `supportingArticles` is non-empty.
 */
export function supportingArticles(citySlug: string, serviceSlug: string): Article[] {
  const city = cityBySlug.get(citySlug);
  if (!city) return [];
  return articles.filter(
    (a) => a.service === serviceSlug && (a.city === city.name || a.cityCities.includes(city.name)),
  );
}

/** Articles whose primary target is this city. */
export function articlesForCity(citySlug: string): Article[] {
  const city = cityBySlug.get(citySlug);
  if (!city) return [];
  return articles.filter((a) => a.city === city.name);
}

/** Articles that merely mention the city — weaker signal, used for "also relevant". */
export function articlesMentioningCity(citySlug: string): Article[] {
  const city = cityBySlug.get(citySlug);
  if (!city) return [];
  return articles.filter((a) => a.city !== city.name && a.cityCities.includes(city.name));
}

export function articlesForService(serviceSlug: string): Article[] {
  return articles.filter((a) => a.service === serviceSlug);
}

/** Services this city has at least one supporting article for. */
export function servicesForCity(citySlug: string): Service[] {
  return services.filter((s) => supportingArticles(citySlug, s.slug).length > 0);
}

/** Every city+service pair that earns a page. Feeds generateStaticParams. */
export const cityServicePairs: { city: string; service: string }[] = cities.flatMap((c) =>
  services
    .filter((s) => supportingArticles(c.slug, s.slug).length > 0)
    .map((s) => ({ city: c.slug, service: s.slug })),
);

/** Cities that have a supporting article for a given service. */
export function citiesForService(serviceSlug: string): City[] {
  return cities.filter((c) => supportingArticles(c.slug, serviceSlug).length > 0);
}

/**
 * Related-article picker: same service first, then same city, then recency.
 * Deliberately deterministic so the internal link graph is stable between
 * builds — a graph that reshuffles every deploy never accrues authority.
 */
export function relatedArticles(a: Article, limit = 3): Article[] {
  const scored = articles
    .filter((x) => x.slug !== a.slug)
    .map((x) => {
      let score = 0;
      if (x.service && x.service === a.service) score += 3;
      if (x.city && x.city === a.city) score += 2;
      const overlap = x.cityCities.filter((c) => a.cityCities.includes(c)).length;
      score += Math.min(overlap, 2);
      return { x, score };
    })
    .filter((s) => s.score > 0)
    .sort((p, q) => q.score - p.score || (p.x.slug < q.x.slug ? -1 : 1));
  return scored.slice(0, limit).map((s) => s.x);
}

export function serviceOf(a: Article): Service | undefined {
  return a.service ? serviceBySlug.get(a.service) : undefined;
}

export function cityOf(a: Article): City | undefined {
  if (!a.city) return undefined;
  return cities.find((c) => c.name === a.city);
}

/**
 * FAQ extraction: any h2 phrased as a question, paired with the paragraph
 * that follows it. These become FAQPage entries on article pages, which is
 * what puts the answer in front of an AI engine as a discrete Q/A pair.
 */
export function faqsFromArticle(a: Article): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  for (let i = 0; i < a.blocks.length; i++) {
    const b = a.blocks[i];
    if (b.type === 'h2' && b.text.trim().endsWith('?')) {
      const next = a.blocks[i + 1];
      if (next && next.type === 'p') out.push({ q: b.text.trim(), a: next.text.trim() });
    }
  }
  return out;
}

/** First substantive paragraph, used for excerpts and og:description fallbacks. */
export function excerpt(a: Article, max = 180): string {
  const p = a.blocks.find((b) => b.type === 'p')?.text ?? a.metaDescription;
  if (p.length <= max) return p;
  return p.slice(0, max).replace(/\s+\S*$/, '') + '…';
}
