import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

import { ROUTES } from './fixtures';

/**
 * Regression tests for defects found in the pre-deployment audit (docs/qa.md, "Audit
 * 2026-10-21"). These set their own viewport sizes, so they run in the desktop project only.
 */
test.skip(({ isMobile }) => isMobile, 'Sets its own viewport sizes');

const section = (page: Page, prefix: string) =>
  page.locator(`main section[aria-labelledby^="${prefix}-title"]`);

test('the header "Affnook MCP" promo links to an existing #mcp section', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route.path);
    await expect(page.locator('header a[href="#mcp"]').first()).toBeAttached();
    await expect(page.locator('#mcp')).toHaveCount(1);
  }
});

test('header links and actions never overlap at laptop widths', async ({ page }) => {
  for (const width of [1024, 1185, 1220, 1250, 1280, 1366]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const gap = await page.evaluate(() => {
      const nav = document.querySelector('header nav')!.getBoundingClientRect();
      const actions = document.querySelector('header [class*="actions"]')!.getBoundingClientRect();
      return actions.left - nav.right;
    });
    expect(gap, `gap between links and actions at ${width}px`).toBeGreaterThanOrEqual(8);
  }
});

test.describe('layout', () => {
  test.use({ reducedMotion: 'reduce' });

  test('Brands problem cards stack without overlapping on phones', async ({ page }) => {
    for (const width of [320, 390, 600]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/brands');
      const boxes = await section(page, 'problem')
        .locator('[class*="cards"] > *')
        .evaluateAll((els) =>
          els.map((el) => {
            const r = el.getBoundingClientRect();
            return { top: r.top, bottom: r.bottom };
          }),
        );
      expect(boxes).toHaveLength(5);
      for (let i = 1; i < boxes.length; i++) {
        expect(boxes[i]!.top, `card ${i + 1} at ${width}px`).toBeGreaterThanOrEqual(
          boxes[i - 1]!.bottom - 1,
        );
      }
    }
  });

  test('Networks problem statement stays pinned while the cards scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1512, height: 900 });
    await page.goto('/affiliate-networks');
    const problem = section(page, 'problem');
    const sectionTop = await problem.evaluate((el) => el.getBoundingClientRect().top + scrollY);
    const tops: number[] = [];
    for (const offset of [150, 300, 450]) {
      await page.evaluate((y) => window.scrollTo(0, y), sectionTop + offset);
      tops.push(
        await problem
          .locator('[class*="sticky"]')
          .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
      );
    }
    expect(new Set(tops).size, `statement top while scrolling: ${tops.join(', ')}`).toBe(1);
  });

  test('the hero never cuts off its product dashboard', async ({ page }) => {
    for (const [path, width] of [
      ['/affiliate-networks', 1300],
      ['/affiliate-networks', 1440],
      ['/', 1280],
    ] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const overflow = await page.evaluate(() => {
        const hero = document.querySelector('section[aria-labelledby="hero-title"]')!;
        const bottom = hero.getBoundingClientRect().bottom;
        let lowest = 0;
        for (const el of hero.querySelectorAll('#product-stage *')) {
          if (!el.childElementCount && el.textContent?.trim()) {
            lowest = Math.max(lowest, el.getBoundingClientRect().bottom);
          }
        }
        return lowest - bottom;
      });
      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
  });

  test('hero KPI values and deltas share one row at desktop widths', async ({ page }) => {
    for (const [path, width] of [
      ['/affiliate-networks', 1512],
      ['/', 1280],
    ] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const misaligned = await page
        .locator('#product-stage [class*="kpi"]:has([class*="kpiValue"])')
        .evaluateAll(
          (cards) =>
            cards.filter((card) => {
              const v = card.querySelector('[class*="kpiValue"]')!.getBoundingClientRect();
              const d = card.querySelector('[class*="delta"]')!.getBoundingClientRect();
              return Math.abs(v.top + v.bottom - d.top - d.bottom) / 2 > 6;
            }).length,
        );
      expect(misaligned, `${path} at ${width}px`).toBe(0);
    }
  });

  test('capability table names never run under the figures on small phones', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    for (const route of ROUTES) {
      await page.goto(route.path);
      const overlapping = await section(page, 'how')
        .getByRole('tabpanel')
        .evaluate((panel) => {
          let n = 0;
          for (const row of panel.querySelectorAll('[class*="tableRow"]')) {
            const [name, value] = [...row.children].filter(
              (c) => getComputedStyle(c).display !== 'none',
            );
            if (!name || !value) continue;
            const range = document.createRange();
            range.selectNodeContents(name);
            const right = Math.max(...[...range.getClientRects()].map((r) => r.right));
            if (right > value.getBoundingClientRect().left + 1) n++;
          }
          return n;
        });
      expect(overlapping, route.path).toBe(0);
    }
  });

  test('case-study arrows keep keyboard focus at the last slide', async ({ page }) => {
    await page.goto('/');
    const next = section(page, 'proof').getByRole('button', { name: 'Next case study' });
    await next.focus();
    for (let i = 0; i < 3; i++) await page.keyboard.press('Enter');
    await expect(next).toHaveAttribute('aria-disabled', 'true');
    await expect(next).toBeFocused();
  });
});

