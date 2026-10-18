import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test.describe('mobile menu', () => {
  test('opens, locks scroll, manages focus and closes on Escape', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open menu' });
    await expect(page.getByRole('navigation', { name: 'Main', exact: true })).toBeHidden();
    await toggle.click();
    const close = page.getByRole('button', { name: 'Close menu' });
    await expect(close).toHaveAttribute('aria-expanded', 'true');
    const menu = page.getByRole('navigation', { name: 'Main menu' });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('button', { name: 'Solutions' })).toBeFocused();
    await expect(page.locator('html')).toHaveCSS('overflow', 'hidden');

    // Page cannot scroll while the menu is open.
    await page.mouse.wheel(0, 800);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
    await expect(menu).toBeHidden();
    await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
  });

  test('accordion sections expand and links close the menu', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.getByRole('navigation', { name: 'Main menu' });
    const solutions = menu.getByRole('button', { name: 'Solutions' });
    await solutions.click();
    await expect(solutions).toHaveAttribute('aria-expanded', 'true');
    await menu.getByRole('link', { name: 'Brands', exact: true }).click();
    await expect(page).toHaveURL(/\/brands$/);
    await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
  });

  test('menu closes when resized to desktop', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
    await expect(page.getByRole('navigation', { name: 'Main', exact: true })).toBeVisible();
  });
});
