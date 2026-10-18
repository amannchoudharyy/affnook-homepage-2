import { JetBrains_Mono } from 'next/font/google';

/**
 * JetBrains Mono (SIL Open Font License). next/font downloads it at build time
 * and serves it from this site, so no request goes to Google at runtime.
 *
 * The display/body face, TT Firs Neue, is a commercial font. It will be loaded
 * with next/font/local once licensed webfont files are supplied.
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});
