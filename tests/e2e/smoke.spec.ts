import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { ROUTES } from './fixtures';

for (const route of ROUTES) {
  test.describe(`${route.label} (${route.path})`, () => {
    test('renders one H1 with the audience headline', async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      await expect(h1).toHaveText(route.h1);
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
      await page.goto(route.path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations).toEqual([]);
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
