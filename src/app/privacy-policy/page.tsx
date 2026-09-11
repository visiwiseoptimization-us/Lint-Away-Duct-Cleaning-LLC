import type { Metadata } from 'next';
import { business } from '@/data/business';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${business.name} handles the information you submit.`,
  alternates: { canonical: '/privacy-policy' },
  robots: { index: false, follow: true },
};

export default function Privacy() {
  return (
    <section className="prose-section">
      <div className="prose-inner">
        <h1>Privacy Policy</h1>
        <p className="muted">Last updated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>

        <h2>What we collect</h2>
        <p>
          When you submit a quote request we collect your name, phone number, email address, the
          city and service you selected, and anything you write in the message field. We also record
          the page the request came from and the browser user-agent string, which we use to
          understand which parts of the site are working.
        </p>

        <h2>What we do with it</h2>
        <p>
          We use it to quote and schedule your job, and to follow up about that job. We do not sell
          it, rent it, or add you to a marketing list you did not ask for.
        </p>

        <h2>Where it is stored</h2>
        <p>
          Quote requests are stored in a private database that only {business.legalName} can read.
          Notification emails are sent to our own inbox. The website itself is hosted on Vercel.
        </p>

        <h2>Removing your information</h2>
        <p>
          Email <a href={`mailto:${business.email}`}>{business.email}</a> or call{' '}
          <a href={business.telephoneHref}>{business.telephoneDisplay}</a> and we will delete your
          record.
        </p>
      </div>
    </section>
  );
}
