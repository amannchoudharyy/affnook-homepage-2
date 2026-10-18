'use client';

import { LiveFeed } from '@/components/motion/LiveFeed';
import type { FeedRow } from '@/content/dashboards';

import styles from './Dashboard.module.css';

/** Operators "Live activity": new row every 2.5s (Figma + prototype). */
export function ActivityFeed({ rows, visible }: { rows: FeedRow[]; visible: number }) {
  return (
    <LiveFeed
      rows={rows}
      visible={visible}
      interval={2500}
      className={styles.feed}
      rowClassName={styles.feedRow}
      enterClassName={styles.feedEnter}
      renderRow={(row) => (
        <>
          <i className={styles.dot} data-tone={row.tone} />
          <span className={styles.feedText}>
            <strong>{row.title}</strong>
            <span>{row.detail}</span>
          </span>
          <span className={styles.feedValue} data-tone={row.valueTone}>
            {row.value}
          </span>
        </>
      )}
    />
  );
}

/** Networks "Postback log": rows stream in every 2s. */
export function PostbackFeed({ rows, visible }: { rows: FeedRow[]; visible: number }) {
  return (
    <LiveFeed
      rows={rows}
      visible={visible}
      interval={2000}
      className={`${styles.feed} ${styles.logFeed}`}
      rowClassName={styles.logRow}
      enterClassName={styles.feedEnter}
      renderRow={(row) => (
        <>
          <i className={styles.dotSmall} data-tone={row.tone} />
          <span className={styles.feedText}>
            <span className={styles.logTitle}>{row.title}</span>
            <span className={styles.logStatus} data-tone={row.tone}>
              {row.detail}
            </span>
          </span>
        </>
      )}
    />
  );
}
