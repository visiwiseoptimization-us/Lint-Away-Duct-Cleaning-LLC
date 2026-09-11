import type { Metadata, Viewport } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SiteEffects from '@/components/SiteEffects';
import JsonLd from '@/components/JsonLd';
import { rootGraph } from '@/lib/schema';
import { business } from '@/data/business';

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: {
    default: 'Lint Away Duct Cleaning — Phoenix Valley Air Duct & Dryer Vent Experts',
    template: '%s | Lint Away Duct Cleaning',
  },
  description:
    'Camera-verified air duct and dryer vent cleaning across the Phoenix Valley — Phoenix, Tempe, Mesa, Chandler, Gilbert, Scottsdale, Ahwatukee and Paradise Valley. Same-day slots available.',
  applicationName: business.name,
  authors: [{ name: business.legalName, url: business.url }],
  creator: business.legalName,
  publisher: business.legalName,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: business.url,
    siteName: business.name,
    title: 'Lint Away Duct Cleaning — Phoenix Valley Air Duct & Dryer Vent Experts',
    description:
      'Camera-verified air duct and dryer vent cleaning across the Phoenix Valley. Same-day slots available in every city we serve.',
    images: [{ url: '/van.png', width: 1200, height: 630, alt: business.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lint Away Duct Cleaning — Phoenix Valley',
    description: 'Camera-verified air duct and dryer vent cleaning across the Phoenix Valley.',
    images: ['/van.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  other: {
    // Legacy geo meta. Modern crawlers lean on JSON-LD, but several local
    // directory scrapers and a few regional engines still read these, and they
    // cost nothing to emit.
    'geo.region': 'US-AZ',
    'geo.placename': 'Phoenix Valley, Arizona',
    'geo.position': `${business.geo.lat};${business.geo.lng}`,
    ICBM: `${business.geo.lat}, ${business.geo.lng}`,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0D4A5C',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <JsonLd data={rootGraph()} />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <div id="cursor-light"></div>
        <SiteEffects />
      </body>
    </html>
  );
}
