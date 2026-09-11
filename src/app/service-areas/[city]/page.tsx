import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cityBySlug, citySlugs, cities } from '@/data/cities';
import {
  servicesForCity,
  articlesForCity,
  articlesMentioningCity,
  excerpt,
} from '@/data/content';
import { services } from '@/data/services';
import { business } from '@/data/business';
import JsonLd from '@/components/JsonLd';
import QuoteForm from '@/components/QuoteForm';
import CtaBanner from '@/components/CtaBanner';
import { cityPageNode, breadcrumbNode, faqNode } from '@/lib/schema';

export function generateStaticParams() {
  return citySlugs.map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const c = cityBySlug.get(slug);
  if (!c) return {};
  return {
    title: `Air Duct & Dryer Vent Cleaning in ${c.fullName}`,
    description: `${business.name} serves ${c.fullName} — ${c.blurb} Camera-verified air duct and dryer vent cleaning, same-day slots available.`,
    alternates: { canonical: `/service-areas/${c.slug}` },
    other: {
      'geo.region': 'US-AZ',
      'geo.placename': c.fullName,
      'geo.position': `${c.lat};${c.lng}`,
      ICBM: `${c.lat}, ${c.lng}`,
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const c = cityBySlug.get(slug);
  if (!c) notFound();

  const covered = servicesForCity(c.slug);
  const primary = articlesForCity(c.slug);
  const secondary = articlesMentioningCity(c.slug);
  const nearby = c.nearby.map((s) => cityBySlug.get(s)).filter(Boolean);
  const pageUrl = `${business.url}/service-areas/${c.slug}`;

  // City-scoped FAQs: take the top question from each service and localise it.
  const faqs = [
    {
      q: `Does Lint Away serve ${c.name}, AZ?`,
      a: `Yes. ${business.name} provides residential and commercial air duct cleaning and dryer vent cleaning throughout ${c.fullName}, including ${c.neighborhoods.slice(0, 4).join(', ')}, and the surrounding ${c.county} area. Same-day appointments are frequently available. Call ${business.telephoneDisplay} to schedule.`,
    },
    {
      q: `What ZIP codes in ${c.name} do you cover?`,
      a: `We cover all of ${c.name}, including ZIP codes ${c.zips.join(', ')}.`,
    },
    ...services.slice(0, 2).map((s) => ({
      q: s.faqs[0].q.replace(/in Arizona|in Phoenix/, `in ${c.name}`),
      a: s.faqs[0].a,
    })),
  ];

  return (
    <>
      <JsonLd data={cityPageNode(c, covered.length ? covered : services)} />
      <JsonLd data={faqNode(faqs, pageUrl)} />
      <JsonLd
        data={breadcrumbNode([
          { name: 'Home', path: '/' },
          { name: 'Service Areas', path: '/service-areas' },
          { name: c.name, path: `/service-areas/${c.slug}` },
        ])}
      />

      <section className="page-hero">
        <div className="page-hero-inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/service-areas">Service Areas</Link>
            <span>/</span>
            <span aria-current="page">{c.name}</span>
          </nav>
          <div className="section-label">{c.county}</div>
          <h1 className="page-h1">
            Air Duct &amp; Dryer Vent Cleaning in <span className="accent">{c.fullName}</span>
          </h1>

          <p className="answer-block">
            {business.name} provides residential and commercial air duct cleaning and dryer vent
            cleaning throughout {c.fullName} and the surrounding {c.county} area, including{' '}
            {c.neighborhoods.slice(0, 4).join(', ')}. Every job includes a camera inspection before
            and after. Same-day appointments are frequently available. Call{' '}
            {business.telephoneDisplay} to schedule.
          </p>

          <div className="page-hero-actions">
            <a href={business.telephoneHref} className="btn btn-red">
              Call {business.telephoneDisplay}
            </a>
            <Link href="#quote" className="btn btn-ghost">
              Get a Free Quote →
            </Link>
          </div>
        </div>
      </section>

      <section className="prose-section">
        <div className="prose-inner">
          <h2>What makes {c.name} different</h2>
          <p className="lede">{c.localAngle}</p>

          <div className="fact-strip">
            <div className="fact">
              <div className="fact-num">{c.zips.length}</div>
              <div className="fact-label">ZIP codes covered</div>
            </div>
            <div className="fact">
              <div className="fact-num">{c.population.toLocaleString()}</div>
              <div className="fact-label">Residents</div>
            </div>
            <div className="fact">
              <div className="fact-num">Same day</div>
              <div className="fact-label">Availability</div>
            </div>
          </div>

          <h2>Services in {c.name}</h2>
          <ul className="link-grid">
            {services.map((s) => {
              const hasDeepPage = covered.some((x) => x.slug === s.slug);
              return (
                <li key={s.slug}>
                  <Link
                    href={
                      hasDeepPage
                        ? `/service-areas/${c.slug}/${s.slug}`
                        : `/services/${s.slug}`
                    }
                  >
                    <strong>
                      {s.icon} {s.name} in {c.name}
                    </strong>
                    <span>{s.summary}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <h2>Neighborhoods and ZIP codes we cover in {c.name}</h2>
          <p className="muted">
            {c.neighborhoods.join(' · ')}
            <br />
            <span className="zips">ZIP codes: {c.zips.join(', ')}</span>
          </p>

          {primary.length > 0 && (
            <>
              <h2>{c.name} guides</h2>
              <ul className="link-grid">
                {primary.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/blog/${a.slug}`}>
                      <strong>{a.h1}</strong>
                      <span>{excerpt(a, 120)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {secondary.length > 0 && (
            <>
              <h2>Also relevant in {c.name}</h2>
              <ul className="link-list">
                {secondary.slice(0, 6).map((a) => (
                  <li key={a.slug}>
                    <Link href={`/blog/${a.slug}`}>{a.h1}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <h2 id="faq">Frequently asked in {c.name}</h2>
          <div className="faq-list">
            {faqs.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          {nearby.length > 0 && (
            <>
              <h2>Nearby areas we serve</h2>
              <ul className="link-grid">
                {nearby.map((n) => (
                  <li key={n!.slug}>
                    <Link href={`/service-areas/${n!.slug}`}>
                      <strong>{n!.name}</strong>
                      <span>{n!.blurb}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="muted">
            <Link href="/service-areas">See all {cities.length} cities we serve →</Link>
          </p>
        </div>
      </section>

      <QuoteForm
        defaultCity={c.slug}
        heading={`Get a quote in ${c.name}`}
        sub={`Tell us what you need and we will come back with a real number. We are in ${c.name} regularly, so same-day is usually possible.`}
      />
      <CtaBanner />
    </>
  );
}
