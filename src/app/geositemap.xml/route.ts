import { business } from '@/data/business';
import { cities } from '@/data/cities';

/**
 * Geo sitemap.
 *
 * A standard sitemap says a URL exists. A geo sitemap says where that URL is
 * about, using the Geo extension namespace. It is read by local-search
 * aggregators and by several map-data vendors that feed business listings —
 * which matters disproportionately for a business without its own map pin.
 */
export const dynamic = 'force-static';

export function GET() {
  const entries = cities
    .map(
      (c) => `  <url>
    <loc>${business.url}/service-areas/${c.slug}</loc>
    <geo:geo>
      <geo:format>kml</geo:format>
    </geo:geo>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:geo="http://www.google.com/geo/schemas/sitemap/1.0">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, s-maxage=86400' },
  });
}
