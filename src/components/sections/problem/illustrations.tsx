import type { CSSProperties } from 'react';

import styles from './Illustrations.module.css';

/**
 * Decorative card illustrations for the Problem section (Figma "Illustration (loops)").
 * All are aria-hidden — the card title and text carry the meaning. Loops are CSS-only,
 * paused off screen and disabled for reduced motion.
 */

const d = (ms: number) => ({ '--dl': `${ms}ms` }) as CSSProperties;

/* ---------------------------------------------------------------- operators */

export function PanelsIllustration() {
  const panels = [
    { label: 'Casino', tone: 'indigo' },
    { label: 'Sportsbook', tone: 'mint' },
    { label: 'Poker', tone: 'orchid' },
  ];
  return (
    <div className={`${styles.box} ${styles.panels}`} aria-hidden="true">
      {panels.map((p) => (
        <div key={p.label} className={styles.panel} data-tone={p.tone}>
          <span className={styles.panelBar}>
            <i />
            <i />
            <i />
            {p.label}
          </span>
          <span className={styles.skeleton} style={{ width: '59%' }} />
          <span className={styles.skeleton} style={{ width: '41%' }} />
        </div>
      ))}
    </div>
  );
}

export function QuestionBarsIllustration() {
  const bars = [
    { h: 112, tone: 'indigo' },
    { h: 118, tone: 'mint' },
    { h: 108, tone: 'orchid' },
    { h: 115, tone: 'gold' },
  ];
  return (
    <div className={`${styles.box} ${styles.qbars}`} aria-hidden="true">
      <span className={styles.qline} />
      {bars.map((bar, i) => (
        <span
          key={bar.tone}
          className={styles.qbar}
          data-tone={bar.tone}
          style={{ '--h': `${bar.h}px`, ...d(i * 400) } as CSSProperties}
        >
          <em>?</em>
        </span>
      ))}
      <span className={styles.qbase} />
    </div>
  );
}

export function SetupIllustration() {
  return (
    <div className={`${styles.box} ${styles.setup}`} aria-hidden="true">
      <span className={styles.setupHead}>
        <span>New brand setup</span>
        <em>0%</em>
      </span>
      <span className={styles.setupBar}>
        <i />
      </span>
      <ul className={styles.checklist}>
        <li>Tracking domain</li>
        <li>Partner sign-up flow</li>
        <li>Commission plans</li>
        <li>Reports &amp; dashboards</li>
      </ul>
    </div>
  );
}

