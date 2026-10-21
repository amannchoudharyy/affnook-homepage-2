import { expect, test, type Page } from '@playwright/test';

/** Proof (case-study carousel) and How it works (+ capability tabs). */
const AUDIENCES = {
  '/': {
    proof: 'Operators who made the switch.',
    cases: ['Unicon365', 'Gamegram', 'Slot Bunny'],
    how: 'From demo to live in four steps.',
    windows: true,
    tabs: [
      'Multi-brand reporting',
      'Attribution tracking',
      'Fraud Shield',
      'Automated invoicing',
      'Tiered payouts',
      'Two-way API',
    ],
  },
  '/brands': {
    proof: 'Brands that grew with Affnook.',
    cases: ['Gamegram', 'Slot Bunny', 'Unicon365'],
    how: 'From demo to live in four steps.',
    windows: true,
    tabs: [
      'Attribution tracking',
      'Player LTV',
      'Fraud Shield',
      'Automated invoicing',
      'Tiered payouts',
      'Two-way API',
    ],
  },
  '/affiliate-networks': {
    proof: 'Built for networks at scale.',
    cases: ['What Affnook runs today', 'Unicon365', 'Gamegram'],
    how: 'How it all comes together.',
    windows: false,
    tabs: [
      'Tiered payouts',
      'Commission bundling',
      'Fraud Shield',
      'Automated invoicing',
      'Attribution tracking',
      'Two-way API',
    ],
  },
} as const;

const CASE_LINKS: Record<string, RegExp> = {
  Unicon365: /customer-success-story-online-casino-brand\/$/,
  Gamegram: /customer-success-story-gamegram\/$/,
  'Slot Bunny': /customer-success-story-slot-bunny\/$/,
  'What Affnook runs today': /why-choose-affnook\/$/,
};

const STEPS = [
  'Book a free demo',
  'Sign up & onboard',
  'Migrate, integrate, launch',
  'Set up, optimise & scale',
];

const proof = (page: Page) => page.locator('main section[aria-labelledby^="proof-title"]');
const how = (page: Page) => page.locator('main section[aria-labelledby^="how-title"]');
const slides = (page: Page) => proof(page).locator('[data-slide]');
const activeSlide = (page: Page) =>
  slides(page).evaluateAll((els) => els.findIndex((el) => el.hasAttribute('data-active')));

