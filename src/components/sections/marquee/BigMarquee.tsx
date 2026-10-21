import { VelocityMarquee } from '@/components/motion/VelocityMarquee';
import { BIG_MARQUEE } from '@/content/closing';

import styles from './BigMarquee.module.css';

/** Prototype eight-point star separator (stroke drawing, spins on a 10s loop). */
function Star() {
  return (
    <svg className={styles.star} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path
        d="M20 0v40M0 20h40M5.9 5.9l28.2 28.2M34.1 5.9 5.9 34.1"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}

/**
 * Big velocity marquee between Resources and the Final CTA (prototype `secBigMq`). The
 * same phrases on every audience route. Decorative and hidden from assistive technology:
 * the phrases repeat claims and the demo CTA that appear elsewhere as real content.
 */
export function BigMarquee() {
  return (
    <div className={styles.section} aria-hidden="true" data-bigmq="">
      <VelocityMarquee className={styles.marquee} trackClassName={styles.track}>
        <div className={styles.set}>
          {BIG_MARQUEE.map((item) => (
            <span key={item.text} className={styles.group}>
              <span className={`${styles.word} ${styles[item.style]}`} data-mq-word="">
                {item.text}
              </span>
              <Star />
            </span>
          ))}
        </div>
      </VelocityMarquee>
    </div>
  );
}
