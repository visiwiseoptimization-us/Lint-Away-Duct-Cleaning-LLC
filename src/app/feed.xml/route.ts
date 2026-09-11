import { business } from '@/data/business';
import { articles, excerpt } from '@/data/content';

export const dynamic = 'force-static';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function GET() {
  const items = [...articles]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(
      (a) => `    <item>
      <title>${esc(a.h1)}</title>
      <link>${business.url}/blog/${a.slug}</link>
      <guid isPermaLink="true">${business.url}/blog/${a.slug}</guid>
      <pubDate>${new Date(a.date + 'T12:00:00Z').toUTCString()}</pubDate>
      <description>${esc(a.metaDescription || excerpt(a))}</description>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(business.name)} — Guides</title>
    <link>${business.url}/blog</link>
    <atom:link href="${business.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Air duct and dryer vent cleaning guides for the Phoenix Valley.</description>
    <language>en-US</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml', 'Cache-Control': 'public, s-maxage=86400' },
  });
}
