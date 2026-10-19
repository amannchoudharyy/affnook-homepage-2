import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { ROUTES } from './fixtures';

for (const route of ROUTES) {
  test.describe(`${route.label} (${route.path})`, () => {
    test('renders one H1 with the audience headline', async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveAccessibleName(route.h1);
    });

    test('marks the current audience in the switcher', async ({ page }) => {
      await page.goto(route.path);
      const nav = page.getByRole('navigation', { name: 'See Affnook for' });
      await expect(nav.getByRole('link', { name: route.label, exact: true })).toHaveAttribute(
        'aria-current',
        'page',
      );
      await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
    });

    test('has a self-referencing canonical and is noindex outside production', async ({ page }) => {
      await page.goto(route.path);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(new URL(canonical ?? '').pathname).toBe(route.path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    });

    test('has no automatically detectable WCAG A/AA violations', async ({ page }) => {
      // Reduced motion renders every element in its final state, so contrast is measured on
      // settled colours rather than on frames caught mid-animation.
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route.path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
    });

    test('loads without console errors, warnings or failed requests', async ({ page }) => {
      const problems: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error' || msg.type() === 'warning') problems.push(msg.text());
      });
      page.on('pageerror', (err) => problems.push(err.message));
      page.on('response', (res) => {
        if (res.url().startsWith(new URL(page.url() || 'http://x').origin) && res.status() >= 400) {
          problems.push(`${res.status()} ${res.url()}`);
        }
      });
      await page.goto(route.path, { waitUntil: 'networkidle' });
      // Scroll through so lazy-loaded images below the fold are requested too.
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 50));
        }
      });
      await page.waitForLoadState('networkidle');
      const brokenImages = await page.evaluate(() =>
        [...document.images]
          .filter((img) => !img.complete || img.naturalWidth === 0)
          .map((i) => i.src),
      );
      expect(brokenImages).toEqual([]);
      expect(problems).toEqual([]);
    });
  });
}

test('skip link is the first keyboard stop and targets main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute('href', '#main');
  await expect(page.locator('main#main')).toHaveCount(1);
});

test('robots.txt disallows crawling outside production', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  expect(await res.text()).toMatch(/Disallow: \//);
  expect(res.headers()['x-robots-tag']).toMatch(/noindex/);
});

test('primary CTAs point to approved destinations', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('main section[aria-labelledby="hero-title"]');
  await expect(hero.getByRole('link', { name: /Book a free demo/ })).toHaveAttribute(
    'href',
    'https://affnook.com/book-free-demo/',
  );
  await expect(hero.getByRole('link', { name: /Take the tour/ })).toHaveAttribute(
    'href',
    'https://vimeo.com/1152140502/62c8d0ebe9',
  );
  await expect(hero.getByRole('link', { name: /AffPapa iGaming Awards 2024/ })).toHaveAttribute(
    'href',
    /affpapa\.com/,
  );
});
