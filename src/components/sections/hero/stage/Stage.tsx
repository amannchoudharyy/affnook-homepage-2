import type { ReactNode } from 'react';

import { MotionRegion } from '@/components/motion/MotionRegion';
import type { AudienceId } from '@/content/audiences';

import styles from './Stage.module.css';

interface StageProps {
  audience: AudienceId;
  /** Text alternative for the whole illustration. */
  label: string;
  window: ReactNode;
  floats: ReactNode[];
}

/**
 * Product stage composition: the dashboard window plus floating cards, positioned per
 * audience as in Figma on desktop and reflowed into a grid on smaller screens.
 *
 * The stage is an illustration of the product with sample data, so it is exposed to
 * assistive technology as a single figure with a text description; the decorative markup
 * inside (including the simulated live feeds) is hidden from screen readers.
 */
export function Stage({ audience, label, window, floats }: StageProps) {
  return (
    <figure id="product-stage" className={styles.figure}>
      <figcaption className="visually-hidden">{label}</figcaption>
      <MotionRegion className={`${styles.stage} ${styles[audience]}`} aria-hidden="true">
        <div className={styles.tilt}>
          <div className={styles.windowIn}>{window}</div>
        </div>
        <div className={styles.floats}>
          {floats.map((card, i) => (
            <div key={i} className={`${styles.float} ${styles[`float${i + 1}`]}`}>
              <div className={styles.floatIn}>
                <div className={styles.bob}>{card}</div>
              </div>
            </div>
          ))}
        </div>
      </MotionRegion>
    </figure>
  );
}
