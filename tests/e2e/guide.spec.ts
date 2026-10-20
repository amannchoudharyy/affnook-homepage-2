import { expect, test, type Page } from '@playwright/test';

/** Turn ("Affnook as your guide") and Affnook MCP sections. */
const TURN = {
  '/': {
    heading: 'Five brands shouldn’t mean five logins.',
    cta: 'Why operators choose Affnook',
    question: 'Can we add a custom NGR formula for our poker brand?',
  },
  '/brands': {
    heading: 'Grow the brand. Skip the spreadsheets.',
    cta: 'Why brands choose Affnook',
    question: 'Can we pay our top partners weekly instead of monthly?',
  },
  '/affiliate-networks': {
    heading: 'Payouts shouldn’t need a whole team.',
    cta: 'Why networks choose Affnook',
    question: 'Can Tier 2 publishers get CPA plus 25% rev share on one brand only?',
  },
} as const;

const PROMISES: [string, RegExp][] = [
  ['Dedicated CSM', /affnook\.com\/24-7-support\/$/],
  ['24/7 support', /affnook\.com\/24-7-support\/$/],
  ['Anti-fraud built in', /affnook\.com\/book-free-demo\/$/],
  ['Features on request', /affnook\.com\/contact-sales\/$/],
];

const PROMPTS = [
  'What were my top 5 affiliates by NGR this month?',
  'Which campaigns converted best yesterday?',
  'What payouts are due this week, and to whom?',
];

const turn = (page: Page) => page.locator('main section[aria-labelledby^="turn-title"]');
const mcp = (page: Page) => page.locator('main section[aria-labelledby^="mcp-title"]');
const composer = (page: Page) => mcp(page).locator('[class*="composerText"]');

test.describe('turn and MCP content', () => {
  test.use({ reducedMotion: 'reduce' });

  for (const [path, copy] of Object.entries(TURN)) {
    test(`${path}: turn and MCP match the Figma content`, async ({ page }) => {
      await page.goto(path);

      const section = turn(page);
      await expect(section.getByRole('heading', { level: 2 })).toHaveAccessibleName(copy.heading);
      await expect(section.getByRole('link', { name: new RegExp(copy.cta) })).toHaveAttribute(
        'href',
        /affnook\.com\/why-choose-affnook\/$/,
      );
      // Sample conversation: described for assistive tech, labelled as sample on screen.
      await expect(section.locator('figcaption')).toContainText(copy.question);
      await expect(section.getByText('Sample conversation', { exact: true })).toBeVisible();
      await expect(section.getByRole('heading', { level: 3 })).toHaveText(
        PROMISES.map(([title]) => title),
      );
      for (const [title, href] of PROMISES) {
        await expect(section.getByRole('link', { name: new RegExp(`^${title}`) })).toHaveAttribute(
          'href',
          href,
        );
      }
      await expect(section.locator('ul').last().getByRole('listitem')).toHaveCount(4);

      const assistant = mcp(page);
      await expect(assistant.getByRole('heading', { level: 2 })).toHaveAccessibleName(
        'Your Affnook Data, Now in Your AI Assistant',
      );
      await expect(assistant.getByRole('link', { name: /Explore Affnook MCP/ })).toHaveAttribute(
        'href',
        /affnook\.com\/affnook-mcp\/$/,
      );
      await expect(assistant.getByRole('button')).toContainText(PROMPTS);
      await expect(assistant.locator('figcaption')).toContainText(
        'Product demo: sample conversation and data, not a live AI response.',
      );
      // A demo, not an integration: no form, no input and no send control.
      await expect(assistant.locator('form, input, textarea')).toHaveCount(0);
      await expect(assistant.getByRole('button', { name: /send/i })).toHaveCount(0);
    });
  }

  test('prompt chips place the prompt in the demo composer (keyboard)', async ({ page }) => {
    await page.goto('/');
    const chip = mcp(page).getByRole('button', { name: PROMPTS[2] });
    await chip.focus();
    await page.keyboard.press('Enter');
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await expect(composer(page)).toHaveText(PROMPTS[2]!);
    await expect(mcp(page).getByRole('status')).toHaveText(
      `Example prompt placed in the demo: ${PROMPTS[2]}`,
    );
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Space');
    await expect(composer(page)).toHaveText(PROMPTS[1]!);
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
  });

  test('nothing in turn or MCP is hidden or animated under reduced motion', async ({ page }) => {
    await page.goto('/affiliate-networks');
    await mcp(page).evaluate((el) => el.scrollIntoView());
    const state = await page.evaluate(() => ({
      armed: document.querySelectorAll('[data-seq], [data-demo]').length,
      hidden: [
        ...document.querySelectorAll(
          'main section[aria-labelledby^="turn"] *, main section[aria-labelledby^="mcp"] *',
        ),
      ].filter((el) => getComputedStyle(el).opacity === '0').length,
    }));
    expect(state).toEqual({ armed: 0, hidden: 0 });
  });
});

