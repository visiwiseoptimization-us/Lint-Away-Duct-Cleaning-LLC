/**
 * The geo layer.
 *
 * Every city here becomes a crawlable landing page with its own coordinates,
 * ZIP list and neighborhood list. For a service-area business with no map pin,
 * these pages ARE the local footprint — there is nothing else telling Google or
 * an LLM that Lint Away covers Gilbert.
 *
 * `blurb` and `localAngle` must stay genuinely different per city. Templated
 * text with the city name swapped in is doorway-page spam; Google has filtered
 * it since 2015 and LLMs deduplicate it away to a single citation.
 */

export type City = {
  slug: string;
  name: string;
  /** Full name used in prose and titles, e.g. "Tempe, AZ" */
  fullName: string;
  county: string;
  lat: number;
  lng: number;
  population: number;
  zips: string[];
  neighborhoods: string[];
  /** One-sentence positioning used on cards and meta descriptions. */
  blurb: string;
  /** Why duct/vent work is specifically different in this city. Real, not filler. */
  localAngle: string;
  /** Cities adjacent enough to cross-link. Builds the internal geo graph. */
  nearby: string[];
};

export const cities: City[] = [
  {
    slug: 'phoenix',
    name: 'Phoenix',
    fullName: 'Phoenix, AZ',
    county: 'Maricopa County',
    lat: 33.4484,
    lng: -112.074,
    population: 1650070,
    zips: ['85003', '85004', '85006', '85008', '85012', '85016', '85018', '85020', '85021', '85023', '85028', '85032', '85044', '85048'],
    neighborhoods: ['Arcadia', 'Biltmore', 'Desert Ridge', 'Downtown', 'Encanto', 'Moon Valley', 'North Central', 'Roosevelt Row', 'Sunnyslope'],
    blurb: 'Full-Valley coverage from the urban core out to Desert Ridge and Ahwatukee.',
    localAngle:
      'Phoenix has the widest housing-stock spread in the Valley — 1950s block homes with original ductwork sit a few miles from 2020s builds with high-static-pressure systems. The right approach differs sharply between them, and so does what a technician finds in the vent.',
    nearby: ['scottsdale', 'tempe', 'paradise-valley', 'ahwatukee'],
  },
  {
    slug: 'tempe',
    name: 'Tempe',
    fullName: 'Tempe, AZ',
    county: 'Maricopa County',
    lat: 33.4255,
    lng: -111.94,
    population: 180587,
    zips: ['85281', '85282', '85283', '85284', '85287'],
    neighborhoods: ['Downtown Tempe', 'Maple-Ash', 'Mitchell Park', 'North Tempe', 'The Lakes', 'Warner Ranch'],
    blurb: 'High-density condos, student rentals and long-held family homes, all on one grid.',
    localAngle:
      'Tempe runs denser than almost anywhere else in the Valley. Condo and townhouse vent runs are longer, take more bends and often pass through shared walls — every one of those factors accelerates lint accumulation compared to a detached home with a short exterior run.',
    nearby: ['phoenix', 'mesa', 'chandler', 'scottsdale'],
  },
  {
    slug: 'scottsdale',
    name: 'Scottsdale',
    fullName: 'Scottsdale, AZ',
    county: 'Maricopa County',
    lat: 33.4942,
    lng: -111.9261,
    population: 241361,
    zips: ['85250', '85251', '85254', '85255', '85257', '85258', '85259', '85260', '85262', '85266'],
    neighborhoods: ['DC Ranch', 'Gainey Ranch', 'Grayhawk', 'McCormick Ranch', 'Old Town', 'Troon North'],
    blurb: 'Large-footprint homes, multi-zone HVAC and a heavy multifamily portfolio.',
    localAngle:
      'North Scottsdale homes frequently run two or three separate HVAC zones with independent duct trunks, which means a single-system quote will always under-scope the job. The multifamily corridor along Scottsdale Road carries a different problem entirely: shared dryer vent stacks with real liability exposure.',
    nearby: ['phoenix', 'paradise-valley', 'tempe', 'mesa'],
  },
  {
    slug: 'chandler',
    name: 'Chandler',
    fullName: 'Chandler, AZ',
    county: 'Maricopa County',
    lat: 33.3062,
    lng: -111.8413,
    population: 275987,
    zips: ['85224', '85225', '85226', '85248', '85249', '85286'],
    neighborhoods: ['Andersen Springs', 'Chandler Downtown', 'Fulton Ranch', 'Ocotillo', 'Sun Lakes', 'Warner Ranch'],
    blurb: 'Master-planned neighborhoods plus a dense commercial and light-industrial base.',
    localAngle:
      'Chandler grew fast in the 1995–2010 window, which means a very large share of its homes hit the 15-to-25-year mark together — precisely when original flex duct starts sagging and dryer transition hose starts failing. The commercial corridor adds restaurants, gyms and hotels with genuinely different service intervals.',
    nearby: ['gilbert', 'mesa', 'tempe', 'ahwatukee'],
  },
  {
    slug: 'mesa',
    name: 'Mesa',
    fullName: 'Mesa, AZ',
    county: 'Maricopa County',
    lat: 33.4152,
    lng: -111.8315,
    population: 504258,
    zips: ['85201', '85202', '85203', '85204', '85205', '85206', '85207', '85208', '85209', '85210', '85212', '85213', '85215'],
    neighborhoods: ['Dobson Ranch', 'Eastmark', 'Las Sendas', 'Lehi', 'Red Mountain', 'Superstition Springs'],
    blurb: 'The Valley’s widest range of home ages, from 1960s ranch to brand-new Eastmark.',
    localAngle:
      'Mesa is the clearest example in the metro of how much home age changes the job. West Mesa’s mid-century homes often still have the original metal trunk with decades of accumulation; Eastmark builds from the last ten years have tight, efficient systems where the problem is almost always the dryer run, not the ducts.',
    nearby: ['gilbert', 'chandler', 'tempe', 'scottsdale'],
  },
  {
    slug: 'gilbert',
    name: 'Gilbert',
    fullName: 'Gilbert, AZ',
    county: 'Maricopa County',
    lat: 33.3528,
    lng: -111.789,
    population: 275904,
    zips: ['85233', '85234', '85295', '85296', '85297', '85298'],
    neighborhoods: ['Agritopia', 'Heritage District', 'Morrison Ranch', 'Power Ranch', 'Seville', 'Val Vista Lakes'],
    blurb: 'One of Arizona’s fastest-growing business communities, and a lot of new-build housing.',
    localAngle:
      'Gilbert’s hospitality, healthcare, fitness and food-service growth has produced a commercial base where dryer vent maintenance is a compliance question, not a comfort one. On the residential side, the town’s newer stock means most homes here need vent service well before they need duct service.',
    nearby: ['chandler', 'mesa', 'tempe'],
  },
  {
    slug: 'ahwatukee',
    name: 'Ahwatukee',
    fullName: 'Ahwatukee, AZ',
    county: 'Maricopa County',
    lat: 33.332,
    lng: -111.984,
    population: 77000,
    zips: ['85044', '85045', '85048'],
    neighborhoods: ['Ahwatukee Foothills', 'Club West', 'Lakewood', 'Mountain Park Ranch', 'The Foothills'],
    blurb: 'The Foothills community tucked against South Mountain, with its own dust profile.',
    localAngle:
      'Sitting up against South Mountain gives Ahwatukee a genuinely different intake environment. Homes here pull in finer mineral dust off the preserve year-round, and the community’s hillside lots often force longer, more angled dryer runs than a flat-lot build would need.',
    nearby: ['phoenix', 'chandler', 'tempe'],
  },
  {
    slug: 'paradise-valley',
    name: 'Paradise Valley',
    fullName: 'Paradise Valley, AZ',
    county: 'Maricopa County',
    lat: 33.5312,
    lng: -111.9426,
    population: 12658,
    zips: ['85253'],
    neighborhoods: ['Camelback', 'Clearwater Hills', 'Cheney Estates', 'Mummy Mountain'],
    blurb: 'Large estate properties with multi-zone systems and long duct runs.',
    localAngle:
      'Estate properties in Paradise Valley routinely run four or more HVAC zones across a single residence, with duct runs long enough that static pressure — not debris — is often the real efficiency culprit. Scoping these correctly takes a full system inspection before any number gets quoted.',
    nearby: ['scottsdale', 'phoenix'],
  },
];

export const cityBySlug = new Map(cities.map((c) => [c.slug, c]));
export const cityByName = new Map(cities.map((c) => [c.name, c]));
export const citySlugs = cities.map((c) => c.slug);
