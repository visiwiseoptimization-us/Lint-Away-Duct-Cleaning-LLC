/**
 * JSON-LD builders.
 *
 * Design rules this file follows, all of which matter specifically for a
 * service-area business that has no pin on Google Maps:
 *
 * 1. ONE canonical business node, given a stable @id (`{url}/#business`), and
 *    referenced by @id everywhere else. Re-declaring the business inline on
 *    every page creates competing entities; referencing one node builds a
 *    single strong entity that both Google's Knowledge Graph and an LLM's
 *    retrieval index can resolve.
 * 2. `areaServed` carries a GeoCircle plus explicit City nodes. The GeoCircle
 *    states the radius; the City list states the named places. Search engines
 *    use different ones, so emit both.
 * 3. No `PostalAddress.streetAddress` anywhere. A SAB that publishes a street
 *    address it does not serve from risks profile suspension.
 * 4. `@graph` on the root layout rather than a stack of separate <script>
 *    blocks, so relationships between nodes are explicit rather than inferred.
 */

import { business } from '@/data/business';
import { cities, type City } from '@/data/cities';
import type { Service } from '@/data/services';
import type { Article } from '@/data/content';

const U = business.url;

export const ids = {
  business: `${U}/#business`,
  website: `${U}/#website`,
  organization: `${U}/#organization`,
};

const cityNode = (c: City) => ({
  '@type': 'City',
  name: c.name,
  '@id': `${U}/service-areas/${c.slug}#place`,
  address: {
    '@type': 'PostalAddress',
    addressLocality: c.name,
    addressRegion: business.address.region,
    addressCountry: business.address.country,
  },
  geo: { '@type': 'GeoCoordinates', latitude: c.lat, longitude: c.lng },
});

/** The single canonical business entity. */
export function businessNode() {
  return {
    '@type': ['HVACBusiness', 'LocalBusiness'],
    '@id': ids.business,
    name: business.name,
    legalName: business.legalName,
    url: U,
    telephone: business.telephone,
    email: business.email,
    description:
      'Air duct cleaning and dryer vent cleaning for residential and commercial properties across the Phoenix Valley, including Phoenix, Tempe, Mesa, Chandler, Gilbert, Scottsdale, Ahwatukee and Paradise Valley.',
    slogan: business.tagline,
    priceRange: business.priceRange,
    foundingDate: business.foundingDate,
    image: `${U}/van.png`,
    logo: { '@type': 'ImageObject', url: `${U}/van.png` },

    // Service-area business: locality/region only, never a street line.
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },

    // The radius the business actually covers.
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: business.geo.lat,
        longitude: business.geo.lng,
      },
      geoRadius: business.serviceRadiusMeters,
    },

    // The named places inside it.
    areaServed: cities.map(cityNode),

    openingHoursSpecification: business.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),

    sameAs: [...business.sameAs],

    knowsAbout: [
      'Air duct cleaning',
      'Dryer vent cleaning',
      'HVAC duct maintenance',
      'Indoor air quality',
      'Dryer fire prevention',
      'Commercial HVAC cleaning',
    ],

    hasCredential: business.certifications.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c,
    })),

    contactPoint: {
      '@type': 'ContactPoint',
      telephone: business.telephone,
      contactType: 'customer service',
      areaServed: 'US-AZ',
      availableLanguage: ['English', 'Spanish'],
    },
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    url: U,
    name: business.name,
    publisher: { '@id': ids.business },
    inLanguage: 'en-US',
  };
}

/** Root graph, emitted once in the layout. */
export function rootGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [businessNode(), websiteNode()],
  };
}

export function serviceNode(service: Service, city?: City) {
  const where = city ? ` in ${city.fullName}` : ' across the Phoenix Valley';
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': city
      ? `${U}/service-areas/${city.slug}/${service.slug}#service`
      : `${U}/services/${service.slug}#service`,
    name: city ? `${service.name} in ${city.name}, AZ` : service.name,
    serviceType: service.name,
    description: service.answer,
    provider: { '@id': ids.business },
    areaServed: city ? cityNode(city) : cities.map(cityNode),
    audience: {
      '@type': 'Audience',
      audienceType: service.segment === 'Residential' ? 'Homeowners' : 'Business owners and property managers',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: service.priceLow,
        maxPrice: service.priceHigh,
        priceCurrency: 'USD',
      },
      availability: 'https://schema.org/InStock',
      areaServed: city ? city.fullName : 'Phoenix Valley, AZ',
      seller: { '@id': ids.business },
    },
    termsOfService: `${U}/contact-us`,
    hoursAvailable: business.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Typical duration',
        value: `${service.durationMinutes[0]}–${service.durationMinutes[1]} minutes`,
      },
      { '@type': 'PropertyValue', name: 'Coverage', value: `${service.name}${where}` },
    ],
  };
}

export function faqNode(faqs: { q: string; a: string }[], pageUrl: string) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbNode(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${U}${t.path}`,
    })),
  };
}

export function articleNode(a: Article, faqs: { q: string; a: string }[]) {
  const url = `${U}/blog/${a.slug}`;
  const mentions = a.cityCities
    .map((n) => cities.find((c) => c.name === n))
    .filter((c): c is City => Boolean(c))
    .map(cityNode);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: a.h1.slice(0, 110),
    alternativeHeadline: a.metaTitle,
    description: a.metaDescription,
    datePublished: a.date,
    dateModified: a.date,
    wordCount: a.wordCount,
    inLanguage: 'en-US',
    author: { '@id': ids.business },
    publisher: { '@id': ids.business },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    isPartOf: { '@id': ids.website },
    about: mentions.length ? mentions : undefined,
    // `speakable` marks the sentences an assistant should read aloud, and in
    // practice flags the passages worth quoting.
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.answer-block', '.article-lede'],
    },
    ...(faqs.length
      ? {
          hasPart: {
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        }
      : {}),
  };
}

/** Place node for a city landing page. */
export function cityPageNode(c: City, svcs: Service[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${U}/service-areas/${c.slug}#webpage`,
    name: `Air Duct & Dryer Vent Cleaning in ${c.fullName}`,
    description: `${business.name} serves ${c.fullName} and surrounding ${c.county} communities.`,
    isPartOf: { '@id': ids.website },
    about: cityNode(c),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: svcs.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Service',
          name: `${s.name} in ${c.name}`,
          url: `${U}/service-areas/${c.slug}/${s.slug}`,
          provider: { '@id': ids.business },
          areaServed: cityNode(c),
        },
      })),
    },
  };
}
