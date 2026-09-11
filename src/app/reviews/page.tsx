import type { Metadata } from 'next';
import Link from 'next/link';
import { business } from '@/data/business';
import JsonLd from '@/components/JsonLd';
import CtaBanner from '@/components/CtaBanner';
import { breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Reviews',
  description: `What Phoenix Valley customers say about ${business.name}.`,
  alternates: { canonical: '/reviews' },
};

/**
 * NOTE FOR THE CLIENT HANDOFF
 *
 * This page deliberately does NOT emit AggregateRating or Review structured
 * data yet. Marking up review counts that are not sourced from verifiable,
 * on-page, first-party reviews is a manual-action risk under Google's review
 * snippet policy, and inventing reviews is not something we will publish.
 *
 * When real reviews are collected — through the quote-flow follow-up, Google,
 * or a review platform — drop them into a `reviews` array in src/data and
 * uncomment the AggregateRating node. The plumbing is ready; only the honest
 * data is missing.
 */
export default function Reviews() {
  return (
    <>
      <JsonLd data={breadcrumbNode([{ name: 'Home', path: '/' }, { name: 'Reviews', path: '/reviews' }])} />

      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">Social Proof</div>
          <h1 className="page-h1">
            {business.socialProof.tiktokViews} people <span className="accent">have watched us clean</span>
          </h1>
          <p className="answer-block">
            The clearest evidence of how {business.name} works is the footage itself. We film every
            job — the before, the pull, and the after — and publish it unedited. If you want to know
            what is actually inside a Phoenix Valley duct system, the videos answer that faster than
            any testimonial could.
          </p>
          <div className="page-hero-actions">
            {business.sameAs.map((href) => (
              <a key={href} href={href} className="btn btn-ghost" target="_blank" rel="noopener">
                {href.includes('tiktok')
                  ? 'Watch on TikTok'
                  : href.includes('youtube')
                    ? 'YouTube'
                    : href.includes('instagram')
                      ? 'Instagram'
                      : 'Facebook'}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="prose-section">
        <div className="prose-inner">
          <h2>Leave a review</h2>
          <p>
            If we have worked at your property, a review genuinely helps — we do not have a
            storefront, so word of mouth and search are how people find us. Call{' '}
            <a href={business.telephoneHref}>{business.telephoneDisplay}</a> or{' '}
            <Link href="/contact-us">get in touch</Link> and we will send you the link.
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
