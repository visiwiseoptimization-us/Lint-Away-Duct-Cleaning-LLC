import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Trailing slashes off keeps one canonical form per URL. The old WordPress
  // URLs used trailing slashes, which is what the redirects below normalize.
  trailingSlash: false,
  async redirects() {
    return [
      // Preserve equity from the WordPress URL structure.
      { source: '/air-duct-cleaning-services', destination: '/services/residential-air-duct-cleaning', permanent: true },
      { source: '/residential-dryer-vent-cleaning', destination: '/services/residential-dryer-vent-cleaning', permanent: true },
      { source: '/commercial-dryer-vent-cleaning', destination: '/services/commercial-dryer-vent-cleaning', permanent: true },
      { source: '/commercial-air-duct-cleaning', destination: '/services/commercial-air-duct-cleaning', permanent: true },
      { source: '/blogs', destination: '/blog', permanent: true },
      { source: '/blogs/:slug', destination: '/blog/:slug', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // llms.txt and the feeds should be cacheable but re-fetched often
        // enough that a content update propagates within the day.
        source: '/llms.txt',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, s-maxage=86400' }],
      },
    ];
  },
};

export default nextConfig;
