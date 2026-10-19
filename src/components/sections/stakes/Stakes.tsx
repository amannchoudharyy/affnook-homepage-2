import type { CSSProperties } from 'react';

import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { AudienceId } from '@/content/audiences';
import { STAKES, STAKES_EYEBROW, STAKES_FOOTNOTE } from '@/content/sections';

import styles from './Stakes.module.css';

/**
 * Stakes (Figma "Stakes": numbers count up when in view; rules draw left → right).
 * Same layout for every audience; headline, figures and their order differ.
 * Figures are third-party statistics (sources shown) — not Affnook sample data.
 */
export function Stakes({ audience }: { audience: AudienceId }) {
  const content = STAKES[audience];
  return (
    <section className={styles.section} aria-labelledby={`stakes-title-${audience}`}>
      <div className={styles.glow} aria-hidden="true" />
      <Reveal className={styles.inner}>
        <Eyebrow>{STAKES_EYEBROW}</Eyebrow>
        <SectionHeading id={`stakes-title-${audience}`} lines={content.headline} align="center" />
        <ul className={styles.stats}>
          {content.stats.map((stat, i) => (
            <li
              key={stat.text}
              className={styles.stat}
              data-reveal=""
              style={{ '--d': `${i * 120}ms` } as CSSProperties}
            >
              <span className={styles.rule} data-tone={stat.tone} aria-hidden="true" />
              <span className={styles.value}>
                <CountUp value={stat.value} suffix={stat.suffix} delay={i * 120} />
              </span>
              <span className={styles.text}>{stat.text}</span>
              <span className={styles.source}>{stat.source}</span>
            </li>
          ))}
        </ul>
        <p className={styles.footnote} data-reveal="">
          {STAKES_FOOTNOTE}
        </p>
      </Reveal>
    </section>
  );
}
