/**
 * The service layer. Slugs match the URLs already linked from the existing
 * WordPress nav, so inbound links and any existing rankings survive the move.
 */

export type Service = {
  slug: string;
  name: string;
  /** Used in <h1> and titles where the segment reads better than the name. */
  shortName: string;
  segment: 'Residential' | 'Commercial';
  icon: string;
  summary: string;
  /**
   * Answer-first paragraph. This is the block written to be lifted verbatim
   * by an AI answer engine: definitional first sentence, no throat-clearing,
   * entity and location stated inside the sentence rather than assumed.
   */
  answer: string;
  benefits: string[];
  whoNeedsIt: string[];
  /** Drives the FAQPage schema on every service and city+service page. */
  faqs: { q: string; a: string }[];
  /** Typical range shown as an Offer. Honest ranges beat fake precision. */
  priceLow: number;
  priceHigh: number;
  durationMinutes: [number, number];
};

export const services: Service[] = [
  {
    slug: 'residential-dryer-vent-cleaning',
    name: 'Residential Dryer Vent Cleaning',
    shortName: 'Dryer Vent Cleaning',
    segment: 'Residential',
    icon: '🏠',
    summary:
      'Clogged dryer vents cause 15,000+ house fires a year. We clear yours completely — with camera confirmation before and after.',
    answer:
      'Residential dryer vent cleaning is the removal of accumulated lint and debris from the full length of a home’s dryer exhaust duct, from the dryer connection through to the exterior termination. Lint Away performs this service across the Phoenix Valley, including Phoenix, Tempe, Mesa, Chandler, Gilbert, Scottsdale and Ahwatukee. The U.S. Fire Administration attributes roughly 2,900 residential fires a year to clothes dryers, with failure to clean the vent as the leading contributing factor. Most Arizona homes need this service once a year.',
    benefits: [
      'Removes the lint accumulation that causes an estimated 2,900 dryer fires a year',
      'Cuts drying time, which lowers the energy the dryer draws per load',
      'Extends dryer lifespan by letting the appliance vent at its designed airflow',
      'Before-and-after camera footage so you can see the actual condition of the run',
    ],
    whoNeedsIt: [
      'Any home where a load takes more than one cycle to dry',
      'Homes with a vent run longer than 15 feet or with more than two bends',
      'Condos and townhouses with shared or roof-terminated vent runs',
      'Any home that has not had the vent serviced in 12 months',
    ],
    faqs: [
      {
        q: 'How often should a dryer vent be cleaned in Arizona?',
        a: 'Once a year for a typical single-family household. Homes running more than five loads a week, households with pets, and any home with a vent run longer than 15 feet should move to every six to nine months.',
      },
      {
        q: 'How long does dryer vent cleaning take?',
        a: 'Most residential dryer vent cleanings take 45 to 90 minutes, including the camera inspection before and after. Longer roof-terminated runs on two-story homes can reach two hours.',
      },
      {
        q: 'What are the signs a dryer vent needs cleaning?',
        a: 'Clothes taking more than one cycle to dry, the dryer or laundry room feeling unusually hot during a cycle, a burning or musty smell, lint appearing around the door seal, and the vent flap outside not opening fully when the dryer runs.',
      },
      {
        q: 'Can I clean my own dryer vent?',
        a: 'A consumer brush kit will reach the first few feet of a straight run. It will not clear a bend, will not reach a roof termination, and gives you no way to verify the run is actually clear. Professional service uses a rotating brush on a powered line plus a camera to confirm the result.',
      },
    ],
    priceLow: 99,
    priceHigh: 249,
    durationMinutes: [45, 120],
  },
  {
    slug: 'commercial-dryer-vent-cleaning',
    name: 'Commercial Dryer Vent Cleaning',
    shortName: 'Commercial Dryer Vent',
    segment: 'Commercial',
    icon: '🏢',
    summary:
      'Laundromats, apartment complexes, hotels — we schedule around your operations so you never lose a business day.',
    answer:
      'Commercial dryer vent cleaning is scheduled maintenance of high-volume dryer exhaust systems in laundromats, multifamily properties, hotels, gyms, salons and healthcare facilities. Lint Away services commercial properties throughout the Phoenix Valley. Commercial dryers process many times the volume of a household unit, so lint accumulates in weeks rather than months, and shared or stacked vent runs in multifamily buildings carry fire and liability exposure that a residential schedule does not address. Most commercial operations need service every three to six months.',
    benefits: [
      'Reduces the fire and liability exposure that shared vent stacks create',
      'Keeps dryers at rated throughput so machines are not tied up on double cycles',
      'Supports insurance and fire-code documentation with dated inspection records',
      'Scheduled around your operating hours so no revenue day is lost',
    ],
    whoNeedsIt: [
      'Laundromats and commercial laundry operations',
      'Apartment complexes and multifamily properties with in-unit or shared laundry',
      'Hotels, motels and short-term rental portfolios',
      'Gyms, salons, spas and healthcare facilities with on-site laundry',
    ],
    faqs: [
      {
        q: 'How often do commercial dryer vents need cleaning?',
        a: 'Laundromats and high-volume commercial laundry: every three months. Apartment complexes and hotels: every six months. Gyms, salons and medical offices with lighter laundry loads: annually, or semi-annually if the dryers run daily.',
      },
      {
        q: 'Who is responsible for dryer vent cleaning in an apartment complex?',
        a: 'In nearly all Arizona multifamily arrangements the property owner or management company carries responsibility for shared and in-wall vent runs, since residents have no access to them. Lease language can shift responsibility for the visible transition hose to the tenant, but not for the run inside the structure.',
      },
      {
        q: 'Will service interrupt our operations?',
        a: 'No. We schedule around operating hours, including overnight and early-morning windows for laundromats and hotels, and work unit by unit on multifamily properties so no more than a small block of machines is offline at a time.',
      },
    ],
    priceLow: 349,
    priceHigh: 2500,
    durationMinutes: [120, 480],
  },
  {
    slug: 'residential-air-duct-cleaning',
    name: 'Residential Air Duct Cleaning',
    shortName: 'Air Duct Cleaning',
    segment: 'Residential',
    icon: '💨',
    summary:
      'Remove years of dust, allergens, and debris from your HVAC system. Breathe air that’s actually clean — verified with our camera system.',
    answer:
      'Residential air duct cleaning is the removal of dust, debris and biological buildup from a home’s HVAC supply and return ductwork, plenums, registers and blower assembly. Lint Away performs this service throughout the Phoenix Valley. In Arizona the driver is fine desert dust and monsoon-season particulate, which loads a system faster than in most U.S. climates. Most Valley homes benefit from duct cleaning every three to five years, sooner after renovation, after a rodent or pest event, or when visible dust discharges from the registers.',
    benefits: [
      'Removes accumulated desert dust, allergens and construction debris from the full system',
      'Restores designed airflow, which reduces how long the system runs to hit setpoint',
      'Camera verification before and after, so the result is documented rather than claimed',
      'Addresses the blower and plenum, not only the register openings',
    ],
    whoNeedsIt: [
      'Homes where dust visibly discharges from supply registers',
      'Any home following a renovation, re-roof or major construction',
      'Homes after a rodent, insect or nesting event in the ductwork',
      'Homes that have never had the system cleaned, or where the history is unknown',
    ],
    faqs: [
      {
        q: 'How much does air duct cleaning cost in Phoenix?',
        a: 'Most Phoenix-area homes fall between $350 and $700 for a full system. The range is driven by the number of HVAC systems, the number of supply and return vents, the square footage, and whether the ductwork is accessible. Quotes far below that range usually cover register vacuuming only, not the full system.',
      },
      {
        q: 'How long does air duct cleaning take?',
        a: 'Two to four hours for a typical single-system home. Larger homes and multi-zone systems run four to six hours. A one-hour visit is not a full-system cleaning.',
      },
      {
        q: 'How often should air ducts be cleaned?',
        a: 'Every three to five years for a typical Valley home. Move it sooner after renovation, after a pest event, if anyone in the home has significant dust sensitivity, or if dust is visibly discharging from the registers.',
      },
      {
        q: 'What is the difference between air duct cleaning and duct sealing?',
        a: 'Cleaning removes what is inside the ducts. Sealing closes gaps and leaks in the duct system so conditioned air stops escaping into attics and wall cavities. They solve different problems — cleaning addresses air quality and debris, sealing addresses efficiency loss — and a home can need one, the other, or both.',
      },
    ],
    priceLow: 349,
    priceHigh: 799,
    durationMinutes: [120, 360],
  },
  {
    slug: 'commercial-air-duct-cleaning',
    name: 'Commercial Air Duct Cleaning',
    shortName: 'Commercial Air Duct',
    segment: 'Commercial',
    icon: '🏗️',
    summary:
      'Full HVAC duct cleaning for offices, retail spaces, and facilities. Improved air quality means healthier employees and lower energy bills.',
    answer:
      'Commercial air duct cleaning is the cleaning of HVAC duct systems in offices, retail spaces, medical facilities, restaurants and industrial buildings. Lint Away services commercial properties across the Phoenix Valley. Commercial systems move far more air through far more linear duct than a residence, and occupancy density means indoor air quality has direct consequences for staff, customers and — in clinical settings — patients. Most commercial properties need duct cleaning every two to five years depending on the use category.',
    benefits: [
      'Improves indoor air quality across a densely occupied space',
      'Restores HVAC efficiency, which is a measurable line on the utility bill',
      'Supports indoor air quality documentation for clinical and food-service settings',
      'Scheduled after hours or in phases so the business keeps operating',
    ],
    whoNeedsIt: [
      'Medical and dental offices, clinics and urgent care',
      'Offices, coworking spaces and retail',
      'Restaurants and food service',
      'Schools, childcare facilities and gyms',
    ],
    faqs: [
      {
        q: 'How often should a commercial property have its air ducts cleaned?',
        a: 'Medical and dental facilities: every two to three years, or annually in higher-risk clinical settings. Restaurants and food service: every two years. Offices and retail: every three to five years. Schools and childcare: every two to three years. Industrial and manufacturing depends entirely on what is in the air.',
      },
      {
        q: 'Why do medical offices need a higher standard?',
        a: 'Patients arriving at a medical office are already managing a health concern, and clinical spaces concentrate people in enclosed rooms for extended periods. Contaminated supply air in that setting is a patient-safety issue rather than a comfort issue, which is why clinical duct cleaning uses tighter containment and full documentation.',
      },
      {
        q: 'Can this be done without closing the business?',
        a: 'Yes. Commercial duct cleaning is normally phased by zone or scheduled outside operating hours. For medical facilities we work around patient scheduling, and for restaurants we work between service periods.',
      },
    ],
    priceLow: 800,
    priceHigh: 6000,
    durationMinutes: [240, 960],
  },
];

export const serviceBySlug = new Map(services.map((s) => [s.slug, s]));
export const serviceSlugs = services.map((s) => s.slug);
export const residentialServices = services.filter((s) => s.segment === 'Residential');
export const commercialServices = services.filter((s) => s.segment === 'Commercial');
