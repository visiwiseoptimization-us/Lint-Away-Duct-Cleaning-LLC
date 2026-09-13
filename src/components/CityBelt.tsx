import Link from 'next/link';
import { cityBySlug } from '@/data/cities';

/**
 * The service-area collage — a continuous right-to-left marquee.
 *
 * Two identical copies sit side by side and the track translates by exactly
 * -50%. When the animation restarts, copy two is sitting precisely where copy
 * one began, so the seam is invisible and the loop never appears to jump.
 *
 * The collage is eight equal 480px panels, so each panel carries a link to that
 * city's landing page. That turns decoration into eight real links — which
 * matters here because with no Google Maps pin those city pages are the whole
 * local footprint. The marquee pauses on hover so the links are actually
 * clickable, and stops entirely for anyone who has asked for reduced motion.
 *
 * The second copy is hidden from assistive tech and removed from the tab order,
 * so screen readers and keyboard users get eight cities, not sixteen.
 */

/** Panel order as it appears in city-collage.jpg, left to right. */
const PANELS = [
  'tempe',
  'scottsdale',
  'chandler',
  'mesa',
  'gilbert',
  'ahwatukee',
  'paradise-valley',
  'phoenix',
] as const;

function BeltCopy({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="city-belt-frame" {...(duplicate ? { 'aria-hidden': true } : {})}>
      <img
        src="/city-collage.jpg"
        alt={
          duplicate
            ? ''
            : 'The Phoenix Valley cities Lint Away serves: Tempe, Scottsdale, Chandler, Mesa, Gilbert, Ahwatukee, Paradise Valley and Phoenix'
        }
        width={3840}
        height={600}
      />
      <div className="city-belt-links">
        {PANELS.map((slug) => {
          const c = cityBySlug.get(slug);
          if (!c) return null;
          return (
            <Link
              key={slug}
              href={`/service-areas/${slug}`}
              className="city-belt-link"
              tabIndex={duplicate ? -1 : undefined}
              aria-label={
                duplicate ? undefined : `Air duct and dryer vent cleaning in ${c.fullName}`
              }
            >
              <span>{c.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function CityBelt() {
  return (
    <div className="city-belt-wrap">
      <div className="city-belt">
        <BeltCopy />
        <BeltCopy duplicate />
      </div>
    </div>
  );
}
