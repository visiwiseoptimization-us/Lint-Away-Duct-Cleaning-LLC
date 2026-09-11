import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  articles,
  articleBySlug,
  faqsFromArticle,
  relatedArticles,
  readingMinutes,
  serviceOf,
  cityOf,
} from '@/data/content';
import { business } from '@/data/business';
import JsonLd from '@/components/JsonLd';
import QuoteForm from '@/components/QuoteForm';
import { articleNode, breadcrumbNode, breadcrumbNode as crumbs } from '@/lib/schema';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug.get(slug);
  if (!a) return {};
  return {
    title: a.metaTitle,
    description: a.metaDescription,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: {
      type: 'article',
      title: a.metaTitle,
      description: a.metaDescription,
      url: `${business.url}/blog/${a.slug}`,
      publishedTime: a.date,
      authors: [business.legalName],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articleBySlug.get(slug);
  if (!a) notFound();

  const faqs = faqsFromArticle(a);
  const related = relatedArticles(a);
  const svc = serviceOf(a);
  const city = cityOf(a);

  // The lede is the first paragraph; it carries the `article-lede` class so the
  // speakable spec in the JSON-LD points at something real.
  const [lede, ...rest] = (() => {
    const idx = a.blocks.findIndex((b) => b.type === 'p');
    return [a.blocks[idx], ...a.blocks.slice(idx + 1)];
  })();

  return (
    <>
      <JsonLd data={articleNode(a, faqs)} />
      <JsonLd
        data={crumbs([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/blog' },
          { name: a.h1, path: `/blog/${a.slug}` },
        ])}
      />

      <article>
        <section className="page-hero article-hero">
          <div className="page-hero-inner">
            <nav className="crumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/blog">Guides</Link>
              {city && (
                <>
                  <span>/</span>
                  <Link href={`/service-areas/${city.slug}`}>{city.name}</Link>
                </>
              )}
            </nav>
            <div className="section-label">
              {svc ? svc.name : 'Guide'}
              {city ? ` · ${city.fullName}` : ''}
            </div>
            <h1 className="page-h1 article-h1">{a.h1}</h1>
            <div className="article-meta">
              <time dateTime={a.date}>
                {new Date(a.date + 'T12:00:00Z').toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>·</span>
              <span>{readingMinutes(a)} min read</span>
              <span>·</span>
              <span>{business.name}</span>
            </div>
          </div>
        </section>

        <section className="prose-section">
          <div className="prose-inner article-body">
            {lede && <p className="article-lede">{lede.text}</p>}

            {(svc || city) && (
              <aside className="inline-cta">
                <div>
                  <strong>
                    Need {svc ? svc.shortName.toLowerCase() : 'this service'}
                    {city ? ` in ${city.name}` : ''}?
                  </strong>
                  <span>Camera-verified work, same-day slots.</span>
                </div>
                <a href={business.telephoneHref} className="btn btn-red btn-sm">
                  {business.telephoneDisplay}
                </a>
              </aside>
            )}

            {rest.map((b, i) =>
              b.type === 'h2' ? (
                <h2 key={i} id={`s-${i}`}>
                  {b.text}
                </h2>
              ) : (
                <p key={i}>{b.text}</p>
              ),
            )}

            <div className="article-links">
              {svc && (
                <Link href={`/services/${svc.slug}`} className="pill">
                  {svc.name}
                </Link>
              )}
              {city && (
                <Link href={`/service-areas/${city.slug}`} className="pill">
                  Service in {city.name}
                </Link>
              )}
              {svc && city && (
                <Link href={`/service-areas/${city.slug}/${svc.slug}`} className="pill">
                  {svc.shortName} in {city.name}
                </Link>
              )}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="prose-section alt">
            <div className="prose-inner">
              <h2>Related guides</h2>
              <ul className="link-grid">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}`}>
                      <strong>{r.h1}</strong>
                      <span>{r.metaDescription}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </article>

      <QuoteForm
        defaultCity={city?.slug}
        defaultService={svc?.slug}
        heading="Got a question this guide did not answer?"
        sub="Send it over with your details and we will answer it directly — no call script."
      />
    </>
  );
}
