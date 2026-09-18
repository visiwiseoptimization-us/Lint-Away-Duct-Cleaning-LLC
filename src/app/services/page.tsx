import type { Metadata } from 'next';
import Link from 'next/link';
import { services } from '@/data/services';
import { citiesForService } from '@/data/content';
import { business } from '@/data/business';
import JsonLd from '@/components/JsonLd';
import QuoteForm from '@/components/QuoteForm';
import CtaBanner from '@/components/CtaBanner';
import { breadcrumbNode, serviceNode } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Air Duct & Dryer Vent Cleaning Services',
  description:
    'Residential and commercial air duct cleaning and dryer vent cleaning across the Phoenix Valley. Camera-verified before and after on every job.',
  alternates: { canonical: '/services' },
};

export default function ServicesIndex() {
  return (
    <>
      {services.map((s) => (
        <JsonLd key={s.slug} data={serviceNode(s)} />
      ))}
      <JsonLd data={breadcrumbNode([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])} />

      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">What We Do</div>
          <h1 className="page-h1">
            Every service. <span className="accent">One standard of clean.</span>
          </h1>
          <p className="answer-block">
            {business.name} provides four services across the Phoenix Valley: residential and
            commercial dryer vent cleaning, and residential and commercial air duct cleaning. Every
            job includes a camera inspection before and after, so the result is documented rather
            than described.
          </p>
          <div className="page-hero-actions">
            <a href={business.telephoneHref} className="btn btn-red">
              Call {business.telephoneDisplay}
            </a>
            <Link href="#quote" className="btn btn-ghost">Get a Free Quote →</Link>
          </div>
        </div>
      </section>

      <section className="prose-section">
        <div className="prose-inner">
          {services.map((s) => {
            const cs = citiesForService(s.slug);
            return (
              <div key={s.slug} className="service-block">
                <h2>
                  {s.icon} {s.name}
                </h2>
                <p className="lede">{s.answer}</p>
                <div className="two-col">
                  <div>
                    <h3>What you get</h3>
                    <ul className="check-list">
                      {s.benefits.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>Typical job</h3>
                    <ul className="check-list">
                      <li>
                        {s.durationMinutes[0]}–{s.durationMinutes[1]} minutes on site
                      </li>
                      <li>Camera inspection before and after</li>
                      <li>Free estimate, quoted before any work starts</li>
                    </ul>
                  </div>
                </div>
                <p>
                  <Link href={`/services/${s.slug}`} className="btn btn-ghost btn-sm">
                    Full details on {s.shortName.toLowerCase()} →
                  </Link>
                </p>
                {cs.length > 0 && (
                  <p className="muted">
                    City pages:{' '}
                    {cs.map((c, i) => (
                      <span key={c.slug}>
                        {i > 0 && ' · '}
                        <Link href={`/service-areas/${c.slug}/${s.slug}`}>{c.name}</Link>
                      </span>
                    ))}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <CtaBanner />
      <QuoteForm />
    </>
  );
}
