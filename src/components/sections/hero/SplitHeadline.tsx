import type { CSSProperties } from 'react';

import styles from './Hero.module.css';

interface SplitHeadlineProps {
  id: string;
  lines: readonly [string, string];
}

/**
 * Two-line H1 whose characters rise in with a stagger (prototype: 22ms per character,
 * 150ms base delay). Screen readers get the plain sentence from a visually-hidden copy;
 * the per-character spans are aria-hidden. The animation is pure CSS and only armed when
 * JavaScript is available (`html.js`), so the text is never hidden without it.
 */
export function SplitHeadline({ id, lines }: SplitHeadlineProps) {
  let charIndex = 0;
  return (
    <h1 id={id} className={styles.title}>
      <span className="visually-hidden">{lines.join(' ')}</span>
      {lines.map((line, lineIndex) => (
        <span
          key={line}
          className={
            lineIndex === 0 ? styles.titleLine : `${styles.titleLine} ${styles.titleMuted}`
          }
          aria-hidden="true"
        >
          {line.split(' ').map((word, wordIndex, words) => (
            <span key={`${word}-${wordIndex}`}>
              <span className={styles.word}>
                {Array.from(word).map((char, i) => (
                  <span
                    key={`${char}-${i}`}
                    className={styles.char}
                    style={{ '--i': charIndex++ } as CSSProperties}
                  >
                    {char}
                  </span>
                ))}
              </span>
              {wordIndex < words.length - 1 ? ' ' : null}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
