import { expect, test } from '@playwright/test';

import { ROUTES } from './fixtures';

/**
 * The muted second H1 line (#7A84B0) sits on top of the indigo glow image, which automated
 * contrast tools cannot evaluate. This measures the real rendered background behind it and
 * asserts WCAG 1.4.3 large-text contrast (≥ 3:1). The text is ≥ 40px semibold, so the
 * large-text threshold applies.
 */
test.skip(({ isMobile }) => isMobile, 'Desktop project only');
test.use({ reducedMotion: 'reduce' });

const luminance = ([r, g, b]: number[]) => {
  const c = [r, g, b].map((v) => {
    const s = v! / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
};
const ratio = (a: number[], b: number[]) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1! + 0.05) / (l2! + 0.05);
};

for (const route of ROUTES) {
  for (const width of [390, 1440, 1920]) {
    test(`muted headline contrast ${route.path} @ ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route.path, { waitUntil: 'networkidle' });
      const line = page.locator('h1 [aria-hidden] > span').nth(1);
      const box = (await line.boundingBox())!;
      await page.addStyleTag({
        // Hide the text, and freeze the breathing glows at their brightest (peak) frame.
        content:
          'h1, h1 * { color: transparent !important; } ' +
          'main img[src*="glow"] { animation: none !important; opacity: 1 !important; transform: scale(1.12) !important; }',
      });
      const png = await page.screenshot({ clip: box });
      const brightest = await page.evaluate(async (b64) => {
        const img = new Image();
        img.src = `data:image/png;base64,${b64}`;
        await img.decode();
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        let best = [0, 0, 0];
        let bestSum = -1;
        for (let i = 0; i < data.length; i += 4) {
          const sum = data[i]! + data[i + 1]! + data[i + 2]!;
          if (sum > bestSum) {
            bestSum = sum;
            best = [data[i]!, data[i + 1]!, data[i + 2]!];
          }
        }
        return best;
      }, png.toString('base64'));
      const contrast = ratio([0x7a, 0x84, 0xb0], brightest);
      console.log(
        `${route.path} @ ${width}: brightest bg rgb(${brightest.join(',')}) → ${contrast.toFixed(2)}:1`,
      );
      expect(contrast).toBeGreaterThanOrEqual(3);
    });
  }
}
