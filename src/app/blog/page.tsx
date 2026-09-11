import type { Metadata } from 'next';
import Link from 'next/link';
import { articles, readingMinutes, excerpt } from '@/data/content';
import { cities } from '@/data/cities';
import { services } from '@/data/services';
import { business } from '@/data/business';
import JsonLd from '@/components/JsonLd';
import { breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Air Duct & Dryer Vent Guides for the Phoenix Valley',
  description:
    'Straight answers on air duct cleaning, dryer vent cleaning, costs, timing and fire risk — written for Phoenix, Tempe, Mesa, Chandler, Gilbert, Scottsdale and Ahwatukee homes and businesses.',
  alternates: { canonical: '/blog' },
};

export default function BlogIndex() {
  const byDate = [...articles].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          '@id': `${business.url}/blog#blog`,
          name: 'Lint Away Guides',
          url: `${business.url}/blog`,
          publisher: { '@id': `${business.url}/#business` },
          blogPost: byDate.map((a) => ({
            '@type': 'BlogPosting',
            headline: a.h1.slice(0, 110),
            url: `${business.url}/blog/${a.slug}`,
            datePublished: a.date,
            description: a.metaDescription,
          })),
        }}
      />
      <JsonLd data={breadcrumbNode([{ name: 'Home', path: '/' }, { name: 'Guides', path: '/blog' }])} />

      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">Guides &amp; Resources</div>
          <h1 className="page-h1">
            Straight answers, <span className="accent">no scare tactics</span>
          </h1>
          <p className="answer-block">
            {articles.length} guides on air duct cleaning and dryer vent cleaning written for
            Phoenix Valley homes and businesses — what each service actually does, what it costs
            here, how long it takes, and how often it genuinely needs doing.
          </p>
        </div>
      </section>

      <section className="prose-section">
        <div className="prose-inner">
          <div className="filter-row">
            <span className="filter-label">By city:</span>
            {cities.map((c) => (
              <Link key={c.slug} href={`/service-areas/${c.slug}`} className="pill">
                {c.name}
              </Link>
            ))}
          </div>
          <div className="filter-row">
            <span className="filter-label">By service:</span>
            {services.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="pill">
                {s.shortName}
              </Link>
            ))}
          </div>

          <ul className="article-grid">
            {byDate.map((a) => (
              <li key={a.slug}>
                <Link href={`/blog/${a.slug}`}>
                  <span className="article-card-tag">
                    {a.city ?? 'Phoenix Valley'} · {readingMinutes(a)} min
                  </span>
                  <strong>{a.h1}</strong>
                  <span className="article-card-ex">{excerpt(a, 150)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
