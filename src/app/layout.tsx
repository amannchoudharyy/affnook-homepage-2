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
 *
 * Failsafe: if a Next.js chunk fails to load, or the app has not hydrated within 8 s, the
 * flag is removed again so the no-JS presentation (all FAQ answers and tab panels, the
 * "Menu" link to the footer) takes over. HeaderShell sets `__affnookHydrated` and re-adds
 * the flag once React is running.
 */
const JS_FLAG_SCRIPT = `(function(){var r=document.documentElement;r.classList.add('js');function off(){if(!window.__affnookHydrated)r.classList.remove('js')}window.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='SCRIPT'&&t.src.indexOf('/_next/')>-1)off()},true);window.setTimeout(off,8000)})()`;

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
