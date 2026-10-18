import { expect, test } from '@playwright/test';

/**
 * The newsletter is not integrated yet. It must be impossible to submit, must not send any
 * request and must never show a success message.
 */
test('newsletter placeholder cannot submit or fake a success', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (req) => {
    if (req.method() !== 'GET') requests.push(`${req.method()} ${req.url()}`);
  });
  await page.goto('/');
  const footer = page.locator('footer');
  const email = footer.getByLabel('Work email');
  const submit = footer.getByRole('button', { name: 'Submit' });

  await expect(email).toBeDisabled();
  await expect(submit).toBeDisabled();
  await expect(submit).toHaveAttribute('type', 'button');
  await expect(footer.locator('form')).not.toHaveAttribute('action');
  await expect(footer.getByText('Newsletter sign-up is coming soon.')).toBeVisible();

  // Force interactions anyway (as an attacker or a broken script might).
  await submit.click({ force: true });
  await email.evaluate((el: HTMLInputElement) => el.form?.requestSubmit?.());
  await page.waitForTimeout(500);

  expect(page.url()).not.toContain('email=');
  expect(requests).toEqual([]);
  await expect(page.getByText(/subscribed|thank you|thanks!/i)).toHaveCount(0);
});
