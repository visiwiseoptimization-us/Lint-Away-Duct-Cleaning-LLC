import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { services, serviceBySlug, serviceSlugs } from '@/data/services';
import { citiesForService, articlesForService, excerpt } from '@/data/content';
import { business } from '@/data/business';
import JsonLd from '@/components/JsonLd';
import QuoteForm from '@/components/QuoteForm';
import CtaBanner from '@/components/CtaBanner';
import { serviceNode, faqNode, breadcrumbNode } from '@/lib/schema';

export function generateStaticParams() {
  return serviceSlugs.map((service) => ({ service }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service: slug } = await params;
  const s = serviceBySlug.get(slug);
  if (!s) return {};
  return {
    title: `${s.name} in the Phoenix Valley`,
    description: s.summary,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: {
      title: `${s.name} | ${business.name}`,
      description: s.summary,
      url: `${business.url}/services/${s.slug}`,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service: slug } = await params;
  const s = serviceBySlug.get(slug);
  if (!s) notFound();

  const cityList = citiesForService(s.slug);
  const related = articlesForService(s.slug);
  const pageUrl = `${business.url}/services/${s.slug}`;
  const siblings = services.filter((x) => x.slug !== s.slug);

  return (
    <>
      <JsonLd data={serviceNode(s)} />
      <JsonLd data={faqNode(s.faqs, pageUrl)} />
      <JsonLd
        data={breadcrumbNode([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: s.name, path: `/services/${s.slug}` },
        ])}
      />

      <section className="page-hero">
        <div className="page-hero-inner">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/services">Services</Link>
            <span>/</span>
            <span aria-current="page">{s.shortName}</span>
          </nav>
          <div className="section-label">{s.segment}</div>
          <h1 className="page-h1">
            {s.name} <span className="accent">in the Phoenix Valley</span>
          </h1>

          {/* The answer block. Written to be lifted whole by an AI answer
              engine: it defines the term, names the provider and names the
              places, all inside the first three sentences. */}
          <p className="answer-block">{s.answer}</p>

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
          <div className="two-col">
            <div>
              <h2>What you get</h2>
              <ul className="check-list">
                {s.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Who needs it</h2>
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
              <div className="fact-label">Typical range</div>
            </div>
            <div className="fact">
              <div className="fact-num">
                {s.durationMinutes[0]}–{s.durationMinutes[1]} min
              </div>
              <div className="fact-label">Typical duration</div>
            </div>
            <div className="fact">
              <div className="fact-num">{cityList.length || 8}</div>
              <div className="fact-label">Cities covered</div>
            </div>
          </div>

          {cityList.length > 0 && (
            <>
              <h2>{s.shortName} by city</h2>
              <p className="muted">
                Each city page covers what is specific to that area — housing stock, vent runs,
                and the conditions that actually change the job.
              </p>
              <ul className="link-grid">
                {cityList.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/service-areas/${c.slug}/${s.slug}`}>
                      <strong>
                        {s.shortName} in {c.name}
                      </strong>
                      <span>{c.blurb}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {s.faqs.length > 0 && (
            <>
              <h2 id="faq">Frequently asked</h2>
              <div className="faq-list">
                {s.faqs.map((f) => (
                  <details key={f.q} className="faq-item">
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </>
          )}

          {related.length > 0 && (
            <>
              <h2>Guides on {s.shortName.toLowerCase()}</h2>
              <ul className="link-grid">
                {related.map((a) => (
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

          <h2>Other services</h2>
          <ul className="link-grid">
            {siblings.map((x) => (
              <li key={x.slug}>
                <Link href={`/services/${x.slug}`}>
                  <strong>
                    {x.icon} {x.name}
                  </strong>
                  <span>{x.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <QuoteForm
        defaultService={s.slug}
        heading={`Get a quote for ${s.shortName.toLowerCase()}`}
        sub="Tell us the basics and we will come back with a real number — usually within one business hour."
      />
      <CtaBanner />
    </>
  );
}
