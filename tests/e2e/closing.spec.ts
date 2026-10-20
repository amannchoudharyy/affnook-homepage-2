import { expect, test, type Page } from '@playwright/test';

/** Customization, Testimonials, Objections + FAQ, Resources and the Final CTA. */
const section = (page: Page, prefix: string) =>
  page.locator(`main section[aria-labelledby^="${prefix}-title"]`);

const RESOURCES = {
  '/': [
    ['iGaming Compliance Guide 2026: running a regulated business', /\/igaming-compliance\/$/],
    ['A step-by-step guide to auditing your affiliate program', /\/affiliate-program-audit\/$/],
    ['Cookieless tracking in iGaming: attribution after cookies', /\/cookieless-tracking\/$/],
  ],
  '/brands': [
    [
      'What is the average ROAS in iGaming affiliate marketing?',
      /\/average-roas-in-igaming-affiliate-marketing\/$/,
    ],
    [
      'The Sportsbook Ads Playbook: make every ad channel feed your affiliate',
      /\/sportsbook-ads\/$/,
    ],
    ['Affiliate marketing as a core channel for iGaming marketers', /\/industry-reports\/$/],
  ],
  '/affiliate-networks': [
    [
      'A 2026 tech playbook for scalable iGaming affiliate networks',
      /\/igaming-affiliate-networks\/$/,
    ],
    [
      'Building an affiliate network in iGaming: a guide to scaling',
      /\/building-an-affiliate-network\/$/,
    ],
    ['A step-by-step guide to auditing your affiliate program', /\/affiliate-program-audit\/$/],
  ],
} as const;

const CTA = {
  '/': 'Bring every brand into view.',
  '/brands': 'See which partners really pay off.',
  '/affiliate-networks': 'Grow partnerships, not paperwork.',
} as const;

const FAQ_CATEGORIES = ['General', 'Migration', 'Pricing', 'Fraud & data'];

test.describe('closing sections content', () => {
  test.use({ reducedMotion: 'reduce' });

  for (const [path, resources] of Object.entries(RESOURCES)) {
    test(`${path}: customization, testimonial, FAQ, resources and CTA`, async ({ page }) => {
      await page.goto(path);

      const custom = section(page, 'custom');
      await expect(custom.getByRole('heading', { level: 2 })).toHaveAccessibleName(
        'Customize everything, not just the colours.',
      );
      await expect(custom.getByRole('heading', { level: 3 })).toHaveText([
        'Your NGR formula',
        'Your tracking domain',
        'Your FX rates',
        'Your dashboard, your KPIs',
      ]);
      await expect(custom).toContainText(
        'Example: GGR minus bonuses minus chargebacks minus platform fees equals NGR.',
      );

      const testimonials = section(page, 'testimonials');
      await expect(testimonials.locator('blockquote')).toContainText(
        'We’ve been working closely with Affnook for over a year now',
      );
      await expect(testimonials.locator('figcaption')).toContainText('Yeva Avagyan');
      await expect(
        testimonials.getByRole('link', { name: /Client Satisfaction of the Year/ }),
      ).toHaveAttribute('href', /affpapa\.com/);

      const faq = section(page, 'faq');
      await expect(faq.getByRole('heading', { level: 3 })).toHaveText([
        '“Switching feels risky.”',
        '“Will it cost more than we think?”',
        '“Will it fit how we work?”',
        'FAQ',
      ]);
      for (const [name, href] of [
        ['How migration works', /\/seamless-migration\/$/],
        ['See pricing', /\/contact-sales\/$/],
        ['Explore customization', /\/features-on-request\/$/],
      ] as const) {
        await expect(faq.getByRole('link', { name: new RegExp(name) })).toHaveAttribute(
          'href',
          href,
        );
      }
      await expect(faq.getByRole('tab')).toHaveText(FAQ_CATEGORIES);

      const res = section(page, 'resources');
      await expect(res.getByRole('heading', { level: 3 })).toHaveText(
        resources.map(([title]) => title),
      );
      for (const [title, href] of resources) {
        await expect(res.getByRole('link', { name: title }).first()).toHaveAttribute('href', href);
      }
      await expect(res.getByRole('link', { name: /All resources/ })).toHaveAttribute(
        'href',
        /affnook\.com\/blog\/$/,
      );

      const cta = section(page, 'cta');
      await expect(cta.getByRole('heading', { level: 2 })).toHaveAccessibleName(
        CTA[path as keyof typeof CTA],
      );
      await expect(cta.getByRole('link', { name: /Book a free demo/ })).toHaveAttribute(
        'href',
        /book-free-demo\/$/,
      );
      await expect(cta.getByRole('link', { name: /Talk to sales/ })).toHaveAttribute(
        'href',
        /contact-sales\/$/,
      );
      await expect(cta.getByRole('listitem')).toHaveCount(3);
    });
  }

  test('FAQ categories and accordion work with the keyboard', async ({ page }) => {
    await page.goto('/');
    const faq = section(page, 'faq');
    const first = faq.getByRole('button', { name: 'Who is Affnook for?' });
    await expect(first).toHaveAttribute('aria-expanded', 'true');
    await expect(faq.getByText(/^iGaming operators, brands and affiliate networks/)).toBeVisible();

    // Open another question: it expands, the first collapses (and its answer is hidden).
    const second = faq.getByRole('button', { name: /existing tech stack/ });
    await second.focus();
    await page.keyboard.press('Enter');
    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await expect(first).toHaveAttribute('aria-expanded', 'false');
    await expect(faq.getByText(/100\+ two-way integrations, and the API/)).toBeVisible();
    await expect(faq.getByText(/^iGaming operators, brands and affiliate networks/)).toBeHidden();
    await page.keyboard.press('Space');
    await expect(second).toHaveAttribute('aria-expanded', 'false');

    // Category tabs: arrow keys move and activate.
    const tabs = faq.getByRole('tab');
    await tabs.first().focus();
    await page.keyboard.press('ArrowDown');
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    const panel = faq.getByRole('tabpanel');
    await expect(panel).toHaveCount(1);
    await expect(panel.getByRole('button').first()).toHaveAccessibleName(
      'How does migration work when we switch to Affnook?',
    );
    await expect(panel.getByRole('button').first()).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('End');
    await expect(tabs.last()).toHaveAttribute('aria-selected', 'true');
    await expect(faq.getByRole('tabpanel')).toContainText('Is Affnook GDPR and CCPA compliant?');
    await tabs.nth(2).click();
    await expect(faq.getByRole('tabpanel')).toContainText('Do you charge extra for data access?');
  });

  test('nothing in the closing sections animates under reduced motion', async ({ page }) => {
    await page.goto('/brands');
    const animated = await page.evaluate(
      () =>
        [
          ...document.querySelectorAll(
            ['custom', 'testimonials', 'faq', 'resources', 'cta']
              .map((s) => `main section[aria-labelledby^="${s}-title"] *`)
              .join(', '),
          ),
        ].filter((el) => getComputedStyle(el).animationName !== 'none').length,
    );
    expect(animated).toBe(0);
  });
});

