import type { NextConfig } from 'next';

import { isIndexable } from './src/lib/site';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    const headers = [...securityHeaders];
    // Belt and braces: non-production deployments also send a noindex header,
    // in addition to the robots meta tag and robots.txt.
    if (!isIndexable()) {
      headers.push({ key: 'X-Robots-Tag', value: 'noindex, nofollow' });
    }
    return [{ source: '/:path*', headers }];
  },
};

export default nextConfig;
