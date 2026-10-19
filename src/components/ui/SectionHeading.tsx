import { Fragment } from 'react';

import { ScrubWords } from '@/components/motion/ScrubWords';

import styles from './Section.module.css';

interface SectionHeadingProps {
  id: string;
  lines: readonly [string, string];
  /** Light the words up one by one as the heading scrolls through the viewport. */
  scrub?: boolean;
  align?: 'start' | 'center';
  size?: 'lg' | 'md';
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
  align = 'start',
  size = 'lg',
  className,
}: SectionHeadingProps) {
  const heading = (
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
          {i === 0 ? ' ' : null}
        </Fragment>
      ))}
    </h2>
  );

  return scrub ? <ScrubWords>{heading}</ScrubWords> : heading;
}
