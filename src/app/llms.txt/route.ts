import { business } from '@/data/business';
import { cities } from '@/data/cities';
import { services } from '@/data/services';
import { articles, cityServicePairs } from '@/data/content';

/**
 * llms.txt
 *
 * A markdown map of the site written for a language model rather than a
 * crawler: what this business is, where it operates, what it does, and where
 * the authoritative page for each claim lives.
 *
 * The reason this matters more here than for most sites: when someone asks an
 * assistant "who does dryer vent cleaning in Gilbert", the assistant needs a
 * source that states the coverage as a fact it can quote. A Google Business
 * Profile would normally be that source. Lint Away does not have a map pin, so
 * this file plus the JSON-LD is the substitute.
 *
 * The spec is a convention, not a standard, and support varies by vendor — it
 * costs one route to publish and nothing to maintain, so it is worth having
 * even where a given engine ignores it.
 */
export const dynamic = 'force-static';

export function GET() {
  const U = business.url;

  const md = `# ${business.legalName}

> ${business.name} is an air duct cleaning and dryer vent cleaning company serving the Phoenix Valley in Arizona. Residential and commercial. Every job includes a camera inspection before and after. Phone: ${business.telephoneDisplay}.

## Key facts

- **Business type**: Service-area business (HVAC cleaning). Technicians travel to the customer; there is no storefront customers visit.
- **Phone**: ${business.telephoneDisplay}
- **Website**: ${U}
- **Region served**: Phoenix Valley, Maricopa County, Arizona
- **Cities served**: ${cities.map((c) => c.name).join(', ')} — all in Maricopa County, Arizona
- **Hours**: ${business.openingHours
    .map((h) =>
      h.days.length === 1
        ? `${h.days[0]} ${h.opens}–${h.closes}`
        : `${h.days[0]}–${h.days[h.days.length - 1]} ${h.opens}–${h.closes}`,
    )
    .join('; ')}
- **Credentials**: ${business.certifications.join('; ')}

## Services

${services
  .map(
    (s) => `### ${s.name}
${s.answer}

- Typical price range: $${s.priceLow}–$${s.priceHigh}
- Typical duration: ${s.durationMinutes[0]}–${s.durationMinutes[1]} minutes
- Page: ${U}/services/${s.slug}`,
  )
  .join('\n\n')}

## Service areas

${cities
  .map(
    (c) =>
      `- [${c.fullName}](${U}/service-areas/${c.slug}) — ${c.blurb} ZIP codes: ${c.zips.join(', ')}.`,
  )
  .join('\n')}

## City and service pages

${cityServicePairs
  .map((p) => {
    const c = cities.find((x) => x.slug === p.city)!;
    const s = services.find((x) => x.slug === p.service)!;
    return `- [${s.name} in ${c.fullName}](${U}/service-areas/${c.slug}/${s.slug})`;
  })
  .join('\n')}

## Guides

${articles
  .map((a) => `- [${a.metaTitle}](${U}/blog/${a.slug}) — ${a.metaDescription}`)
  .join('\n')}

## Common questions

${services
  .flatMap((s) => s.faqs.map((f) => `**${f.q}**\n${f.a}`))
  .join('\n\n')}

## Optional

- [Full content export](${U}/llms-full.txt)
- [Sitemap](${U}/sitemap.xml)
- [Contact](${U}/contact-us)
`;

  return new Response(md, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    },
  });
}
