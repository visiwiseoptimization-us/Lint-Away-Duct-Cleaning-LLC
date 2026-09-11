import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cityBySlug } from '@/data/cities';
import { serviceBySlug } from '@/data/services';
import {
  cityServicePairs,
  supportingArticles,
  servicesForCity,
  excerpt,
  readingMinutes,
} from '@/data/content';
import { business } from '@/data/business';
import JsonLd from '@/components/JsonLd';
import QuoteForm from '@/components/QuoteForm';
import CtaBanner from '@/components/CtaBanner';
import { serviceNode, faqNode, breadcrumbNode } from '@/lib/schema';

/**
 * City + service pages.
 *
 * These only exist for pairs that have a supporting article behind them
 * (see `cityServicePairs`). That is a deliberate constraint: the alternative is
 * 32 near-identical URLs, which is the textbook doorway-page pattern. Fewer,
 * genuinely differentiated pages outrank a larger set of thin ones, and they
 * are also the ones an AI answer engine will actually cite, because there is
 * something specific on them to cite.
 */

export function generateStaticParams() {
  return cityServicePairs;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; service: string }>;
}): Promise<Metadata> {
  const { city, service } = await params;
  const c = cityBySlug.get(city);
  const s = serviceBySlug.get(service);
  if (!c || !s) return {};
  return {
    title: `${s.name} in ${c.fullName}`,
    description: `${s.name} in ${c.name}, Arizona. ${s.summary} Call ${business.telephoneDisplay}.`,
    alternates: { canonical: `/service-areas/${c.slug}/${s.slug}` },
    other: {
      'geo.region': 'US-AZ',
      'geo.placename': c.fullName,
      'geo.position': `${c.lat};${c.lng}`,
      ICBM: `${c.lat}, ${c.lng}`,
    },
  };
}

export default async function CityServicePage({
  params,
}: {
  params: Promise<{ city: string; service: string }>;
}) {
  const { city, service } = await params;
  const c = cityBySlug.get(city);
  const s = serviceBySlug.get(service);
  if (!c || !s) notFound();

  const support = supportingArticles(c.slug, s.slug);
  if (support.length === 0) notFound();

  const otherServices = servicesForCity(c.slug).filter((x) => x.slug !== s.slug);
  const pageUrl = `${business.url}/service-areas/${c.slug}/${s.slug}`;

  const faqs = [
    {
      q: `Do you offer ${s.name.toLowerCase()} in ${c.name}?`,
      a: `Yes. ${business.name} provides ${s.name.toLowerCase()} throughout ${c.fullName}, including ${c.neighborhoods.slice(0, 3).join(', ')} and ZIP codes ${c.zips.slice(0, 5).join(', ')}. Call ${business.telephoneDisplay} to schedule.`,
    },
    ...s.faqs,
  ];

  return (
    <>
      <JsonLd data={serviceNode(s, c)} />
      <JsonLd data={faqNode(faqs, pageUrl)} />
      <JsonLd
        data={breadcrumbNode([
          { name: 'Home', path: '/' },
          { name: 'Service Areas', path: '/service-areas' },
          { name: c.name, path: `/service-areas/${c.slug}` },
          { name: s.shortName, path: `/service-areas/${c.slug}/${s.slug}` },
        ])}
      />

      <section className="page-hero">
        <div className="page-hero-inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/service-areas">Service Areas</Link>
            <span>/</span>
            <Link href={`/service-areas/${c.slug}`}>{c.name}</Link>
            <span>/</span>
            <span aria-current="page">{s.shortName}</span>
          </nav>
          <div className="section-label">
            {s.segment} · {c.fullName}
          </div>
          <h1 className="page-h1">
            {s.name} in <span className="accent">{c.fullName}</span>
          </h1>

          <p className="answer-block">
            {business.name} provides {s.name.toLowerCase()} throughout {c.fullName}, including{' '}
            {c.neighborhoods.slice(0, 3).join(', ')} and ZIP codes {c.zips.slice(0, 5).join(', ')}.{' '}
            {s.answer.split('. ').slice(2).join('. ')}
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
          <h2>
            Why {s.shortName.toLowerCase()} is different in {c.name}
          </h2>
          <p className="lede">{c.localAngle}</p>

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
              <h3>Who needs it in {c.name}</h3>
              <ul className="check-list">
                {s.whoNeedsIt.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="fact-strip">
            <div className="fact">
              <div className="fact-num">
                ${s.priceLow}–${s.priceHigh}
              </div>
              <div className="fact-label">Typical {c.name} range</div>
            </div>
            <div className="fact">
              <div className="fact-num">
                {s.durationMinutes[0]}–{s.durationMinutes[1]} min
              </div>
              <div className="fact-label">Typical duration</div>
            </div>
            <div className="fact">
              <div className="fact-num">{c.zips.length}</div>
              <div className="fact-label">{c.name} ZIPs covered</div>
            </div>
          </div>

          <h2>
            In-depth guides for {c.name} {s.segment.toLowerCase()} properties
          </h2>
          <ul className="link-grid">
            {support.map((a) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`}>
                  <strong>{a.h1}</strong>
                  <span>
                    {excerpt(a, 130)} · {readingMinutes(a)} min read
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <h2 id="faq">
            {s.shortName} in {c.name} — frequently asked
          </h2>
          <div className="faq-list">
            {faqs.map((f) => (
              <details key={f.q} className="faq-item">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <h2>Areas of {c.name} we cover</h2>
          <p className="muted">
            {c.neighborhoods.join(' · ')}
            <br />
            <span className="zips">ZIP codes: {c.zips.join(', ')}</span>
          </p>

          {otherServices.length > 0 && (
            <>
              <h2>Other services in {c.name}</h2>
              <ul className="link-grid">
                {otherServices.map((x) => (
                  <li key={x.slug}>
                    <Link href={`/service-areas/${c.slug}/${x.slug}`}>
                      <strong>
                        {x.icon} {x.name} in {c.name}
                      </strong>
                      <span>{x.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <p className="muted">
            <Link href={`/service-areas/${c.slug}`}>
              All services in {c.name} →
            </Link>{' '}
            ·{' '}
            <Link href={`/services/${s.slug}`}>
              {s.name} across the Valley →
            </Link>
          </p>
        </div>
      </section>

      <QuoteForm
        defaultCity={c.slug}
        defaultService={s.slug}
        heading={`${s.shortName} quote for ${c.name}`}
        sub={`Give us the basics and we will come back with a real number for your ${c.name} property.`}
      />
      <CtaBanner />
    </>
  );
}
