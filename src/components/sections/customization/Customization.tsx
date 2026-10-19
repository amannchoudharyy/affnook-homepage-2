import type { CSSProperties } from 'react';

import { Reveal } from '@/components/motion/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { AudienceId } from '@/content/audiences';
import { CUSTOMIZATION as C } from '@/content/closing';

import styles from './Customization.module.css';

/* Prototype "snap" offsets: each chip falls in from its own height and angle. */
const SNAP = [
  { ty: 40, rot: -12 },
  { ty: -50, rot: 10 },
  { ty: -50, rot: 10 },
  { ty: -50, rot: -12 },
  { ty: 40, rot: 10 },
];

function LockIcon() {
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="1" y="7" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 7V5a3.5 3.5 0 0 1 7 0v2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Customization bento (Figma: tiles lift on hover; formula chips snap together; the
 * dashboard widget drag demo loops). Identical for every audience. The tiles illustrate
 * product settings; the example values are not live data.
 */
export function Customization({ audience }: { audience: AudienceId }) {
  const titleId = `custom-title-${audience}`;
  const chips = [
    ...C.formula.terms.map((t) => ({ ...t, result: false })),
    { label: C.formula.result, tone: 'mint' as const, result: true },
  ];

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <Reveal className={styles.inner}>
        <div data-reveal="">
          <Eyebrow>{C.eyebrow}</Eyebrow>
        </div>
        <SectionHeading id={titleId} lines={C.headline} />

        <div className={styles.bento}>
          <article className={`${styles.tile} ${styles.formulaTile}`} data-reveal="">
            <h3 className={styles.tileTitle}>{C.formula.title}</h3>
            <p className={styles.tileText}>{C.formula.text}</p>
            <p className={styles.formula}>
              <span className="visually-hidden">
                Example: GGR minus bonuses minus chargebacks minus platform fees equals NGR.
              </span>
              {chips.map((chip, i) => (
                <span key={chip.label} className={styles.term} aria-hidden="true">
                  {i > 0 ? (
                    <span className={styles.op} style={{ '--i': i } as CSSProperties}>
                      {chip.result ? '=' : '−'}
                    </span>
                  ) : null}
                  <span
                    className={styles.chip}
                    data-tone={chip.tone}
                    style={
                      {
                        '--i': i,
                        '--ty': `${SNAP[i]!.ty}px`,
                        '--rot': `${SNAP[i]!.rot}deg`,
                      } as CSSProperties
                    }
                  >
                    {chip.label}
                  </span>
                </span>
              ))}
            </p>
            <p className={styles.note}>{C.formula.note}</p>
          </article>

          <article
            className={`${styles.tile} ${styles.domainTile}`}
            data-reveal=""
            style={{ '--d': '100ms' } as CSSProperties}
          >
            <h3 className={styles.tileTitle}>{C.domain.title}</h3>
            <p className={styles.tileText}>{C.domain.text}</p>
            <p className={styles.urlBar}>
              <span className={styles.lock}>
                <LockIcon />
              </span>
              <span className={styles.url} style={{ '--n': C.domain.url.length } as CSSProperties}>
                {C.domain.url}
              </span>
              <span className={styles.caret} aria-hidden="true" />
            </p>
            <ul className={styles.tags}>
              {C.domain.tags.map((tag) => (
                <li key={tag.label} data-tone={tag.tone}>
                  {tag.label}
                </li>
              ))}
            </ul>
          </article>

          <article className={`${styles.tile} ${styles.fxTile}`} data-reveal="">
            <h3 className={styles.tileTitle}>{C.fx.title}</h3>
            <p className={styles.tileText}>{C.fx.text}</p>
            <ul className={styles.rates}>
              {C.fx.rates.map((rate, i) => (
                <li key={rate.pair} style={{ '--i': i } as CSSProperties}>
                  <span className={styles.pair}>{rate.pair}</span>
                  <span className={styles.rate}>{rate.rate}</span>
                  <span className={styles.setBy}>{C.fx.badge}</span>
                </li>
              ))}
            </ul>
          </article>

          <article
            className={`${styles.tile} ${styles.dashTile}`}
            data-reveal=""
            style={{ '--d': '100ms' } as CSSProperties}
          >
            <h3 className={styles.tileTitle}>{C.dashboard.title}</h3>
            <p className={styles.tileText}>{C.dashboard.text}</p>
            <div className={styles.widgets} aria-hidden="true">
              {C.dashboard.widgets.map((widget, w) => (
                <span key={widget.label} className={styles.widget} data-tone={widget.tone}>
                  <span className={styles.widgetLabel}>{widget.label}</span>
                  <span className={styles.bars}>
                    {C.dashboard.bars.map((h, k) => (
                      <i
                        key={k}
                        style={{ '--h': `${(h / 76) * 100}%`, '--k': k, '--w': w } as CSSProperties}
                      />
                    ))}
                  </span>
                </span>
              ))}
              <span className={styles.dragged}>
                <span className={styles.draggedLabel}>{C.dashboard.dragged.label}</span>
                <span className={styles.draggedValue}>{C.dashboard.dragged.value}</span>
              </span>
            </div>
          </article>
        </div>
      </Reveal>
    </section>
  );
}