test('a mouse click right after hover-opening a dropdown keeps it open', async ({ page }) => {
  await page.goto('/');
  const trigger = page.locator('header nav button[aria-expanded]').first();
  const box = (await trigger.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.mouse.down();
  await page.mouse.up();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.mouse.down();
  await page.mouse.up();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('rapid audience switching always ends on the last choice', async ({ page }) => {
  await page.goto('/');
  for (const id of ['brands', 'networks', 'operators']) {
    const box = (await page.locator(`main a[data-audience="${id}"]`).boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(110); // inside the 360ms cross-fade
  }
  await page.waitForTimeout(1200);
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).not.toHaveAttribute('data-audience-swap');
  await expect(page.locator('h1')).toContainText(ROUTES[0].h1.split('.')[0]!);
});

test('a keyboard audience switch keeps focus on the switcher', async ({ page }) => {
  await page.goto('/');
  await page.locator('main a[data-audience="brands"]').focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/brands$/);
  await expect(page.locator('main a[data-audience="brands"]')).toBeFocused();
});

test('scroll-driven hero tilt and footer wordmark actually move', async ({ page }) => {
  test.skip(
    !(await page.evaluate(() => CSS.supports('animation-timeline: view()'))),
    'Scroll-driven animations not supported',
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const tilt = page.locator('#product-stage [class*="tilt"]');
  const before = await tilt.evaluate((el) => getComputedStyle(el).transform);
  await page.evaluate(() => window.scrollTo(0, 400));
  await expect.poll(() => tilt.evaluate((el) => getComputedStyle(el).transform)).not.toBe(before);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect
    .poll(() =>
      page
        .locator('footer svg [class*="letter"]')
        .evaluateAll((letters) =>
          letters.every((l) =>
            /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/.test(getComputedStyle(l).transform),
          ),
        ),
    )
    .toBe(true);
});

test('footer legal links point at the live policy pages', async ({ page }) => {
  await page.goto('/');
  const legal = page.getByRole('navigation', { name: 'Legal' });
  await expect(legal.getByRole('link', { name: /Billing policy/ })).toHaveAttribute(
    'href',
    /\/payment-policy\/$/,
  );
  await expect(legal.getByRole('link', { name: /Terms/ })).toHaveAttribute(
    'href',
    /\/terms-of-use\/$/,
  );
});

test('unknown URLs get a branded 404 inside the site layout', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('main#main').getByRole('heading', { level: 1 })).toHaveText(
    'Page not found',
  );
  await expect(page.locator('header')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Go to the homepage' })).toHaveAttribute('href', '/');
});

test('if the JavaScript bundles fail to load, the no-JS layout takes over', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  // Local builds serve /_next/static/chunks/, Vercel /_next/static/immutable/chunks/.
  await page.route(/\/_next\/static\/(immutable\/)?chunks\/.*\.js/, (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/(^|\s)js(\s|$)/);
  await expect(page.locator('header a[href="#site-footer"]')).toBeVisible();
  await expect(
    section(page, 'faq').getByText('Do you charge extra for data access?'),
  ).toBeVisible();
});

test.describe('accessibility of interactive states', () => {
  test.use({ reducedMotion: 'reduce' });
  const axe = (page: Page) =>
    new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
      .then((r) => r.violations.map((v) => `${v.id}: ${v.nodes.length}`));

  test('axe is clean with a desktop dropdown open and widgets switched', async ({ page }) => {
    await page.goto('/affiliate-networks');
    await page.locator('header nav button[aria-expanded]').first().click();
    expect(await axe(page)).toEqual([]);
    await page.keyboard.press('Escape');
    await section(page, 'how').getByRole('tab').nth(2).click();
    await section(page, 'faq').getByRole('tab').nth(3).click();
    await section(page, 'proof').getByRole('button', { name: 'Next case study' }).click();
    expect(await axe(page)).toEqual([]);
  });

  test('axe is clean with the mobile menu open', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/brands');
    await page.locator('header button[aria-controls="mobile-menu"]').click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    expect(await axe(page)).toEqual([]);
  });

  test('axe is clean on the 404 page', async ({ page }) => {
    await page.goto('/no-such-page');
    expect(await axe(page)).toEqual([]);
  });
});
