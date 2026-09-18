import type { Metadata } from 'next';
import Link from 'next/link';
import { business } from '@/data/business';
import { cities } from '@/data/cities';
import JsonLd from '@/components/JsonLd';
import CtaBanner from '@/components/CtaBanner';
import QuoteForm from '@/components/QuoteForm';
import { breadcrumbNode } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About Lint Away Duct Cleaning',
  description:
    'Locally owned, camera-verified air duct and dryer vent cleaning for the Phoenix Valley. Who we are, how we work, and why we film every job.',
  alternates: { canonical: '/about-us' },
};

export default function About() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          '@id': `${business.url}/about-us#page`,
          mainEntity: { '@id': `${business.url}/#business` },
          name: 'About Lint Away Duct Cleaning',
        }}
      />
      <JsonLd data={breadcrumbNode([{ name: 'Home', path: '/' }, { name: 'About', path: '/about-us' }])} />

      <section className="page-hero">
        <div className="page-hero-inner">
          <div className="section-label">About Us</div>
          <h1 className="page-h1">
            Locally owned. <span className="accent">Camera verified.</span>
          </h1>
          <p className="answer-block">
            {business.legalName} is a locally owned air duct and dryer vent cleaning company serving
            the Phoenix Valley since {business.foundingDate}. We film every job — before, during and
            after — because in this industry the work happens inside a wall where the customer
            cannot see it, and a photo is the only honest proof that it was done.
          </p>
        </div>
      </section>

      <section className="prose-section">
        <div className="prose-inner">
          <h2>Why we film everything</h2>
          <p>
            Duct and vent work has a structural trust problem: the customer cannot inspect the
            result. That gap is what lets low-quote operators vacuum four registers, call it a full
            system clean, and leave. Our answer is a camera inspection at the start and another at
            the end, handed to the customer. It is also why our TikTok has passed{' '}
            {business.socialProof.tiktokViews} views — the footage is genuinely interesting, and it
            keeps us honest.
          </p>

          <h2>How we work</h2>
          <ul className="check-list">
            {business.certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
            <li>Written quote before any work starts — no on-site upsell script</li>
            <li>Scheduling around your day, including same-day slots where available</li>
          </ul>

          <h2>Where we work</h2>
          <p>
            We are a mobile service, so there is no shop to visit — we come to you. We cover{' '}
            {cities.length} Phoenix Valley municipalities:{' '}
            {cities.map((c, i) => (
              <span key={c.slug}>
                {i > 0 && ', '}
                <Link href={`/service-areas/${c.slug}`}>{c.name}</Link>
              </span>
            ))}
            , plus surrounding Maricopa County communities.
          </p>
        </div>
      </section>

      <CtaBanner />
      <QuoteForm
        heading="Work with us"
        sub="Tell us what you need and we will come back with a real number — usually within one business hour."
      />
    </>
  );
}