test.describe('closing sections motion', () => {
  test('formula chips snap in, the link types out and the drag demo loops on screen only', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const custom = section(page, 'custom');
    const chip = custom.locator('[class*="chip"]').first();
    await expect(chip).toHaveCSS('opacity', '0');
    await custom
      .locator('article')
      .first()
      .evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(chip).toHaveCSS('opacity', '1', { timeout: 4000 });
    const url = custom.locator('[class$="url"]').first();
    await url.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(url).toHaveCSS('animation-name', /type-url/);
    const dragged = custom.locator('[class$="dragged"]');
    await dragged.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await expect(dragged).toHaveCSS('animation-play-state', 'running');
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(dragged).toHaveCSS('animation-play-state', 'paused');
  });

  test('testimonial quote lights up word by word while scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const quote = section(page, 'testimonials').locator('blockquote');
    const lit = () => quote.locator('[data-word][data-lit]').count();
    const total = await quote.locator('[data-word]').count();
    expect(await lit()).toBe(0);
    await quote.evaluate((el) => el.scrollIntoView({ block: 'end' }));
    await expect.poll(lit).toBeGreaterThan(0);
    await quote.evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await expect.poll(lit).toBe(total);
  });
});

test('final CTA glow breathes and landscape drifts only while on screen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/brands');
  const cta = section(page, 'cta');
  const glow = cta.locator('img[src*="glow-indigo"]');
  const land = cta.locator('img[src*="landscape"]');
  await cta.evaluate((el) => el.scrollIntoView());
  await expect(glow).toHaveCSS('animation-name', /cta-breathe/);
  await expect(glow).toHaveCSS('animation-play-state', 'running');
  await expect(land).toHaveCSS('animation-play-state', 'running');
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(glow).toHaveCSS('animation-play-state', 'paused');
  await expect(land).toHaveCSS('animation-play-state', 'paused');
});

test.describe('closing sections without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('every FAQ category and answer is visible', async ({ page }) => {
    await page.goto('/affiliate-networks');
    const faq = section(page, 'faq');
    await expect(faq.getByRole('tablist')).toBeHidden();
    for (const cat of FAQ_CATEGORIES) {
      await expect(faq.getByRole('heading', { level: 4, name: cat })).toBeVisible();
    }
    await expect(faq.getByText('Do you charge extra for data access?')).toBeVisible();
    await expect(faq.getByText(/Reports refresh every minute/)).toBeVisible();
    await expect(section(page, 'custom').locator('[class*="chip"]').first()).toBeVisible();
    await expect(
      section(page, 'cta').getByRole('link', { name: /Book a free demo/ }),
    ).toBeVisible();
  });
});
