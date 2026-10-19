import type { CSSProperties } from 'react';

import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import type { AudienceId } from '@/content/audiences';
import { FINAL_CTA, FINAL_CTA_SHARED } from '@/content/closing';

import styles from './FinalCta.module.css';

function Tick() {
  return (
    <svg
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1 5.5 4.2 8.5 11 1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Final CTA (Figma: one screen; the data landscape drifts; the glow breathes on an 8s
 * loop). Headline and subline differ per audience.
 */
export function FinalCta({ audience }: { audience: AudienceId }) {
  const content = FINAL_CTA[audience];
  const titleId = `cta-title-${audience}`;

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <Reveal className={styles.scene}>
        <div className={styles.backdrop} aria-hidden="true">
          {/* Figma glow and landscape exports (blur baked into the SVG); decorative. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={`${styles.glow} ${styles.glowIndigo}`}
            src="/images/cta/glow-indigo.svg"
            alt=""
            loading="lazy"
            decoding="async"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={`${styles.glow} ${styles.glowMint}`}
            src="/images/cta/glow-mint.svg"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span className={styles.landscape}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/cta/landscape.svg" alt="" loading="lazy" decoding="async" />
          </span>
        </div>

        <div className={styles.copy}>
          <h2 id={titleId} className={styles.title} data-reveal="">
            <span className={styles.line}>{content.headline[0]}</span>{' '}
            <span className={`${styles.line} ${styles.muted}`}>{content.headline[1]}</span>
          </h2>
          <p className={styles.text} data-reveal="" style={{ '--d': '120ms' } as CSSProperties}>
            {content.text}
          </p>
          <div
            className={styles.actions}
            data-reveal=""
            style={{ '--d': '220ms' } as CSSProperties}
          >
            <ButtonLink href={FINAL_CTA_SHARED.primary.href}>
              {FINAL_CTA_SHARED.primary.label}
            </ButtonLink>
            <ButtonLink href={FINAL_CTA_SHARED.secondary.href} variant="secondary">
              {FINAL_CTA_SHARED.secondary.label}
            </ButtonLink>
          </div>
          <ul className={styles.checks} data-reveal="" style={{ '--d': '320ms' } as CSSProperties}>
            {FINAL_CTA_SHARED.checks.map((check) => (
              <li key={check}>
                <Tick />
                {check}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
