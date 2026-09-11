import { business } from '@/data/business';
import { cities } from '@/data/cities';

/** KML placemark file referenced by the geo sitemap. */
export const dynamic = 'force-static';

export function GET() {
  const placemarks = cities
    .map(
      (c) => `    <Placemark>
      <name>${business.name} — ${c.fullName}</name>
      <description><![CDATA[Air duct and dryer vent cleaning in ${c.fullName}. ${c.blurb} <a href="${business.url}/service-areas/${c.slug}">Coverage details</a>.]]></description>
      <Point><coordinates>${c.lng},${c.lat},0</coordinates></Point>
    </Placemark>`,
    )
    .join('\n');

  const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${business.name} Service Areas</name>
    <description>Phoenix Valley service coverage for ${business.legalName}.</description>
${placemarks}
  </Document>
</kml>`;

  return new Response(kml, {
    headers: {
      'Content-Type': 'application/vnd.google-earth.kml+xml',
      'Cache-Control': 'public, s-maxage=86400',
    },
  });
}