/** 9×6 dot field with flagged (pulsing) dots and floating tags. */
export function FraudDotsIllustration({
  hot,
  tags,
  columns = 9,
  rows = 6,
}: {
  hot: number[];
  tags: { label: string; left: string; top: string }[];
  columns?: number;
  rows?: number;
}) {
  return (
    <div className={`${styles.box} ${styles.dotsBox}`} aria-hidden="true">
      <div className={styles.dots} style={{ '--cols': columns } as CSSProperties}>
        {Array.from({ length: columns * rows }, (_, i) => (
          <i key={i} data-hot={hot.includes(i) || undefined} style={d((i % 5) * 400)} />
        ))}
      </div>
      {tags.map((tag) => (
        <span key={tag.label} className={styles.tag} style={{ left: tag.left, top: tag.top }}>
          {tag.label}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------- brands */

export function TabsIllustration() {
  return (
    <div className={`${styles.box} ${styles.tabs}`} aria-hidden="true">
      <span className={styles.tabRow}>
        {['Tracking', 'Payouts', 'Partners', 'Sheets'].map((t, i) => (
          // Negative delays put each tab at its own point in the shared 6s cycle.
          <span key={t} className={styles.tab} style={d(i === 0 ? 0 : i * 1500 - 6000)}>
            {t}
          </span>
        ))}
      </span>
      <span className={styles.skeleton} style={{ width: '62%' }} />
      <span className={styles.skeleton} style={{ width: '45%' }} />
      <span className={styles.skeleton} style={{ width: '53%' }} />
      <span className={`${styles.chip} ${styles.chipCorner}`} data-tone="orchid">
        <i />4 tabs · 4 logins
      </span>
    </div>
  );
}

export function DepositIllustration() {
  return (
    <div className={`${styles.box} ${styles.deposit}`} aria-hidden="true">
      <ul className={styles.partners}>
        <li>
          <i data-tone="indigo" />
          Partner A · SEO
        </li>
        <li>
          <i data-tone="indigo" />
          Partner B · Streamer
        </li>
        <li>
          <i data-tone="indigo" />
          Partner C · Telegram
        </li>
      </ul>
      <svg className={styles.connectors} viewBox="0 0 40 72" preserveAspectRatio="none">
        <path d="M0 15 L40 36 M0 36 L40 36 M0 57 L40 36" />
      </svg>
      <span className={styles.depositTarget}>
        <i data-tone="mint" />
        $250 first deposit
        <em>?</em>
      </span>
    </div>
  );
}

export function SheetIllustration() {
  const rows = [
    ['Partner A', '142', '$40', '$5,680'],
    ['Partner B', '96', '$45', '#REF!'],
    ['Partner C', '61', '$40', '$2,440'],
  ];
  return (
    <div className={`${styles.box} ${styles.sheet}`} aria-hidden="true">
      <span className={styles.sheetHead}>
        <span>Partner</span>
        <span>FTDs</span>
        <span>CPA</span>
        <span>Payout</span>
      </span>
      {rows.map((row) => (
        <span key={row[0]} className={styles.sheetRow}>
          {row.map((cell, i) => (
            <span key={i} className={cell === '#REF!' ? styles.sheetError : undefined}>
              {cell}
            </span>
          ))}
        </span>
      ))}
      <span className={styles.sheetTotal}>
        <span>Total</span>
        <span />
        <span />
        <span>$ ? ? ?</span>
      </span>
    </div>
  );
}

export function FraudListIllustration() {
  const rows = [
    { label: 'Sign-up · Germany', flag: 'real', tone: 'mint' },
    { label: 'Sign-up · data-centre IP', flag: 'bot', tone: 'error' },
    { label: 'Bonus claim · same device ×4', flag: 'abuse', tone: 'error' },
  ];
  return (
    <div className={`${styles.box} ${styles.fraudList}`} aria-hidden="true">
      {rows.map((row) => (
        <span
          key={row.label}
          className={styles.fraudRow}
          data-bad={row.tone === 'error' || undefined}
        >
          {row.label}
          <span className={styles.flag} data-tone={row.tone}>
            {row.flag}
          </span>
        </span>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- networks */

export function RulesIllustration() {
  const rules = [
    ['Tier 1 · Brand A', 'CPA $60', false],
    ['Tier 2 · Brand B', 'CPA $40 + 25% RS', true],
    ['Tier 3 · all brands', 'RS 30% of NGR', false],
  ] as const;
  return (
    <div className={`${styles.box} ${styles.rules}`} aria-hidden="true">
      <span className={styles.rulesHead}>
        Commission rules
        <span className={styles.flag} data-tone="gold">
          Edited by hand ×12
        </span>
      </span>
      {rules.map(([label, value, editing]) => (
        <span key={label} className={styles.rule} data-editing={editing || undefined}>
          <span>{label}</span>
          <strong>{value}</strong>
        </span>
      ))}
    </div>
  );
}

export function MatrixIllustration() {
  return (
    <div className={`${styles.box} ${styles.matrix}`} aria-hidden="true">
      <ul className={styles.matrixCol}>
        <li>
          <i data-tone="indigo" />
          Brand A
        </li>
        <li>
          <i data-tone="mint" />
          Brand B
        </li>
        <li>
          <i data-tone="orchid" />
          Brand C
        </li>
      </ul>
      <svg className={styles.connectors} viewBox="0 -13 40 130" preserveAspectRatio="none">
        <path d="M0 0 L40 0 M0 0 L40 52 M0 0 L40 104 M0 52 L40 0 M0 52 L40 52 M0 52 L40 104 M0 104 L40 0 M0 104 L40 52 M0 104 L40 104" />
      </svg>
      <ul className={styles.matrixCol}>
        <li>Tier 1</li>
        <li>Tier 2</li>
        <li>Tier 3</li>
      </ul>
      <svg className={styles.connectors} viewBox="0 -13 30 130" preserveAspectRatio="none">
        <path d="M0 0 L30 0 M0 52 L30 52 M0 104 L30 104" />
      </svg>
      <span className={styles.publishers}>
        {Array.from({ length: 48 }, (_, i) => (
          <i key={i} style={d((i % 6) * 300 + Math.floor(i / 6) * 120)} />
        ))}
      </span>
    </div>
  );
}

export function ReconciliationIllustration() {
  return (
    <div className={`${styles.box} ${styles.recon}`} aria-hidden="true">
      <span className={styles.reconRow}>
        <span className={styles.reconCard}>
          <span>Your data</span>
          <strong>1,204</strong>
          <span>FTDs · September</span>
        </span>
        <em className={styles.notEqual}>≠</em>
        <span className={styles.reconCard}>
          <span>Operator report</span>
          <strong>1,176</strong>
          <span>FTDs · September</span>
        </span>
      </span>
      <span className={`${styles.chip} ${styles.reconChip}`} data-tone="error">
        <i />
        −28 FTDs to match by hand
      </span>
    </div>
  );
}
