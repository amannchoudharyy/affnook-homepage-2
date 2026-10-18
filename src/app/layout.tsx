import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { getSiteUrl } from '@/lib/site';

import { jetbrainsMono } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  applicationName: 'Affnook',
};

export const viewport: Viewport = {
  themeColor: '#060a1f',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
