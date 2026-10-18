import { AudienceSwitcher } from '@/components/audience/AudienceSwitcher';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowUpRightIcon } from '@/components/ui/icons';
import type { Audience } from '@/content/audiences';
import { CTA_LINKS } from '@/content/links';

import styles from './Hero.module.css';
import { SplitHeadline } from './SplitHeadline';
import { ProductStage } from './stage/ProductStage';

/**
 * Hero (Figma "Hero" 1512×1520): ambient glows + drifting data landscape, award chip,
 * audience headline, CTAs, the audience switcher and the audience-specific product stage
 * (dashboard window + floating cards).
 */
export function Hero({ audience }: { audience: Audience }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.backdrop} aria-hidden="true">
        <div className={styles.stage}>
          {/* Figma glow exports (blur baked into the SVG); decorative. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- static decorative SVG */}
          <img
            className={`${styles.glow} ${styles.glowIndigo}`}
            src="/images/hero/glow-indigo.svg"
            alt=""
            width={1500}
            height={1040}
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- static decorative SVG */}
          <img
            className={`${styles.glow} ${styles.glowMint}`}
            src="/images/hero/glow-mint.svg"
            alt=""
            width={840}
            height={640}
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- static decorative SVG */}
          <img
            className={`${styles.glow} ${styles.glowOrchid}`}
            src="/images/hero/glow-orchid.svg"
            alt=""
            width={800}
            height={640}
          />
        </div>
      </div>

      <div className={styles.copy}>
        <a
          className={`${styles.award} ${styles.reveal}`}
          style={{ '--d': '100ms' } as React.CSSProperties}
          href={CTA_LINKS.award}
          target="_blank"
          rel="noopener"
        >
          <span className={styles.awardBadge}>Winner</span>
          <span>AffPapa iGaming Awards 2024</span>
          <ArrowUpRightIcon className={styles.awardArrow} />
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>

        <SplitHeadline id="hero-title" lines={audience.hero.headline} />

        <p
          className={`${styles.subhead} ${styles.reveal}`}
          style={{ '--d': '650ms' } as React.CSSProperties}
        >
          {audience.hero.subhead}
        </p>

        <div
          className={`${styles.actions} ${styles.reveal}`}
          style={{ '--d': '800ms' } as React.CSSProperties}
        >
          <ButtonLink href={CTA_LINKS.bookDemo}>Book a free demo</ButtonLink>
          <ButtonLink href={CTA_LINKS.takeTour} variant="secondary">
            Take the tour
          </ButtonLink>
        </div>

        <div
          className={`${styles.audience} ${styles.reveal}`}
          style={{ '--d': '950ms' } as React.CSSProperties}
        >
          <p id="audience-switcher-label" className={styles.audienceLabel}>
            See Affnook for
          </p>
          <AudienceSwitcher current={audience.id} labelledBy="audience-switcher-label" />
        </div>
      </div>

      {/* Data landscape starts just below the copy (Figma: y=760, under the switcher). */}
      <div className={styles.landscapeAnchor} aria-hidden="true">
        <div className={styles.landscape}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static decorative SVG */}
          <img src="/images/hero/landscape.svg" alt="" width={1573} height={760} />
        </div>
      </div>
      <ProductStage audience={audience.id} />
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
}
