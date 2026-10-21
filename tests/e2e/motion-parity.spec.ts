import { expect, test, type Page } from '@playwright/test';

import { ROUTES } from './fixtures';

/**
 * Motion parity with the approved prototype (docs/decisions.md C3/C34, C4, C54, C55 and the
 * footer wordmark). These set their own viewport sizes, so they run in the desktop project.
 */
test.skip(({ isMobile }) => isMobile, 'Sets its own viewport sizes');

const section = (page: Page, prefix: string) =>
  page.locator(`main section[aria-labelledby^="${prefix}-title"]`);
const firstCharTransform = (page: Page, prefix: string) =>
  section(page, prefix)
    .locator('h2 [class*="char"]')
    .first()
    .evaluate((el) => getComputedStyle(el).transform);

test.describe('Proof and How it works headings: characters rise in once', () => {
  for (const route of ROUTES) {
    test(`${route.path}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route.path);
      for (const prefix of ['proof', 'how']) {
        const heading = section(page, prefix).locator('h2');
        // Plain sentence for assistive technology; the split characters are hidden.
        const name = await heading.locator('.visually-hidden').textContent();
        await expect(heading).toHaveAccessibleName(name!);
        // Armed and waiting below the fold.
        await expect.poll(() => firstCharTransform(page, prefix)).not.toBe('none');
        await heading.evaluate((el) => el.scrollIntoView({ block: 'center' }));
        await expect.poll(() => firstCharTransform(page, prefix), { timeout: 4000 }).toBe('none');
        // Scrolling away and back does not replay it.
        await page.evaluate(() => window.scrollTo(0, 0));
        await heading.evaluate((el) => el.scrollIntoView({ block: 'center' }));
        expect(await firstCharTransform(page, prefix)).toBe('none');
      }
    });
  }
});

test.describe('capability tabs auto-advance (prototype 7s timer)', () => {
  const tabs = (page: Page) => section(page, 'how').getByRole('tab');
  const activeIndex = (page: Page) =>
    tabs(page).evaluateAll((ts) => ts.findIndex((t) => t.getAttribute('aria-selected') === 'true'));

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    // Shorten the 7s timer for the test only.
    await page.addStyleTag({
      content: '[class*="tabProgress"] { animation-duration: 600ms !important; }',
    });
    await tabs(page)
      .first()
      .evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.mouse.move(5, 5);
  });

  test('advances, loops from a clicked tab, and shows a progress bar', async ({ page }) => {
    await expect(tabs(page).first().locator('[class*="tabProgress"]')).toHaveCount(1);
    await expect.poll(() => activeIndex(page), { timeout: 3000 }).toBeGreaterThanOrEqual(1);
    const count = await tabs(page).count();
    // A mouse click restarts the timer on that tab and auto-advance continues (loops to 0).
    await tabs(page)
      .nth(count - 1)
      .click();
    await page.mouse.move(5, 5);
    await expect.poll(() => activeIndex(page), { timeout: 3000 }).toBe(0);
  });

  test('pauses while hovered and while keyboard focus is inside', async ({ page }) => {
    const first = tabs(page).first();
    const box = (await first.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const hovered = await activeIndex(page);
    await page.waitForTimeout(1500);
    expect(await activeIndex(page)).toBe(hovered);
    // Keyboard focus (focus-visible) pauses it.
    await first.focus();
    await page.keyboard.press('ArrowRight');
    await page.mouse.move(5, 5);
    const focused = await activeIndex(page);
    await page.waitForTimeout(1500);
    expect(await activeIndex(page)).toBe(focused);
  });
});

test.describe('capability tabs under reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('never auto-advance', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const how = section(page, 'how');
    await how
      .getByRole('tab')
      .first()
      .evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(800);
    await expect(how.locator('[class*="tabProgress"]')).toHaveCount(0);
    await expect(how.getByRole('tab').first()).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('Proof: pinned horizontal scroll on wide screens', () => {
  const root = (page: Page) => section(page, 'proof').locator('[data-pin-root]');
  const pinX = (page: Page) =>
    section(page, 'proof')
      .locator('[class*="track"]')
      .first()
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);

  for (const route of ROUTES) {
    test(`${route.path}: page scroll slides the track; arrows move the page`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route.path);
      const height = await root(page).evaluate((el: HTMLElement) => el.offsetHeight);
      expect(height).toBeGreaterThan(900 * 2);
      const top = await root(page).evaluate((el) => el.getBoundingClientRect().top + scrollY);
      await page.evaluate((y) => window.scrollTo(0, y), top);
      expect(await pinX(page)).toBeCloseTo(0, 0);
      await page.evaluate((y) => window.scrollTo(0, y), top + (height - 900) / 2);
      await expect.poll(() => pinX(page)).toBeLessThan(-500);
      // Progress counter and dots agree with the reference counter (second third = 02).
      await expect(section(page, 'proof').locator('[class*="pinProgress"]')).toContainText('02');
      await page.evaluate((y) => window.scrollTo(0, y), top);
      await page.getByRole('button', { name: 'Next case study' }).click();
      await expect
        .poll(() => page.evaluate(() => scrollY), { timeout: 4000 })
        .toBeGreaterThan(top + 200);
    });
  }

  test('900px and reduced motion keep the swipe carousel (no pin)', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 900 });
    await page.goto('/');
    expect(await root(page).evaluate((el: HTMLElement) => el.offsetHeight)).toBeLessThan(1200);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.reload();
    expect(await root(page).evaluate((el: HTMLElement) => el.offsetHeight)).toBeLessThan(1200);
  });
});

test.describe('footer wordmark', () => {
  for (const width of [390, 1024, 1440, 2560]) {
    test(`hovered letters are not clipped at the top @ ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      const letters = page.locator('footer svg [class*="letter"]');
      await expect
        .poll(() =>
          letters.evaluateAll((ls) =>
            ls.every((l) =>
              /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/.test(getComputedStyle(l).transform),
            ),
          ),
        )
        .toBe(true);
      const svgTop = await page
        .locator('footer svg')
        .last()
        .evaluate((el) => el.getBoundingClientRect().top);
      // A, F and O are solid at their top centre (the K is not).
      for (const i of [0, 2, 4]) {
        // Hover a point that is actually painted (SVG hover needs the shape, not its box).
        const point = await letters.nth(i).evaluate((el) => {
          const r = el.getBoundingClientRect();
          for (let gy = 0.5; gy < 1; gy += 0.1) {
            for (let gx = 0.05; gx < 1; gx += 0.1) {
              const x = r.left + r.width * gx;
              const y = r.top + r.height * gy;
              const hit = document.elementFromPoint(x, y);
              if (hit && el.contains(hit)) return { x, y };
            }
          }
          return null;
        });
        expect(point, `painted point on letter ${i}`).not.toBeNull();
        await page.mouse.move(point!.x, point!.y);
        await page.waitForTimeout(650);
        const r = (await letters.nth(i).boundingBox())!;
        if (width >= 1024) expect(r.y).toBeLessThan(svgTop);
        // The strip of the letter above the SVG box must still be painted (not clipped).
        const strip = Math.max(1, Math.floor(svgTop - r.y));
        const png = await page.screenshot({
          clip: { x: r.x + r.width * 0.3, y: r.y, width: r.width * 0.4, height: strip },
        });
        const brightest = await page.evaluate(async (b64) => {
          const img = new Image();
          img.src = `data:image/png;base64,${b64}`;
          await img.decode();
          const c = document.createElement('canvas');
          c.width = img.width;
          c.height = img.height;
          const ctx = c.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          const d = ctx.getImageData(0, 0, c.width, c.height).data;
          let max = 0;
          for (let k = 0; k < d.length; k += 4) max = Math.max(max, d[k]! + d[k + 1]! + d[k + 2]!);
          return max;
        }, png.toString('base64'));
        // Page background is #060a1f (sum 47); letters are #f3f5ff or indigo #4f46db.
        expect(brightest, `letter ${i} top strip`).toBeGreaterThan(250);
      }
      // No horizontal page scroll.
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
      ).toBeLessThanOrEqual(0);
    });
  }
});
