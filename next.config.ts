import type { NextConfig } from 'next';

import { deployConfigError, isIndexable } from './src/lib/site';

const configError = deployConfigError();
if (configError) throw new Error(configError);

/**
 * Content-Security-Policy for the built site (static pages, no third-party requests).
 * 'unsafe-inline' scripts are required by statically prerendered Next.js pages (inline RSC
 * payload); nonces would force dynamic rendering. Not sent by `next dev` (needs eval).
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    const headers = [...securityHeaders];
    if (process.env.NODE_ENV === 'production') {
      headers.push({ key: 'Content-Security-Policy', value: CSP });
    }
    // Belt and braces: non-production deployments also send a noindex header,
    // in addition to the robots meta tag and robots.txt.
    if (!isIndexable()) {
      headers.push({ key: 'X-Robots-Tag', value: 'noindex, nofollow' });
    }
    return [
      { source: '/:path*', headers },
      // public/images files are not content-hashed: cache for a day, then revalidate.
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ];
  },
  async redirects() {
    // Operators is the default audience at '/'.
    return [{ source: '/operators', destination: '/', permanent: true }];
  },
};

export default nextConfig;