test.describe('proof and how-it-works content', () => {
  test.use({ reducedMotion: 'reduce' });

  for (const [path, a] of Object.entries(AUDIENCES)) {
    test(`${path}: cases, steps and tabs match the audience`, async ({ page }) => {
      await page.goto(path);

      const p = proof(page);
      await expect(p.getByRole('heading', { level: 2 })).toHaveAccessibleName(a.proof);
      await expect(p.getByRole('region', { name: a.proof })).toHaveAttribute(
        'aria-roledescription',
        'carousel',
      );
      // Case names, then the closing invitation.
      await expect(p.getByRole('heading', { level: 3 })).toHaveText([
        ...a.cases,
        'Your brand could be the next story.',
      ]);
      for (const name of a.cases) {
        await expect(p.getByRole('link', { name: new RegExp(`about ${name}`) })).toHaveAttribute(
          'href',
          CASE_LINKS[name]!,
        );
      }
      await expect(p.getByRole('slider')).toHaveCount(3);

      const h = how(page);
      await expect(h.getByRole('heading', { level: 2 })).toHaveAccessibleName(a.how);
      const stepTitles = h.locator('ol li [class*="stepTitle"]');
      await expect(stepTitles).toHaveText(STEPS);
      await expect(h.getByRole('button', { name: /^0[1-4]/ })).toHaveCount(a.windows ? 4 : 0);
      if (!a.windows) await expect(h.getByRole('figure')).toHaveCount(1);
      await expect(h.getByRole('tab')).toHaveText([...a.tabs]);
      await expect(h.getByRole('tabpanel')).toHaveCount(1);
      await expect(
        h.getByText('Sample data', { exact: true }).filter({ visible: true }).first(),
      ).toBeVisible();
    });
  }

  test('capability tabs follow the WAI-ARIA keyboard pattern', async ({ page }) => {
    await page.goto('/');
    const tabs = how(page).getByRole('tab');
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(how(page).getByRole('tabpanel')).toContainText('Trace every deposit');
    await page.keyboard.press('End');
    await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
    await expect(how(page).getByRole('tabpanel')).toContainText('Push and pull data');
    await page.keyboard.press('ArrowRight');
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    await tabs.nth(3).click();
    await expect(how(page).getByRole('tabpanel')).toContainText('Invoices that send themselves');
    await expect(tabs.nth(3)).toHaveAttribute('tabindex', '0');
    await expect(tabs.first()).toHaveAttribute('tabindex', '-1');
  });

  test('selecting a step swaps its window', async ({ page }) => {
    await page.goto('/brands');
    const step = how(page).getByRole('button', { name: /^01/ });
    await step.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await step.click();
    await expect(step).toHaveAttribute('aria-current', 'step');
    const active = how(page).locator('[class*="panel"][data-active]');
    await expect(active).toHaveCount(1);
    await expect(active).toContainText('Pick a time that suits you');
    await page.keyboard.press('Tab');
    await expect(how(page).getByRole('button', { name: /^02/ })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(active).toContainText('Your CSM sets this up with you');
  });

  test('before/after slider works with the keyboard', async ({ page }) => {
    await page.goto('/');
    const knob = proof(page).getByRole('slider').first();
    await knob.focus();
    await expect(knob).toHaveAttribute('aria-valuenow', '50');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(knob).toHaveAttribute('aria-valuenow', '60');
    await page.keyboard.press('PageDown');
    await expect(knob).toHaveAttribute('aria-valuenow', '40');
    await page.keyboard.press('End');
    await expect(knob).toHaveAttribute('aria-valuenow', '100');
    await expect(knob).toHaveAttribute('aria-valuetext', '100% before, 0% after');
    await page.keyboard.press('Home');
    await expect(knob).toHaveAttribute('aria-valuenow', '0');
  });

  test('no sweep or scroll-tied motion under reduced motion', async ({ page }) => {
    await page.goto('/');
    await proof(page).evaluate((el) => el.scrollIntoView());
    await page.waitForTimeout(2200);
    await expect(proof(page).getByRole('slider').first()).toHaveAttribute('aria-valuenow', '50');
    const animated = await proof(page).evaluate(
      (el) =>
        [...el.querySelectorAll('*')].filter((n) => getComputedStyle(n).animationName !== 'none')
          .length,
    );
    expect(animated).toBe(0);
  });
});

test.describe('proof and how-it-works interactions', () => {
  test('carousel arrows and dots move between cases', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await proof(page).evaluate((el) => el.scrollIntoView());
    const prev = proof(page).getByRole('button', { name: 'Previous case study' });
    const next = proof(page).getByRole('button', { name: 'Next case study' });
    await expect(prev).toBeDisabled();
    await next.click();
    await expect.poll(() => activeSlide(page)).toBe(1);
    await expect(proof(page).getByRole('button', { name: /case study 2/ })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await proof(page)
      .getByRole('button', { name: /case study 3/ })
      .click();
    await expect.poll(() => activeSlide(page)).toBe(2);
    await expect(next).toBeDisabled();
    await prev.click();
    await expect.poll(() => activeSlide(page)).toBe(1);
  });

  test('carousel can be dragged with the mouse', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Touch swipes natively; mouse drag is a desktop enhancement');
    // 900px: carousel mode (the pinned horizontal scroll starts above 900px).
    await page.setViewportSize({ width: 900, height: 900 });
    await page.goto('/brands');
    const story = proof(page).locator('[data-slide]').first().locator('p').first();
    await story.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    const box = (await story.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + 10);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 - 150, box.y + 10, { steps: 6 });
    await page.mouse.move(box.x + box.width / 2 - 300, box.y + 10, { steps: 6 });
    await page.mouse.up();
    await expect.poll(() => activeSlide(page)).toBe(1);
  });

  test('pinned mode: dragging the track moves it and the page scroll together', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Pinned mode needs a viewport wider than 900px');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/brands');
    const root = proof(page).locator('[data-pin-root]');
    await root.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY + 200));
    const track = proof(page).locator('[class*="track"]').first();
    const pinX = () => track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);
    await expect.poll(pinX).toBeLessThan(0);
    const x0 = await pinX();
    const y0 = await page.evaluate(() => scrollY);
    const story = proof(page).locator('[data-slide] p').first();
    const box = (await story.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + 10);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 - 150, box.y + 10, { steps: 6 });
    await page.mouse.move(box.x + box.width / 2 - 300, box.y + 10, { steps: 6 });
    await page.mouse.up();
    await expect.poll(async () => Math.round(x0 - (await pinX()))).toBeGreaterThan(270);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(y0 + 200);
  });

  test('before/after slider follows the pointer and sweeps once on enter', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const knob = proof(page).getByRole('slider').first();
    const values = new Set<string>();
    await proof(page).evaluate((el) => el.scrollIntoView());
    for (let i = 0; i < 12; i++) {
      values.add((await knob.getAttribute('aria-valuenow'))!);
      await page.waitForTimeout(150);
    }
    expect(values.size).toBeGreaterThan(2);
    await expect(knob).toHaveAttribute('aria-valuenow', '50', { timeout: 3000 });
    const area = (await proof(page).locator('[class*="compare"]').first().boundingBox())!;
    await page.mouse.move(area.x + area.width * 0.25, area.y + area.height / 2);
    await page.mouse.down();
    await page.mouse.move(area.x + area.width * 0.8, area.y + area.height / 2, { steps: 5 });
    await page.mouse.up();
    await expect
      .poll(async () => Number(await knob.getAttribute('aria-valuenow')))
      .toBeGreaterThan(75);
  });

  test('desktop steps follow the scroll position', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const explorer = how(page).locator('[class*="explorer"]');
    const current = () =>
      how(page)
        .locator('ol li')
        .evaluateAll((items) => items.findIndex((li) => li.hasAttribute('data-active')));
    await explorer.evaluate((el) =>
      window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 700),
    );
    await expect.poll(current).toBe(0);
    await explorer.evaluate((el) =>
      window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 20),
    );
    await expect.poll(current).toBe(3);
  });
});

test('networks flow connectors draw in, stream on screen and pause off screen', async ({
  page,
}) => {
  await page.goto('/affiliate-networks');
  const flow = how(page).getByRole('figure');
  const stream = flow.locator('[class*="flowStream"]').first();
  await flow.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await expect(flow).toHaveAttribute('data-in', '');
  await expect(stream).toHaveCSS('animation-play-state', 'running');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(stream).toHaveCSS('animation-play-state', 'paused');
});

test.describe('proof and how-it-works without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('every case, step and capability panel is readable', async ({ page }) => {
    await page.goto('/affiliate-networks');
    await expect(slides(page)).toHaveCount(3);
    await expect(proof(page).getByRole('button', { name: 'Next case study' })).toBeHidden();
    await expect(how(page).locator('ol li [class*="stepTitle"]')).toHaveText(STEPS);
    const panels = how(page).getByRole('tabpanel', { includeHidden: true });
    await expect(panels).toHaveCount(6);
    for (const panel of await panels.all()) await expect(panel).toBeVisible();
  });
});
