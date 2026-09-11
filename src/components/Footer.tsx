import Link from 'next/link';
import { business } from '@/data/business';
import { cities } from '@/data/cities';
import { services } from '@/data/services';

/**
 * The footer carries the site-wide internal link graph. Every city page and
 * every service page is one hop from every other page, which is how link
 * equity reaches the deep geo pages that have no external links of their own.
 */
export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo-text">
              <span>LINT</span> <em>AWAY</em>
            </div>
            <p
              className="footer-tagline"
              style={{
                fontStyle: 'italic',
                fontSize: '15px',
                color: 'var(--teal-lt)',
                marginBottom: '6px',
                fontFamily: 'var(--display)',
                fontWeight: '500',
              }}
            >
              {business.tagline}
            </p>
            <p className="footer-tagline">
              Phoenix Valley&apos;s camera-inspected air duct &amp; dryer vent cleaning experts.
              Locally owned. Fully certified.
            </p>
            <p className="footer-tagline">
              <a href={business.telephoneHref} className="footer-phone">
                {business.telephoneDisplay}
              </a>
              <br />
              Serving {business.address.locality}, {business.address.region} and the Phoenix Valley
            </p>
            <div className="footer-socials">
              {business.sameAs.map((href) => {
                const label = href.includes('tiktok')
                  ? 'TikTok'
                  : href.includes('youtube')
                    ? 'YouTube'
                    : href.includes('instagram')
                      ? 'Instagram'
                      : 'Facebook';
                const icon = href.includes('tiktok')
                  ? '📱'
                  : href.includes('youtube')
                    ? '▶️'
                    : href.includes('instagram')
                      ? '📸'
                      : '👍';
                return (
                  <a
                    key={href}
                    className="social-btn"
                    href={href}
                    title={label}
                    aria-label={label}
                    rel="me noopener"
                    target="_blank"
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <div className="footer-col-title">Services</div>
            <ul className="footer-links">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>{s.shortName}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Service Areas</div>
            <ul className="footer-links">
              {cities.map((c) => (
                <li key={c.slug}>
                  <Link href={`/service-areas/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li>
                <Link href="/about-us">About Us</Link>
              </li>
              <li>
                <Link href="/reviews">Reviews</Link>
              </li>
              <li>
                <Link href="/blog">Guides &amp; Resources</Link>
              </li>
              <li>
                <Link href="/contact-us">Contact</Link>
              </li>
              <li>
                <a href={business.telephoneHref}>{business.telephoneDisplay}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © {new Date().getFullYear()} {business.legalName}. All rights reserved. Serving Phoenix
            Valley, AZ.
          </div>
          <div className="footer-legal">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
