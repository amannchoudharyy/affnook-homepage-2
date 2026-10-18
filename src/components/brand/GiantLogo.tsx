import type { CSSProperties } from 'react';

import styles from './GiantLogo.module.css';
import { GIANT_LOGO_LETTERS, GIANT_LOGO_VIEWBOX } from './logo-paths';

/**
 * Footer wordmark (Figma "Giant logo": letters rise in on view; each lifts and turns purple
 * on hover). The rise is a CSS scroll-driven animation where supported; elsewhere the
 * letters are simply shown. Decorative — the footer already names the brand.
 */
export function GiantLogo() {
  return (
    <svg
      className={styles.logo}
      viewBox={GIANT_LOGO_VIEWBOX}
      width={1320}
      height={159.149}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {GIANT_LOGO_LETTERS.map((group, index) => (
        <g key={index} className={styles.letter} style={{ '--i': index } as CSSProperties}>
          {group.paths.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      ))}
    </svg>
  );
}
