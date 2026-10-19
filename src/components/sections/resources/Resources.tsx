import type { CSSProperties } from 'react';

import { Reveal } from '@/components/motion/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArrowUpRightIcon } from '@/components/ui/icons';
import type { AudienceId } from '@/content/audiences';
import { RESOURCES, RESOURCES_COPY } from '@/content/closing';

import styles from './Resources.module.css';

/**
 * Resources (Figma: cards lift on hover; the pattern drifts). Three articles per audience,
 * each linking to the published article on affnook.com.
 */
export function Resources({ audience }: { audience: AudienceId }) {
  const titleId = `resources-title-${audience}`;

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <Reveal className={styles.inner}>
        <div className={styles.head}>
          <div>
            <div data-reveal="">
              <Eyebrow>{RESOURCES_COPY.eyebrow}</Eyebrow>
            </div>
            <SectionHeading id={titleId} lines={[RESOURCES_COPY.headline]} />
          </div>
          <a
            className={styles.all}
            href={RESOURCES_COPY.all.href}
            target="_blank"
            rel="noopener"
            data-reveal=""
          >
            {RESOURCES_COPY.all.label}
            <ArrowUpRightIcon />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>

        <ul className={styles.grid}>
          {RESOURCES[audience].map((res, i) => (
            <li key={res.title} data-reveal="" style={{ '--d': `${i * 110}ms` } as CSSProperties}>
              <a
                className={styles.card}
                href={res.href}
                target="_blank"
                rel="noopener"
                data-tone={res.tone}
              >
                <span className={styles.art} aria-hidden="true">
                  {/* Figma pattern export (decorative). */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/resources/pattern-${res.tone}.svg`}
                    alt=""
                    width={424}
                    height={140}
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className={styles.body}>
                  <span className={styles.tag}>{res.tag}</span>
                  <h3 className={styles.title}>{res.title}</h3>
                  <span className={styles.read}>
                    Read
                    <ArrowUpRightIcon />
                  </span>
                </span>
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
