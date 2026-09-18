/**
 * Single source of truth for NAP (Name, Address, Phone) and entity identity.
 *
 * Lint Away is a SERVICE AREA BUSINESS with no storefront customers visit.
 * Every consumer of this file must therefore emit `areaServed` and must NOT
 * emit a `PostalAddress` with a street line. Publishing a street address you
 * do not serve customers at is the single fastest way to get a Google Business
 * Profile suspended, and it poisons the entity graph that AI answer engines
 * build from your structured data.
 */

export const business = {
  legalName: 'Lint Away Duct Cleaning LLC',
  name: 'Lint Away Duct Cleaning',
  shortName: 'Lint Away',
  tagline: 'Cleaning the valley, one duct at a time.',

  // Canonical origin. Every canonical URL, sitemap entry and JSON-LD @id
  // derives from this, so it is the only place a domain change has to happen.
  url: 'https://lintawayductcleaning.com',

  telephone: '+1-480-877-9808',
  telephoneDisplay: '(480) 877-9808',
  telephoneHref: 'tel:4808779808',
  email: 'info@lintawayductcleaning.com',

  // No street address by design — see the note above.
  address: {
    locality: 'Phoenix',
    region: 'AZ',
    regionName: 'Arizona',
    postalCode: '85001',
    country: 'US',
  },

  // Centroid of the service radius, not an office. Used for GeoCircle.
  geo: { lat: 33.4484, lng: -112.074 },
  serviceRadiusMeters: 48000, // ~30 miles, covers the Valley

  // No priceRange. Every job is quoted after an on-site look, so there is no
  // range to publish — and `priceRange: '$$'` in the LocalBusiness node is
  // exactly the kind of unsupported claim this site avoids elsewhere.
  foundingDate: '2019',

  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '18:00' },
    { days: ['Saturday'], opens: '08:00', closes: '16:00' },
  ],

  // sameAs feeds the entity graph. AI answer engines lean on these to decide
  // whether two mentions of "Lint Away" are the same business.
  sameAs: [
    'https://www.tiktok.com/@lintawayductcleaning',
    'https://www.instagram.com/lintawayductcleaning',
    'https://www.facebook.com/lintawayductcleaning',
    'https://www.youtube.com/@lintawayductcleaning',
  ],

  socialProof: {
    tiktokViews: '500M+',
    rating: 4.9,
    reviewCount: 187,
  },

  certifications: [
    'NADCA member (National Air Duct Cleaners Association)',
    'Licensed, bonded and insured in the State of Arizona',
    'Before-and-after camera verification on every job',
  ],
} as const;

export const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'meta-externalagent',
  'cohere-ai',
  'DuckAssistBot',
  'MistralAI-User',
] as const;
