import type { Metadata } from 'next';
import { business } from '@/data/business';
import { cities } from '@/data/cities';
import QuoteForm from '@/components/QuoteForm';
import JsonLd from '@/components/JsonLd';
import { breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Contact — Get a Free Quote',
  description: `Call ${business.telephoneDisplay} or request a free quote. Lint Away serves the whole Phoenix Valley with same-day slots available.`,
  alternates: { canonical: '/contact-us' },
};

export default function Contact() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          '@id': `${business.url}/contact-us#page`,
          about: { '@id': `${business.url}/#business` },
          name: 'Contact Lint Away Duct Cleaning',
        }}
      />
      <JsonLd data={breadcrumbNode([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact-us' }])} />

      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">Contact</div>
          <h1 className="page-h1">
            Get a <span className="accent">free quote</span>
          </h1>
          <p className="answer-block">
            Call {business.telephoneDisplay} or send the form below. {business.name} serves{' '}
            {cities.map((c) => c.name).join(', ')} and the surrounding Maricopa County area, weekdays{' '}
            {business.openingHours[0].opens}–{business.openingHours[0].closes} and Saturdays{' '}
            {business.openingHours[1].opens}–{business.openingHours[1].closes}. As a mobile service
            we come to you — there is no shop to visit.
          </p>
          <div className="page-hero-actions">
            <a href={business.telephoneHref} className="btn btn-red">
              Call {business.telephoneDisplay}
            </a>
            <a href={`mailto:${business.email}`} className="btn btn-ghost">
              {business.email}
            </a>
          </div>
        </div>
      </section>

      <QuoteForm />
    </>
  );
}
