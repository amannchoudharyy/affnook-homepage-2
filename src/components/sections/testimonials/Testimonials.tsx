import { Fragment, type CSSProperties } from 'react';

import { Reveal } from '@/components/motion/Reveal';
import { ScrubWords } from '@/components/motion/ScrubWords';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { AudienceId } from '@/content/audiences';
import { TESTIMONIAL as T } from '@/content/closing';

import styles from './Testimonials.module.css';

function StarIcon() {
  return (
    <svg
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M10 0l2.645 6.36 6.866.55-5.231 4.48 1.598 6.7L10 14.5l-5.878 3.59 1.598-6.7L.49 6.91l6.865-.55L10 0z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Testimonials (Figma: quote words light up on scroll; the card rises in; the award chip
 * fades in). Identical for every audience. The quote is verbatim from
 * affnook.com/book-free-demo/; the speaker's headshot is still to be supplied.
 */
export function Testimonials({ audience }: { audience: AudienceId }) {
  const titleId = `testimonials-title-${audience}`;

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <Reveal className={styles.inner}>
        <div className={styles.head}>
          <div>
            <div data-reveal="">
              <Eyebrow>{T.eyebrow}</Eyebrow>
            </div>
            <SectionHeading id={titleId} lines={T.headline} />
          </div>
          <a
            className={styles.award}
            href={T.award.href}
            target="_blank"
            rel="noopener"
            data-reveal=""
            style={{ '--d': '200ms' } as CSSProperties}
          >
            <span className={styles.awardIcon}>
              <StarIcon />
            </span>
            <span className={styles.awardText}>
              <strong>{T.award.title}</strong>
              <span>{T.award.text}</span>
            </span>
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>

        <figure className={styles.card} data-reveal="" style={{ '--d': '100ms' } as CSSProperties}>
          <div className={styles.top}>
            <span className={styles.tag}>
              <i aria-hidden="true" />
              {T.tag}
            </span>
            <span className={styles.mark} aria-hidden="true">
              “
            </span>
          </div>
          <ScrubWords>
            <blockquote className={styles.quote}>
              <p>
                {T.quote.split(' ').map((word, i, words) => (
                  <Fragment key={i}>
                    <span data-word="">{word}</span>
                    {i < words.length - 1 ? ' ' : null}
                  </Fragment>
                ))}
              </p>
            </blockquote>
          </ScrubWords>
          <figcaption className={styles.footer}>
            <span className={styles.author}>
              <span className={styles.avatar} aria-hidden="true">
                {T.initials}
              </span>
              <span className={styles.who}>
                <strong>{T.author}</strong>
                <span>{T.role}</span>
              </span>
            </span>
            <span className={styles.result}>
              <strong>{T.result.value}</strong>
              <span>{T.result.label}</span>
            </span>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
