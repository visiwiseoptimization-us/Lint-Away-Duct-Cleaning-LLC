import type { Metadata } from 'next';
import { business } from '@/data/business';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: `Terms of use for ${business.url}.`,
  alternates: { canonical: '/terms' },
  robots: { index: false, follow: true },
};

export default function Terms() {
  return (
    <section className="prose-section">
      <div className="prose-inner">
        <h1>Terms &amp; Conditions</h1>
        <p className="muted">Last updated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>

        <h2>Quotes and pricing</h2>
        <p>
          This site does not publish prices, price ranges or flat rates. Every job is quoted
          individually after we look at the property, because the work depends on the number of
          systems, vent count, run length, accessibility and condition. The estimate is free, and the
          price is confirmed in writing before any work begins.
        </p>

        <h2>Guides and general information</h2>
        <p>
          The guides published on this site are general information about air duct and dryer vent
          maintenance. They are not a substitute for an inspection of your specific property.
        </p>

        <h2>Contact</h2>
        <p>
          {business.legalName} — <a href={business.telephoneHref}>{business.telephoneDisplay}</a> ·{' '}
          <a href={`mailto:${business.email}`}>{business.email}</a>
        </p>
      </div>
    </section>
  );
}
