import type { CSSProperties } from 'react';

import { FLOW } from '@/content/how';

import styles from './HowItWorks.module.css';

/* Connector geometry in a 460px-tall box (Figma): brand pill centres → hub entry points,
   hub exits → tier pill centres. x runs 0–100 across each gap column. */
const IN_PATHS = [
  [88, 109],
  [160, 169],
  [232, 233],
  [304, 289],
  [376, 349],
] as const;
const OUT_Y = [112, 216, 320] as const;

const curve = (y0: number, y1: number) => `M0 ${y0} C50 ${y0} 50 ${y1} 100 ${y1}`;

/**
 * Networks flow: brand partners → your network on Affnook → publisher tiers (Figma:
 * connectors draw left → right; dots stream along the lines). A labelled figure; the
 * diagram's text stays readable for everyone and the connectors are decorative.
 */
export function FlowDiagram() {
  return (
    <figure className={styles.flow} data-reveal="">
      <figcaption className="visually-hidden">
        Conversions flow in from brand partners to your network on Affnook, which handles tracking,
        commission rules, fraud checks and payouts; links and payouts flow out to three publisher
        tiers.
      </figcaption>

      <div className={styles.flowCol}>
        <p className={styles.flowLabel}>{FLOW.brandsLabel}</p>
        <ul className={styles.flowBrands}>
          {FLOW.brands.map((brand) => (
            <li key={brand.label} className={styles.flowPill}>
              <i data-tone={brand.tone} />
              {brand.label}
            </li>
          ))}
        </ul>
      </div>

      <div className={`${styles.flowGap} ${styles.flowIn}`} aria-hidden="true">
        <svg viewBox="0 0 100 460" preserveAspectRatio="none" focusable="false">
          {IN_PATHS.map(([y0, y1]) => (
            <path key={y0} className={styles.flowLine} d={curve(y0, y1)} />
          ))}
          {IN_PATHS.map(([y0, y1], i) => (
            <path
              key={`s${y0}`}
              className={styles.flowStream}
              d={curve(y0, y1)}
              style={{ '--i': i } as CSSProperties}
            />
          ))}
        </svg>
        <span className={styles.flowTag}>{FLOW.inLabel}</span>
      </div>

      <div className={styles.hub}>
        <p className={styles.hubHead}>
          <span>{FLOW.hub.title}</span>
          <span className={styles.hubBadge}>
            <i />
            {FLOW.hub.badge}
          </span>
        </p>
        <ul className={styles.hubList}>
          {FLOW.hub.capabilities.map((cap) => (
            <li key={cap.title} data-tone={cap.tone}>
              <span className={styles.hubIcon} aria-hidden="true">
                <i />
              </span>
              <span>
                <strong>{cap.title}</strong>
                <span>{cap.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className={`${styles.flowGap} ${styles.flowOut}`} aria-hidden="true">
        <svg viewBox="0 0 100 460" preserveAspectRatio="none" focusable="false">
          {OUT_Y.map((y) => (
            <path key={y} className={styles.flowLine} d={`M0 ${y} L100 ${y}`} />
          ))}
          {OUT_Y.map((y, i) => (
            <path
              key={`s${y}`}
              className={styles.flowStream}
              d={`M0 ${y} L100 ${y}`}
              style={{ '--i': i + 2 } as CSSProperties}
            />
          ))}
        </svg>
        <span className={styles.flowTag}>{FLOW.outLabel}</span>
      </div>

      <div className={styles.flowCol}>
        <p className={styles.flowLabel}>{FLOW.publishersLabel}</p>
        <ul className={styles.flowTiers}>
          {FLOW.tiers.map((tier) => (
            <li key={tier.label} data-tone={tier.tone}>
              <span className={styles.tierPill}>
                <i />
                {tier.label}
              </span>
              <span className={styles.tierDots} aria-hidden="true">
                {Array.from({ length: tier.dots }, (_, i) => (
                  <i key={i} />
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
