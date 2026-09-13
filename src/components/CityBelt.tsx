import Link from 'next/link';
import { cityBySlug } from '@/data/cities';

/**
 * The service-area collage.
 *
 * The original design scrolled this image as an infinite marquee, sized by
 * HEIGHT with `width: auto`. At the collage's 6.4:1 aspect ratio that renders
 * roughly 2,600px wide, so only three or four cities were ever on screen and
 * the rest slid past. The whole point of the strip is that a visitor sees their
 * own city in the list, which a carousel actively works against.
 *
 * So it is static and full width now: all eight panels visible at once.
 *
 * The collage is exactly eight equal 480px panels, so each one gets an
 * invisible link laid over it at 12.5% width. That turns what was pure
 * decoration into eight real links to eight real landing pages — which matters
 * more here than usual, because with no Google Maps pin these city pages are
 * the entire local footprint.
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

export default function CityBelt() {
  return (
    <div className="city-belt-wrap">
      <div className="city-belt-scroll">
        <div className="city-belt-frame">
          <img
            src="/city-collage.jpg"
            alt="The Phoenix Valley cities Lint Away serves: Tempe, Scottsdale, Chandler, Mesa, Gilbert, Ahwatukee, Paradise Valley and Phoenix"
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
                  aria-label={`Air duct and dryer vent cleaning in ${c.fullName}`}
                >
                  <span>{c.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
