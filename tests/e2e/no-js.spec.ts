import { expect, test } from '@playwright/test';

import { pathRegExp, ROUTES } from './fixtures';

test.use({ javaScriptEnabled: false });

test('essential content is visible and switching works without JavaScript', async ({ page }) => {
  await page.goto('/');
  for (const route of ROUTES) {
    await page
      .getByRole('navigation', { name: 'See Affnook for' })
      .getByRole('link', { name: route.label, exact: true })
      .click();
    await expect(page).toHaveURL(pathRegExp(route.path));
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveAccessibleName(route.h1);
    await expect(h1).toBeVisible();
    // Entrance animations must not hold content hidden without JS.
    expect(
      await h1.evaluate(
        (el) => getComputedStyle(el.querySelector('[aria-hidden] span span span')!).animationName,
      ),
    ).toBe('none');
    const main = page.locator('main');
    await expect(main.getByRole('link', { name: /Book a free demo/ })).toBeVisible();
    await expect(main.getByRole('link', { name: /Take the tour/ })).toBeVisible();
    await expect(main.locator('p').first()).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  }
});

test('mobile without JavaScript offers a menu link to the footer sitemap', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menuLink = page.getByRole('link', { name: 'Menu', exact: true });
  await expect(menuLink).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
  await menuLink.click();
  await expect(page).toHaveURL(/#site-footer$/);
});

test('desktop dropdown links remain reachable without JavaScript', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main', exact: true });
  await nav.getByRole('button', { name: 'Platform' }).hover();
  await expect(nav.getByRole('link', { name: 'Automated invoicing' })).toBeVisible();
});
