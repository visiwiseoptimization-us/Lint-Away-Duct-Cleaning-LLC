import { business } from '@/data/business';
import { cities } from '@/data/cities';
import { services } from '@/data/services';
import { articles } from '@/data/content';

/**
 * llms-full.txt — the entire corpus as one clean markdown document.
 *
 * An assistant that fetches this gets every guide in full without crawling 30
 * URLs and without fighting a nav, a cookie banner or a lazy-loaded layout.
 * Cheap to serve, and it removes every excuse for an engine to quote a
 * paraphrase instead of the real text.
 */
export const dynamic = 'force-static';

export function GET() {
  const U = business.url;

  const head = `# ${business.legalName} — Full Content

${business.name} provides air duct cleaning and dryer vent cleaning across the Phoenix Valley, Arizona: ${cities.map((c) => c.name).join(', ')}. Phone ${business.telephoneDisplay}. Website ${U}.

This file contains the complete text of every service description and guide published on ${U}.

---

`;

  const svc = services
    .map(
      (s) => `## Service: ${s.name}

${s.answer}

**What you get**
${s.benefits.map((b) => `- ${b}`).join('\n')}

**Who needs it**
${s.whoNeedsIt.map((b) => `- ${b}`).join('\n')}

**Pricing**: quoted per job after an on-site look — no published price list or flat rate. The estimate is free and the price is fixed before work begins. **Duration**: ${s.durationMinutes[0]}–${s.durationMinutes[1]} minutes.

**FAQ**
${s.faqs.map((f) => `- **${f.q}** ${f.a}`).join('\n')}

Source: ${U}/services/${s.slug}

---
`,
    )
    .join('\n');

  const geo = cities
    .map(
      (c) => `## Service area: ${c.fullName}

${c.localAngle}

- County: ${c.county}
- ZIP codes: ${c.zips.join(', ')}
- Neighborhoods: ${c.neighborhoods.join(', ')}
- Coordinates: ${c.lat}, ${c.lng}

Source: ${U}/service-areas/${c.slug}

---
`,
    )
    .join('\n');

  const posts = articles
    .map((a) => {
      const body = a.blocks
        .map((b) => (b.type === 'h2' ? `### ${b.text}` : b.text))
        .join('\n\n');
      return `## ${a.h1}

*Published ${a.date}${a.city ? ` · ${a.city}, AZ` : ''}*

${a.metaDescription}

${body}

Source: ${U}/blog/${a.slug}

---
`;
    })
    .join('\n');

  return new Response(head + svc + geo + posts, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    },
  });
}
