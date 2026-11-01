import { Host_Grotesk, JetBrains_Mono } from 'next/font/google';

/**
 * Both faces are SIL Open Font License fonts from Google Fonts. next/font downloads them at
 * build time and serves them from this site, so no request goes to Google at runtime.
 */

/** Display and body face (variable, weights 300–800). */
export const hostGrotesk = Host_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-host-grotesk',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});
