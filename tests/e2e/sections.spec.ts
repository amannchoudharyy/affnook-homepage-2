import { expect, test } from '@playwright/test';

import { QA_WIDTHS } from './fixtures';

const PROBLEM = {
  '/': {
    heading: 'Your brands keep growing. Your view of them doesn’t.',
    cards: [
      'Too many panels',
      'No clear winner',
      'Every launch starts from zero',
      'Fraud slips between tools',
    ],
  },
  '/brands': {
    heading: 'Your partners drive growth. You can’t see which ones.',
    cards: [
      'Dashboard hopping',
      'Deposits without a source',
      'Payouts by spreadsheet',
      'Paying for bots',
    ],
  },
  '/affiliate-networks': {
    heading: 'Your network keeps growing. Your ops team can’t.',
    cards: [
      'Commission rules by hand',
      'Brands × tiers × publishers',
      'Reconciliation that never ends',
      'Fraud across every campaign',
    ],
  },
} as const;

/** Stats in visual (left → right) order, per Figma. */
const STAKES = {
  '/': {
    heading: 'Fraud isn’t a rounding error. It’s a line item.',
    values: ['83%', '64%', '50%'],
  },
  '/brands': {
    heading: 'Fake traffic isn’t a rounding error. It’s budget you don’t get back.',
    values: ['50%', '64%', '83%'],
  },
  '/affiliate-networks': {
    heading: 'Custom deals win partners. Manual maths can’t keep up.',
    values: ['62%', '19%', '50%'],
  },
} as const;

const problemSection = (page: import('@playwright/test').Page) =>
  page.locator('main section[aria-labelledby^="problem-title"]');
const stakesSection = (page: import('@playwright/test').Page) =>
  page.locator('main section[aria-labelledby^="stakes-title"]');

test.describe('section content and structure', () => {
  test.use({ reducedMotion: 'reduce' });

  for (const [path, problem] of Object.entries(PROBLEM)) {
    test(`${path}: logos, problem and stakes match the audience's Figma content`, async ({
      page,
    }) => {
      await page.goto(path);

      // Logos: one accessible list of 10 wordmarks (the marquee duplicate is hidden) + 2 awards.
      const logos = page.locator('main section[aria-labelledby="logos-title"]');
      await expect(logos.getByRole('heading', { level: 2 })).toHaveText(
        /Trusted by iGaming operators/i,
      );
      await expect(logos.getByRole('list').first().getByRole('listitem')).toHaveCount(10);
      await expect(logos.locator('ul[aria-hidden="true"]')).toHaveCount(1);
      for (const alt of [
        'FinancesOnline Rising Star 2024 award badge',
        'AffPapa iGaming Awards 2024 winner badge',
      ]) {
        const img = logos.getByRole('img', { name: alt });
        // Award images are lazy-loaded below the fold: scroll them in and wait for decode.
        await img.scrollIntoViewIfNeeded();
        await expect(img).toBeVisible();
        await expect
          .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
          .toBe(true);
      }

      // Problem: audience heading + four card titles in order.
      const section = problemSection(page);
      await expect(section.getByRole('heading', { level: 2 })).toHaveAccessibleName(
        problem.heading,
      );
      await expect(section.getByRole('heading', { level: 3 })).toHaveText([...problem.cards]);
      await expect(section.getByText('Sample data', { exact: true })).toHaveCount(
        path === '/brands' ? 1 : 0,
      );

      // Stakes: headline and figures in the Figma order, each with a visible source.
      const stakes = stakesSection(page);
      const expected = STAKES[path as keyof typeof STAKES];
      await expect(stakes.getByRole('heading', { level: 2 })).toHaveAccessibleName(
        expected.heading,
      );
      const values = await stakes
        .locator('li')
        .evaluateAll((items) =>
          items.map((li) => li.querySelector('span:nth-child(2)')?.textContent),
        );
      expect(values).toEqual(expected.values);
      await expect(stakes.getByText(/^Source:/)).toHaveCount(3);
    });
  }

  test('heading levels never skip (h1 → h2 → h3)', async ({ page }) => {
    for (const path of Object.keys(PROBLEM)) {
      await page.goto(path);
      const levels = await page.evaluate(() =>
        [...document.querySelectorAll('main h1, main h2, main h3, main h4')].map((h) =>
          Number(h.tagName[1]),
        ),
      );
      expect(levels[0]).toBe(1);
      for (let i = 1; i < levels.length; i++) {
        expect(levels[i]! - levels[i - 1]!).toBeLessThanOrEqual(1);
      }
    }
  });
});

