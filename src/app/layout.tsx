import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/footer/SiteFooter';
import { SiteHeader } from '@/components/layout/header/SiteHeader';
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

/**
 * Marks the document as JS-capable before first paint. Entrance animations and
 * JS-enhanced controls are scoped to `html.js`, so without JavaScript every element
 * renders in its final, visible state.
 */
const JS_FLAG_SCRIPT = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script adds the `js` class before React hydrates.
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="scroll-progress" aria-hidden="true" />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
