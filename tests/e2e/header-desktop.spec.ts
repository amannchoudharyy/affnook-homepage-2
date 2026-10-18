import { expect, test } from '@playwright/test';

test.skip(({ isMobile }) => isMobile, 'Desktop navigation only');

test.describe('desktop navigation', () => {
  test('dropdowns open on click, close on Escape and restore focus', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main', exact: true });
    const trigger = nav.getByRole('button', { name: 'Platform' });
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('link', { name: 'Automated invoicing' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
    await expect(nav.getByRole('link', { name: 'Automated invoicing' })).toBeHidden();
  });

  test('keyboard: Enter opens a dropdown and Tab enters the panel', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main', exact: true });
    const trigger = nav.getByRole('button', { name: 'Resources' });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab');
    await expect(nav.getByRole('link', { name: 'Blogs' })).toBeFocused();
  });

  test('only one dropdown is open at a time and outside clicks close it', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main', exact: true });
    await nav.getByRole('button', { name: 'Solutions' }).click();
    await nav.getByRole('button', { name: 'Resources' }).click();
    await expect(nav.locator('button[aria-expanded="true"]')).toHaveCount(1);
    await page.mouse.click(10, 600);
    await expect(nav.locator('button[aria-expanded="true"]')).toHaveCount(0);
  });

  test('Solutions items switch audience and mark the current one', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Main', exact: true });
    await nav.getByRole('button', { name: 'Solutions' }).click();
    await expect(nav.getByRole('link', { name: /Operators/ })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await nav.getByRole('link', { name: /Affiliate networks/ }).click();
    await expect(page).toHaveURL(/\/affiliate-networks$/);
    await expect(nav.getByRole('button', { name: 'Solutions' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