test.describe('section motion', () => {
  test('logo marquee runs, pauses on hover and pauses off screen', async ({ page, isMobile }) => {
    await page.goto('/');
    const marquee = page
      .locator('main section[aria-labelledby="logos-title"] ul')
      .first()
      .locator('..');
    await marquee.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(marquee).toHaveCSS('animation-name', /marquee/);
    await expect(marquee).toHaveCSS('animation-play-state', 'running');
    if (!isMobile) {
      // The track never stops moving, so move the mouse directly instead of hover().
      // Hover the visible marquee viewport (the track itself is wider than the screen).
      const box = (await marquee.locator('..').boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await expect(marquee).toHaveCSS('animation-play-state', 'paused');
    }
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.mouse.move(0, 0);
    await expect(marquee).toHaveCSS('animation-play-state', 'paused');
  });

  test('problem cards reveal as they scroll in', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 800 });
    await page.goto('/');
    const card = problemSection(page).locator('article').last();
    await expect(card).not.toHaveAttribute('data-in');
    await expect(card).toHaveCSS('opacity', '0');
    await card.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(card).toHaveAttribute('data-in', '');
    await expect(card).toHaveCSS('opacity', '1');
  });

  test('problem statement lights up word by word while scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 800 });
    await page.goto('/');
    const heading = problemSection(page).getByRole('heading', { level: 2 });
    const lit = () => heading.locator('[data-word][data-lit]').count();
    const total = await heading.locator('[data-word]').count();
    expect(await lit()).toBe(0);
    await heading.evaluate((el) => el.scrollIntoView({ block: 'end' }));
    await expect.poll(lit).toBeGreaterThan(0);
    await heading.evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await expect.poll(lit).toBe(total);
  });

  test('stakes figures count up to their final values', async ({ page }) => {
    await page.goto('/affiliate-networks');
    const stakes = stakesSection(page);
    await stakes.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    for (const v of ['62%', '19%', '50%']) {
      await expect(stakes.getByText(v, { exact: true })).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('sections with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('nothing is hidden, highlighted or animated', async ({ page }) => {
    await page.goto('/brands');
    const state = await page.evaluate(() => ({
      armed: document.querySelectorAll('[data-reveal="armed"], [data-scrub="armed"]').length,
      animated: [...document.querySelectorAll('main section *')].filter(
        (el) => getComputedStyle(el).animationName !== 'none',
      ).length,
    }));
    expect(state).toEqual({ armed: 0, animated: 0 });
  });
});

test.describe('sections without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('all section content is visible and logos are a static list', async ({ page }) => {
    await page.goto('/affiliate-networks');
    for (const card of PROBLEM['/affiliate-networks'].cards) {
      await expect(page.getByRole('heading', { level: 3, name: card })).toBeVisible();
    }
    await expect(stakesSection(page).getByText('62%', { exact: true })).toBeVisible();
    await expect(
      page.locator('main section[aria-labelledby="logos-title"] ul[aria-hidden="true"]'),
    ).toBeHidden();
    const opacities = await page
      .locator('main [data-reveal]')
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
    expect(new Set(opacities)).toEqual(new Set(['1']));
  });
});

test.describe('section responsive layout', () => {
  test.skip(({ isMobile }) => isMobile, 'Width matrix runs in the desktop project only');
  test.use({ reducedMotion: 'reduce' });

  for (const path of Object.keys(PROBLEM)) {
    for (const width of QA_WIDTHS) {
      test(`${path} @ ${width}px: cards, funnel and stats fit without clipping`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        const problems = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          // The hero (and its full-bleed product stage) is covered by stage.spec.ts.
          const scope = 'main section:not([aria-labelledby="hero-title"])';
          const sel = ['article', 'li', 'figure', 'h2'].map((t) => `${scope} ${t}`).join(', ');
          const els = [...document.querySelectorAll<HTMLElement>(sel)].filter(
            (el) => !el.closest('[aria-labelledby="logos-title"] ul') && el.offsetParent !== null,
          );
          const outside = els
            .map((el) => el.getBoundingClientRect())
            .filter((r) => r.left < -0.5 || r.right > vw + 0.5).length;
          const clipped = [
            ...document.querySelectorAll<HTMLElement>(`${scope} article, ${scope} figure`),
          ]
            .filter((el) => el.scrollWidth > el.clientWidth + 1)
            .map((el) => el.className.split(' ')[0]);
          return { outside, clipped, scroll: document.documentElement.scrollWidth - vw };
        });
        expect(problems).toEqual({ outside: 0, clipped: [], scroll: 0 });
      });
    }
  }
});
