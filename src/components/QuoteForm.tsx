'use client';

import { useState } from 'react';
import { cities } from '@/data/cities';
import { services } from '@/data/services';
import { business } from '@/data/business';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * The site's only lead capture.
 *
 * Before this, every CTA on the site was a `tel:` link, which means a visitor
 * who arrives outside business hours, or who does not want to phone a stranger,
 * leaves no trace at all. Given the article corpus is built to pull organic
 * search traffic around the clock, that was the largest conversion leak on the
 * property.
 */
export default function QuoteForm({
  defaultCity,
  defaultService,
  heading = 'Get a Free Quote',
  sub = 'Tell us what you need and we will come back with a real number — usually within one business hour.',
}: {
  defaultCity?: string;
  defaultService?: string;
  heading?: string;
  sub?: string;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong.');
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'sent') {
    return (
      <section id="quote" className="quote-section">
        <div className="quote-inner">
          <div className="quote-success">
            <div className="quote-success-icon">✓</div>
            <h2>Request received</h2>
            <p>
              We have your details and will be in touch shortly. If it is urgent, call{' '}
              <a href={business.telephoneHref}>{business.telephoneDisplay}</a> and we will get you on
              the schedule today.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="quote" className="quote-section">
      <div className="quote-inner">
        <div className="quote-copy reveal-left">
          <div className="section-label">Free Estimate</div>
          <h2 className="quote-h2">{heading}</h2>
          <p className="quote-sub">{sub}</p>
          <ul className="quote-points">
            <li>No obligation, no pressure, no upsell script</li>
            <li>Camera inspection included on every job</li>
            <li>Same-day slots across the Phoenix Valley</li>
          </ul>
          <div className="quote-or">
            Prefer to talk?{' '}
            <a href={business.telephoneHref} className="quote-phone">
              {business.telephoneDisplay}
            </a>
          </div>
        </div>

        <form className="quote-form reveal-right" onSubmit={onSubmit} noValidate={false}>
          {/* Honeypot: bots fill every field they find, humans never see this one. */}
          <div className="hp-field" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="quote-row">
            <div className="quote-field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" required autoComplete="name" />
            </div>
            <div className="quote-field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" required autoComplete="tel" />
            </div>
          </div>

          <div className="quote-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>

          <div className="quote-row">
            <div className="quote-field">
              <label htmlFor="city">City</label>
              <select id="city" name="city" required defaultValue={defaultCity ?? ''}>
                <option value="" disabled>
                  Select your city
                </option>
                {cities.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
                <option value="other">Somewhere else in the Valley</option>
              </select>
            </div>
            <div className="quote-field">
              <label htmlFor="service">Service</label>
              <select id="service" name="service" required defaultValue={defaultService ?? ''}>
                <option value="" disabled>
                  What do you need?
                </option>
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
                <option value="not-sure">Not sure — help me figure it out</option>
              </select>
            </div>
          </div>

          <div className="quote-field">
            <label htmlFor="message">Anything we should know?</label>
            <textarea
              id="message"
              name="message"
              rows={3}
              placeholder="Square footage, how long since the last service, access notes…"
            />
          </div>

          <button type="submit" className="btn btn-red quote-submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Request My Quote →'}
          </button>

          {status === 'error' && (
            <p className="quote-error" role="alert">
              {error} You can also call{' '}
              <a href={business.telephoneHref}>{business.telephoneDisplay}</a>.
            </p>
          )}

          <p className="quote-fineprint">
            We use your details to quote this job and nothing else. No lists, no resale.
          </p>
        </form>
      </div>
    </section>
  );
}