test.describe('turn and MCP motion', () => {
  test('chat bubbles enter in order and uptime bars fill', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/brands');
    const chat = turn(page).locator('[data-step]');
    await expect(chat).toHaveAttribute('data-step', '0');
    await expect(chat.locator('p').first()).toHaveCSS('opacity', '0');
    await turn(page).evaluate((el) => el.scrollIntoView());
    await expect(chat).toHaveAttribute('data-step', '2', { timeout: 3000 });
    await expect(chat.locator('[class*="typing"]')).toBeVisible();
    await expect(chat).toHaveAttribute('data-seq', 'done', { timeout: 4000 });
    await expect(chat.locator('[class*="typing"]')).toBeHidden();
    await expect(chat.locator('p').last()).toHaveCSS('opacity', '1');
    const bar = turn(page).locator('[class*="bars"] i').last();
    await expect
      .poll(() => bar.evaluate((el) => getComputedStyle(el).transform))
      .toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  });

  test('assistant types the question, reveals the answer and cycles prompts once', async ({
    page,
  }) => {
    test.slow();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const grid = mcp(page).locator('[data-demo]');
    await expect(grid).toHaveAttribute('data-demo', 'armed');
    await mcp(page).evaluate((el) => el.scrollIntoView());
    // The question types out, then the tool call, answer, table and follow-up appear.
    await expect(grid).toHaveAttribute('data-typing', '');
    await expect(grid).toHaveAttribute('data-show', 'window tool answer table follow', {
      timeout: 6000,
    });
    await expect(mcp(page).locator('[class*="question"]')).toContainText(
      'Which affiliates drove the most revenue last week?',
    );
    // Each prompt cycles into the composer once, then it returns to its placeholder.
    for (const prompt of PROMPTS) {
      await expect(composer(page)).toHaveText(prompt, { timeout: 6000 });
    }
    await expect(composer(page)).toHaveText('Ask about performance, payouts, campaigns…', {
      timeout: 6000,
    });
    await expect(mcp(page).getByRole('button', { pressed: true })).toHaveCount(0);
  });

  test('pressing a chip stops the cycle and keeps the chosen prompt', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await mcp(page).evaluate((el) => el.scrollIntoView());
    await expect(composer(page)).toHaveText(PROMPTS[0]!, { timeout: 8000 });
    await mcp(page).getByRole('button', { name: PROMPTS[2] }).click();
    await expect(composer(page)).toHaveText(PROMPTS[2]!);
    await page.waitForTimeout(5000);
    await expect(composer(page)).toHaveText(PROMPTS[2]!);
  });
});

test.describe('turn and MCP without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('full conversation and cards are visible', async ({ page }) => {
    await page.goto('/brands');
    const chat = turn(page).locator('figure > div[aria-hidden]');
    await expect(chat).toBeVisible();
    await expect(chat).toContainText(TURN['/brands'].question);
    await expect(turn(page).getByRole('link', { name: /^Dedicated CSM/ })).toBeVisible();
    const demo = mcp(page).locator('figure > div[aria-hidden]');
    await expect(demo).toBeVisible();
    await expect(demo).toContainText('SlotScout');
    await expect(demo).toContainText('Want me to check which of these');
    await expect(composer(page)).toHaveText('Ask about performance, payouts, campaigns…');
  });
});
