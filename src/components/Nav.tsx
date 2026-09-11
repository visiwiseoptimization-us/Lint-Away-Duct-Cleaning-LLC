'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { business } from '@/data/business';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = [
    { href: '/services', label: 'Services' },
    { href: '/service-areas', label: 'Service Areas' },
    { href: '/blog', label: 'Guides' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/about-us', label: 'About' },
  ];

  return (
    <>
      <nav id="nav">
        <Link href="/" className="nav-logo" aria-label={`${business.name} home`}>
          <div>
            <div className="nav-logo-text">
              <span>LINT</span> <em>AWAY</em>
            </div>
            <div className="nav-logo-tagline">{business.tagline}</div>
          </div>
        </Link>

        <ul className="nav-links">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <a className="nav-phone" href={business.telephoneHref}>
            {business.telephoneDisplay}
          </a>
          <Link className="nav-cta" href="/contact-us">
            Get a Quote
          </Link>
        </div>

        <button
          className={`nav-hamburger${open ? ' open' : ''}`}
          id="hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobileMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`nav-mobile${open ? ' open' : ''}`} id="mobileMenu">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            {l.label}
          </Link>
        ))}
        <Link href="/contact-us">Get a Quote</Link>
        <a href={business.telephoneHref} style={{ color: 'var(--red)' }}>
          {business.telephoneDisplay}
        </a>
      </div>
    </>
  );
}
