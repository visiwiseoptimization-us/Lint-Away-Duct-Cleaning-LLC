import type { MetadataRoute } from 'next';
import { business, AI_CRAWLERS } from '@/data/business';

/**
 * robots.txt
 *
 * The AI crawlers are allowed EXPLICITLY rather than relying on the wildcard.
 * Several of them (Google-Extended, Applebot-Extended, CCBot) are opt-out by
 * user-agent, and some publishers block them by default via a CMS setting or a
 * CDN rule. For a business that wants to be cited in AI answers, being named
 * and allowed is the intent made unambiguous.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      ...AI_CRAWLERS.map((ua) => ({ userAgent: ua, allow: '/', disallow: ['/api/'] })),
    ],
    sitemap: [`${business.url}/sitemap.xml`, `${business.url}/geositemap.xml`],
    host: business.url,
  };
}
