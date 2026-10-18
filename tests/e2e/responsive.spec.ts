import { expect, test } from '@playwright/test';

import { QA_WIDTHS, ROUTES } from './fixtures';

// Viewport is set explicitly, so run once (desktop project) to avoid duplicate work.
test.skip(({ isMobile }) => isMobile, 'Width matrix runs in the desktop project only');

for (const route of ROUTES) {
  for (const width of QA_WIDTHS) {
    test(`${route.path} at ${width}px: no overflow or clipped header/hero content`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route.path);
      await page.waitForTimeout(1800); // entrance animations settle
      const report = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const selectors = [
          'header [class*="bar"]',
          'main h1',
          'main p',
          'main a[href*="book-free-demo"]',
          'main a[href*="vimeo"]',
          'main nav[aria-labelledby] ul',
          'footer [class*="legal"]',
        ];
        const clipped = selectors.flatMap((sel) =>
          [...document.querySelectorAll<HTMLElement>(sel)]
            .filter((el) => el.offsetParent !== null)
            .map((el) => ({ sel, r: el.getBoundingClientRect() }))
            .filter(({ r }) => r.left < -0.5 || r.right > vw + 0.5)
            .map(({ sel, r }) => `${sel} [${Math.round(r.left)}, ${Math.round(r.right)}]`),
        );
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: vw,
          clipped,
        };
      });
      expect(report.scrollWidth).toBeLessThanOrEqual(report.clientWidth);
      expect(report.clipped).toEqual([]);
    });
  }
}
