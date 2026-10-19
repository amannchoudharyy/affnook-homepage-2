import type { CSSProperties } from 'react';

import { Reveal } from '@/components/motion/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArrowUpRightIcon } from '@/components/ui/icons';
import type { AudienceId } from '@/content/audiences';
import { FAQ, OBJECTIONS, OBJECTIONS_COPY } from '@/content/closing';

import { FaqExplorer } from './FaqExplorer';
import styles from './Objections.module.css';

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
 * Objections + FAQ (Figma: cards stagger up; accordion expands in 300ms). Identical for
 * every audience.
 */
export function Objections({ audience }: { audience: AudienceId }) {
  const titleId = `faq-title-${audience}`;

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <Reveal className={styles.inner}>
        <div data-reveal="">
          <Eyebrow>{OBJECTIONS_COPY.eyebrow}</Eyebrow>
        </div>
        <SectionHeading id={titleId} lines={[OBJECTIONS_COPY.headline]} />

        <ul className={styles.objections}>
          {OBJECTIONS.map((obj, i) => (
            <li
              key={obj.tag}
              className={styles.objection}
              data-tone={obj.tone}
              data-reveal=""
              style={{ '--d': `${i * 100}ms` } as CSSProperties}
            >
              <span className={styles.bar} aria-hidden="true" />
              <span className={styles.tag}>{obj.tag}</span>
              <h3 className={styles.objQuestion}>{obj.question}</h3>
              <ul className={styles.points}>
                {obj.points.map((point) => (
                  <li key={point}>
                    <span className={styles.tick}>
                      <Tick />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <a className={styles.link} href={obj.link.href} target="_blank" rel="noopener">
                {obj.link.label}
                <ArrowUpRightIcon />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.faq} data-reveal="">
          <h3 className={styles.faqTitle}>{OBJECTIONS_COPY.faqTitle}</h3>
          <FaqExplorer categories={FAQ} />
        </div>
      </Reveal>
    </section>
  );
}
