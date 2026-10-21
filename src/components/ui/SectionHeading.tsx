import { Fragment, type CSSProperties } from 'react';

import { ScrubWords } from '@/components/motion/ScrubWords';

import styles from './Section.module.css';

interface SectionHeadingProps {
  id: string;
  /** One line, or two where the second is rendered in text/muted. */
  lines: readonly [string] | readonly [string, string];
  /** Light the words up one by one as the heading scrolls through the viewport. */
  scrub?: boolean;
  /**
   * Characters rise in when the heading scrolls into view (prototype `data-anim="chars"`:
   * 112% + 7deg, 1.1s, 16ms stagger, once). Needs a `Reveal` ancestor, which arms it after
   * hydration and never under reduced motion; screen readers get the plain sentence.
   */
  rise?: boolean;
  align?: 'start' | 'center';
  /** lg: 64px demibold (default) · display: 56px bold (Figma MCP) · md: 30px. */
  size?: 'lg' | 'display' | 'md';
  className?: string;
}

/**
 * Two-line section heading (Figma: 64px demibold, second line in text/muted).
 * Words are wrapped in spans so the optional scroll highlight can target them; the
 * sentence remains ordinary text for screen readers and search engines.
 */
export function SectionHeading({
  id,
  lines,
  scrub = false,
  rise = false,
  align = 'start',
  size = 'lg',
  className,
}: SectionHeadingProps) {
  let charIndex = 0;
  const heading = rise ? (
    <h2
      id={id}
      className={`${styles.heading} ${className ?? ''}`}
      data-align={align}
      data-size={size}
      data-rise=""
    >
      <span className="visually-hidden">{lines.join(' ')}</span>
      {lines.map((line, i) => (
        <Fragment key={line}>
          <span
            className={i === 0 ? styles.line : `${styles.line} ${styles.muted}`}
            aria-hidden="true"
          >
            {line.split(' ').map((word, w, words) => (
              <Fragment key={`${word}-${w}`}>
                <span className={styles.word}>
                  {Array.from(word).map((char, c) => (
                    <span
                      key={`${char}-${c}`}
                      className={styles.char}
                      style={{ '--i': charIndex++ } as CSSProperties}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                {w < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </span>
          {i < lines.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </h2>
  ) : (
    <h2
      id={id}
      className={`${styles.heading} ${className ?? ''}`}
      data-align={align}
      data-size={size}
    >
      {lines.map((line, i) => (
        <Fragment key={line}>
          <span className={i === 0 ? styles.line : `${styles.line} ${styles.muted}`}>
            {line.split(' ').map((word, w, words) => (
              <Fragment key={`${word}-${w}`}>
                <span data-word="">{word}</span>
                {w < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </span>
          {i < lines.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </h2>
  );

  return scrub ? <ScrubWords>{heading}</ScrubWords> : heading;
}
