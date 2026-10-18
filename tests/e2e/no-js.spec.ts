import { expect, test } from '@playwright/test';

import { ROUTES } from './fixtures';

test.use({ javaScriptEnabled: false });

test('audience content renders and switching works without JavaScript', async ({ page }) => {
  await page.goto('/');
  for (const route of ROUTES) {
    await page
      .getByRole('navigation', { name: 'See Affnook for' })
      .getByRole('link', { name: route.label, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${route.path === '/' ? '/$' : route.path}$`));
    await expect(page.locator('h1')).toHaveText(route.h1);
    await expect(page.locator('h1')).toBeVisible();
  }
});
