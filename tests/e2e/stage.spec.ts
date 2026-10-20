import { expect, test } from '@playwright/test';

import { QA_WIDTHS } from './fixtures';

/** Content that only the matching audience's Figma dashboard contains. */
const STAGES = [
  {
    path: '/',
    url: 'app.affnook.com/dashboard',
    unique: ['NGR by brand', 'Share of NGR', 'Top markets · NGR', 'Live activity'],
    absent: ['Funnel · split by partner', 'Publishers by tier'],
    caption: /operator dashboard/,
  },
  {
    path: '/brands',
    url: 'app.affnook.com/reports/partners',
    unique: [
      'Funnel · split by partner',
      'Player LTV by sign-up week',
      'Promo codes',
      'Payout run · Oct 1',
    ],
    absent: ['Share of NGR', 'Publishers by tier'],
    caption: /brand dashboard/,
  },
  {
    path: '/affiliate-networks',
    url: 'app.affnook.com/network',
    unique: ['Publishers by tier', 'Revenue by brand partner', 'Commission rule', 'Postback log'],
    absent: ['Share of NGR', 'Funnel · split by partner'],
    caption: /network dashboard/,
  },
] as const;

for (const stage of STAGES) {
  test.describe(`product stage ${stage.path}`, () => {
    test('renders the audience-specific Figma dashboard, labelled as sample data', async ({
      page,
    }) => {
      await page.goto(stage.path);
      const figure = page.locator('#product-stage');
      await expect(figure).toHaveCount(1);
      await expect(figure.locator('figcaption')).toHaveText(stage.caption);
      await expect(figure.locator('figcaption')).toHaveText(/Illustrative data/);
      await expect(figure.getByText('Sample data', { exact: true })).toBeVisible();
      await expect(figure.getByText(stage.url, { exact: true })).toBeVisible();
      for (const text of stage.unique) {
        await expect(figure.getByText(text, { exact: true }).first()).toBeVisible();
      }
      for (const text of stage.absent) {
        await expect(figure.getByText(text, { exact: true })).toHaveCount(0);
      }
    });
  });
}

test.describe('stage motion', () => {
  test('KPI count-ups finish on the exact Figma values', async ({ page }) => {
    await page.goto('/');
    const figure = page.locator('#product-stage');
    await page.waitForTimeout(3500);
    for (const value of ['$1.24M', '3,482', '21,760', '12,906']) {
      await expect(figure.getByText(value, { exact: true }).first()).toBeVisible();
    }
  });

  test('live activity inserts new rows while visible and keeps five rows', async ({ page }) => {
    await page.goto('/');
    const feed = page
      .locator('#product-stage [class*="floatCard"]', { hasText: 'Live activity' })
      .locator('ul');
    // The cards bob continuously, so scroll via the DOM rather than waiting for stability.
    await feed.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    const first = await feed.locator('li').first().textContent();
    await expect
      .poll(async () => feed.locator('li').first().textContent(), { timeout: 8000 })
      .not.toBe(first);
    await expect(feed.locator('li')).toHaveCount(5);
  });

  test('postback log rotates on the networks dashboard', async ({ page }) => {
    await page.goto('/affiliate-networks');
    const log = page
      .locator('#product-stage [class*="floatCard"]', { hasText: 'Postback log' })
      .locator('ul');
    await log.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    const first = await log.locator('li').first().textContent();
    await expect
      .poll(async () => log.locator('li').first().textContent(), { timeout: 8000 })
      .not.toBe(first);
    await expect(log.locator('li')).toHaveCount(4);
  });

  test('stage is marked off screen when scrolled away (animations pause)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 600 });
    await page.goto('/');
    const region = page.locator('#product-stage > div');
    await region.scrollIntoViewIfNeeded();
    await expect(region).not.toHaveAttribute('data-offscreen');
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(region).toHaveAttribute('data-offscreen', '');
  });
});

test.describe('stage with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('shows final values, no feed rotation and no scroll-linked transforms', async ({ page }) => {
    await page.goto('/');
    const figure = page.locator('#product-stage');
    await expect(figure.getByText('$1.24M', { exact: true }).first()).toBeVisible();
    const feed = figure.locator('[class*="floatCard"]', { hasText: 'Live activity' }).locator('ul');
    const before = await feed.textContent();
    await page.waitForTimeout(3200);
    expect(await feed.textContent()).toBe(before);
    const animations = await page.evaluate(() =>
      [...document.querySelectorAll('#product-stage *')]
        .map((el) => getComputedStyle(el).animationName)
        .filter((name) => name !== 'none'),
    );
    expect(animations).toEqual([]);
  });
});

test.describe('stage without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('dashboard content renders statically with final values', async ({ page }) => {
    await page.goto('/brands');
    const figure = page.locator('#product-stage');
    await expect(figure.getByText('Player journey by partner')).toBeVisible();
    await expect(figure.getByText('42,610', { exact: true })).toBeVisible();
    await expect(figure.getByText('$182,400', { exact: true })).toBeVisible();
    const opacity = await figure
      .locator('div')
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });
});

test.describe('stage responsive layout', () => {
  test.skip(({ isMobile }) => isMobile, 'Width matrix runs in the desktop project only');

  for (const path of ['/', '/brands', '/affiliate-networks']) {
    for (const width of QA_WIDTHS) {
      test(`${path} @ ${width}px: window and cards fit the viewport`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        await page.waitForTimeout(2600);
        // Measure layout, not the scroll-linked 3D tilt (decision C17): at the top of the page
        // the tilted window's bottom corners project slightly past the edge, where the hero
        // clips them, and they flatten as the page scrolls. Page scroll width is still checked.
        await page.addStyleTag({
          content:
            '#product-stage [class*="tilt"] { animation: none !important; transform: none !important; }',
        });
        const problems = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          const figure = document.querySelector('#product-stage')!;
          const boxes = [
            ...figure.querySelectorAll<HTMLElement>('[class*="window"], [class*="floatCard"]'),
          ].map((el) => el.getBoundingClientRect());
          const out = boxes
            .filter((r) => r.left < -0.5 || r.right > vw + 0.5)
            .map((r) => `[${Math.round(r.left)}, ${Math.round(r.right)}]`);
          // Text inside the window must not overflow its own box (clipped labels).
          const clippedText = [
            ...figure.querySelectorAll<HTMLElement>('[class*="kpi"], [class*="panel"]'),
          ]
            .filter((el) => el.scrollWidth > el.clientWidth + 1)
            .map((el) => el.className.split(' ')[0]);
          return { out, clippedText, scroll: document.documentElement.scrollWidth - vw };
        });
        expect(problems.out).toEqual([]);
        expect(problems.clippedText).toEqual([]);
        expect(problems.scroll).toBeLessThanOrEqual(0);
      });
    }
  }
});
