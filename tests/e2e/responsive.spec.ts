import { expect, test } from '@playwright/test';

import { QA_WIDTHS, ROUTES } from './fixtures';

// Viewport is set explicitly, so run once (desktop project) to avoid duplicate work.
test.skip(({ isMobile }) => isMobile, 'Width matrix runs in the desktop project only');

for (const route of ROUTES) {
  for (const width of QA_WIDTHS) {
    test(`${route.path} has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route.path);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  }
}
