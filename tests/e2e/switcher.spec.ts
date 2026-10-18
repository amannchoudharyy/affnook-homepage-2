import { expect, test } from '@playwright/test';

import { pathRegExp, ROUTES } from './fixtures';

test('hero switcher cross-fades to each audience route', async ({ page }) => {
  await page.goto('/');
  for (const route of [ROUTES[1], ROUTES[2], ROUTES[0]]) {
    await page
      .getByRole('navigation', { name: 'See Affnook for' })
      .getByRole('link', { name: route.label, exact: true })
      .click();
    await expect(page).toHaveURL(pathRegExp(route.path));
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(route.h1);
    // Fade-out state is cleared once the new page mounts.
    await expect(page.locator('html')).not.toHaveAttribute('data-audience-swap', /.*/);
    await expect(page.locator('main')).toHaveCSS('opacity', '1');
  }
});

test('rapid repeated switching settles on the last choice without errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'See Affnook for' });
  await nav.getByRole('link', { name: 'Brands', exact: true }).click();
  await page.waitForURL(/\/brands$/);
  await nav.getByRole('link', { name: 'Affiliate networks', exact: true }).click();
  await page.waitForURL(/\/affiliate-networks$/);
  await nav.getByRole('link', { name: 'Operators', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(ROUTES[0].h1);
  expect(errors).toEqual([]);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('disables decorative and entrance animations', async ({ page }) => {
    await page.goto('/');
    const names = await page.evaluate(() => {
      const pick = (sel: string) => getComputedStyle(document.querySelector(sel)!).animationName;
      return {
        char: pick('h1 [aria-hidden] span span span'),
        glow: pick('main img[src*="glow-indigo"]'),
        landscape: pick('main img[src*="landscape"]'),
      };
    });
    expect(names).toEqual({ char: 'none', glow: 'none', landscape: 'none' });
  });

  test('switches audience immediately', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('navigation', { name: 'See Affnook for' })
      .getByRole('link', { name: 'Brands', exact: true })
      .click();
    await expect(page).toHaveURL(/\/brands$/);
  });
});
