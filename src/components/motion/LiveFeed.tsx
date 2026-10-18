'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { prefersReducedMotion } from '@/lib/motion';

interface LiveFeedProps<T> {
  /** Full pool of rows; the first `visible` rows are rendered on the server. */
  rows: readonly T[];
  visible: number;
  /** Interval between new rows, in ms (prototype: 2.5s for activity, 2s for postbacks). */
  interval: number;
  renderRow: (row: T) => ReactNode;
  className?: string;
  rowClassName?: string;
  enterClassName?: string;
}

interface Entry<T> {
  key: number;
  row: T;
  fresh: boolean;
}

/**
 * Simulated live feed: periodically inserts the next sample row at the top and drops the
 * oldest. Runs only while the feed is on screen, the tab is visible and reduced motion is
 * not requested; the interval is cleared on unmount.
 */
export function LiveFeed<T>({
  rows,
  visible,
  interval,
  renderRow,
  className,
  rowClassName,
  enterClassName,
}: LiveFeedProps<T>) {
  const listRef = useRef<HTMLUListElement>(null);
  const [entries, setEntries] = useState<Entry<T>[]>(() =>
    rows.slice(0, visible).map((row, i) => ({ key: i, row, fresh: false })),
  );

  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion() || rows.length <= visible) return;
    let onScreen = false;
    let next = visible;
    let key = visible;

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? false;
    });
    observer.observe(list);

    const timer = window.setInterval(() => {
      if (!onScreen || document.hidden) return;
      const row = rows[next % rows.length] as T;
      next += 1;
      key += 1;
      setEntries((current) => [{ key, row, fresh: true }, ...current].slice(0, visible));
    }, interval);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [rows, visible, interval]);

  return (
    <ul ref={listRef} className={className}>
      {entries.map((entry) => (
        <li
          key={entry.key}
          className={entry.fresh ? `${rowClassName ?? ''} ${enterClassName ?? ''}` : rowClassName}
        >
          {renderRow(entry.row)}
        </li>
      ))}
    </ul>
  );
}
