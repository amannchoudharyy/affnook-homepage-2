import type { CSSProperties } from 'react';

import { INVOICE, LTV, type Capability, type Trend } from '@/content/how';

import { chartPath } from './StepWindows';
import styles from './HowItWorks.module.css';

const SPARK: Record<Trend, string> = {
  up: 'M1 12 C12 11 18 9 28 10 S44 7 54 7 S72 4 89 2',
  flat: 'M1 7 C12 6 20 8 30 7 S48 6 58 7 S76 6 89 7',
  down: 'M1 3 C12 4 20 3 30 5 S48 6 58 7 S76 9 89 11',
};

/** Sample-data visual for one capability tab (Figma: rows slide in; trend lines draw). */
export function CapabilityVisual({ visual }: { visual: Capability['visual'] }) {
  if (visual.kind === 'table') {
    return (
      <div className={styles.card} data-kind="table">
        <div className={styles.tableHead}>
          {visual.columns.map((col) => (
            <span key={col}>{col}</span>
          ))}
        </div>
        {visual.rows.map((row, i) => (
          <div key={row.cells[0]} className={styles.tableRow} style={{ '--i': i } as CSSProperties}>
            <span className={styles.tableName}>
              <i data-tone={row.tone} />
              {row.cells[0]}
            </span>
            <span className={styles.tableStrong}>{row.cells[1]}</span>
            <span>{row.cells[2]}</span>
            <span>{row.cells[3]}</span>
            <svg
              className={styles.spark}
              viewBox="0 0 90 14"
              aria-hidden="true"
              focusable="false"
              data-trend={row.trend}
            >
              <path d={SPARK[row.trend]} pathLength={1} />
            </svg>
          </div>
        ))}
      </div>
    );
  }

  if (visual.kind === 'log') {
    return (
      <ul className={`${styles.card} ${styles.log}`}>
        {visual.rows.map((row, i) => (
          <li key={row.title} style={{ '--i': i } as CSSProperties}>
            <span>
              <strong>{row.title}</strong>
              <span>{row.detail}</span>
            </span>
            <span className={styles.chip} data-tone={row.tone}>
              {row.status}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  if (visual.kind === 'invoice') {
    return (
      <div className={`${styles.card} ${styles.invoice}`}>
        <div className={styles.invoiceHead}>
          <strong>{INVOICE.number}</strong>
          <span className={styles.chip} data-tone="gold">
            {INVOICE.status}
          </span>
        </div>
        <dl className={styles.invoiceLines}>
          {INVOICE.lines.map(([k, v], i) => (
            <div key={k} style={{ '--i': i } as CSSProperties}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.invoiceTotal}>
          <span>{INVOICE.totalLabel}</span>
          <strong>{INVOICE.total}</strong>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.card} ${styles.ltv}`}>
      <span className={styles.ltvLegend}>
        {LTV.series.map((s) => (
          <span key={s.label}>
            <i data-tone={s.tone} />
            {s.label}
          </span>
        ))}
      </span>
      <svg viewBox="0 0 420 200" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        {[50, 100, 150].map((y) => (
          <line key={y} x1="0" x2="420" y1={y} y2={y} className={styles.ltvGrid} />
        ))}
        {LTV.series.map((s) => (
          <path
            key={s.label}
            data-tone={s.tone}
            className={styles.ltvLine}
            d={chartPath(s.points, 420, 190, 130)}
            pathLength={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <span className={styles.ltvAxis}>
        {LTV.xLabels.map((x) => (
          <span key={x}>{x}</span>
        ))}
      </span>
    </div>
  );
}
