import type { Metadata } from 'next';
import Link from 'next/link';
import { cities } from '@/data/cities';
import { servicesForCity } from '@/data/content';
import { business } from '@/data/business';
import JsonLd from '@/components/JsonLd';
import QuoteForm from '@/components/QuoteForm';
import CtaBanner from '@/components/CtaBanner';
import { breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Service Areas — Air Duct & Dryer Vent Cleaning Across the Phoenix Valley',
  description:
    'Lint Away serves Phoenix, Tempe, Mesa, Chandler, Gilbert, Scottsdale, Ahwatukee and Paradise Valley. See coverage, ZIP codes and neighborhoods for each city.',
  alternates: { canonical: '/service-areas' },
};

export default function ServiceAreasIndex() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          '@id': `${business.url}/service-areas#list`,
          name: 'Lint Away Duct Cleaning service areas',
          numberOfItems: cities.length,
          itemListElement: cities.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: `${c.fullName}`,
            url: `${business.url}/service-areas/${c.slug}`,
          })),
        }}
      />
      <JsonLd
        data={breadcrumbNode([
          { name: 'Home', path: '/' },
          { name: 'Service Areas', path: '/service-areas' },
        ])}
      />

      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">Where We Serve</div>
          <h1 className="page-h1">
            All of Phoenix Valley, <span className="accent">covered</span>
          </h1>
          <p className="answer-block">
            {business.name} serves {cities.length} Phoenix Valley municipalities:{' '}
            {cities.map((c) => c.name).join(', ')}, plus surrounding Maricopa County communities.
            Same-day appointments are frequently available in every city. Call{' '}
            {business.telephoneDisplay} to schedule.
          </p>
        </div>
      </section>

      <section className="prose-section">
        <div className="prose-inner">
          <div className="city-cards">
            {cities.map((c) => {
              const svcs = servicesForCity(c.slug);
              return (
                <div key={c.slug} className="city-card">
                  <h2>
                    <Link href={`/service-areas/${c.slug}`}>{c.fullName}</Link>
                  </h2>
                  <p className="muted">{c.blurb}</p>
                  <p className="zips">
                    {c.zips.length} ZIP codes · {c.neighborhoods.slice(0, 3).join(', ')}
                  </p>
                  {svcs.length > 0 && (
                    <ul className="link-list compact">
                      {svcs.map((s) => (
                        <li key={s.slug}>
                          <Link href={`/service-areas/${c.slug}/${s.slug}`}>
                            {s.shortName} in {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <QuoteForm />
      <CtaBanner />
    </>
  );
}
