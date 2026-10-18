import { test } from '@playwright/test';

import { ROUTES } from './fixtures';

/**
 * Review screenshots (not assertions). Run with:
 *   SCREENSHOTS=1 npx playwright test screenshots --project=desktop-chromium
 * Output goes to .screenshots-local/ (git-ignored). Reduced motion is used so every
 * element is captured in its final state.
 */
const WIDTHS = [320, 390, 768, 1024, 1440, 1920, 2560];

test.skip(!process.env.SCREENSHOTS, 'Set SCREENSHOTS=1 to capture review screenshots');
test.skip(({ isMobile }) => isMobile, 'Desktop project only');
test.use({ reducedMotion: 'reduce' });

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    test(`capture ${route.id} @ ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
      await page.goto(route.path, { waitUntil: 'networkidle' });
      await page.screenshot({
        path: `.screenshots-local/phase1/${route.id}-${width}.png`,
        fullPage: true,
      });
    });
  }
}
