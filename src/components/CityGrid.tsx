import Link from 'next/link';
import { cities } from '@/data/cities';

/**
 * The crawlable half of the service-area section.
 *
 * The original design showed the coverage area as a scrolling collage image.
 * That looks good and communicates nothing to a crawler or an LLM — an <img>
 * alt string is not a link and does not create an indexable page. For a
 * business with no Google Maps pin, this grid is the primary structural signal
 * that Lint Away covers these eight municipalities.
 */
export default function CityGrid() {
  return (
    <div className="city-grid-wrap">
      <ul className="city-grid">
        {cities.map((c) => (
          <li key={c.slug}>
            <Link href={`/service-areas/${c.slug}`} className="city-chip">
              <span className="city-chip-name">{c.name}</span>
              <span className="city-chip-meta">{c.county.replace(' County', ' Co.')}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="city-grid-note">
        Serving {cities.map((c) => c.name).join(', ')} and surrounding Maricopa County communities.{' '}
        <Link href="/service-areas">See full coverage →</Link>
      </p>
    </div>
  );
}
