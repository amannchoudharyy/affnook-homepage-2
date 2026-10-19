import { test } from '@playwright/test';

import { ROUTES } from './fixtures';

/**
 * Review screenshots (not assertions). Run with:
 *   SCREENSHOTS=1 npx playwright test screenshots --project=desktop-chromium
 * Output goes to .screenshots-local/<SCREENSHOT_SET or "review"> (git-ignored). Reduced
 * motion is used so every element is captured in its final state.
 */
const WIDTHS = [320, 390, 768, 1024, 1440, 1920, 2560];
const OUT = `.screenshots-local/${process.env.SCREENSHOT_SET ?? 'review'}`;
/** Section close-ups at the Figma width (1512px): CSS selector → file suffix. */
const SECTIONS: [string, string][] = [
  ['#product-stage', 'stage'],
  ['main section[aria-labelledby="logos-title"]', 'logos'],
  ['main section[aria-labelledby^="problem-title"]', 'problem'],
  ['main section[aria-labelledby^="stakes-title"]', 'stakes'],
  ['main section[aria-labelledby^="turn-title"]', 'turn'],
  ['main section[aria-labelledby^="mcp-title"]', 'mcp'],
];
/** Narrow-width close-ups of the sections added in the current phase (reflow review). */
const REFLOW: [string, string][] = SECTIONS.slice(-2);
const REFLOW_WIDTHS = [320, 390, 768, 1024];

test.skip(!process.env.SCREENSHOTS, 'Set SCREENSHOTS=1 to capture review screenshots');
test.skip(({ isMobile }) => isMobile, 'Desktop project only');
test.use({ reducedMotion: 'reduce' });

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    test(`capture ${route.id} @ ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
      await page.goto(route.path, { waitUntil: 'networkidle' });
      await page.screenshot({ path: `${OUT}/${route.id}-${width}.png`, fullPage: true });
    });
  }

  test(`capture ${route.id} reflow close-ups`, async ({ page }) => {
    for (const width of REFLOW_WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route.path, { waitUntil: 'networkidle' });
      for (const [selector, name] of REFLOW) {
        await page
          .locator(selector)
          .screenshot({ path: `${OUT}/${route.id}-${name}-${width}.png` });
      }
    }
  });

  test(`capture ${route.id} sections @ 1512 (Figma width)`, async ({ page }) => {
    await page.setViewportSize({ width: 1512, height: 982 });
    await page.goto(route.path, { waitUntil: 'networkidle' });
    for (const [selector, name] of SECTIONS) {
      const el = page.locator(selector);
      await el.scrollIntoViewIfNeeded();
      const box = (await el.boundingBox())!;
      // Full-viewport-width clip: the product stage intentionally extends past its figure box.
      await page.screenshot({
        path: `${OUT}/${route.id}-${name}-1512.png`,
        fullPage: true,
        clip: { x: 0, y: box.y, width: 1512, height: box.height },
      });
    }
  });
}
