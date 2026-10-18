import type { CSSProperties, ReactNode } from 'react';

import { Logo } from '@/components/brand/Logo';
import { CountUp } from '@/components/motion/CountUp';
import type { DashboardShell, Kpi, Tone } from '@/content/dashboards';

import styles from './Dashboard.module.css';

/**
 * Shared building blocks for the three hero dashboards (Figma "Dashboard window",
 * "Sidebar", "KPI", panels and floating cards). Server components; colours are passed as
 * `data-tone` so CSS maps them to design tokens.
 */

const NAV_ITEMS = ['Dashboard', 'Reports', 'Manage', 'Configuration'] as const;

export function DashboardWindow({
  shell,
  children,
  className,
}: {
  shell: DashboardShell;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.window} ${className ?? ''}`}>
      <div className={styles.chrome}>
        <span className={styles.lights} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.url}>{shell.url}</span>
        <span className={styles.sample}>
          <span>Sample data</span>
          <span className={styles.livePill}>
            <i className={styles.ping} />
            Live
          </span>
        </span>
      </div>
      <div className={styles.body}>
        <Sidebar shell={shell} />
        <div className={styles.main}>
          <div className={styles.mainHead}>
            <div>
              <p className={styles.title}>{shell.title}</p>
              <p className={styles.subtitle}>{shell.subtitle}</p>
            </div>
            {shell.dateRange ? <span className={styles.dateRange}>{shell.dateRange}</span> : null}
          </div>
          <KpiRow kpis={shell.kpis} />
          {children}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ shell }: { shell: DashboardShell }) {
  const { sidebar } = shell;
  return (
    <div className={styles.sidebar}>
      <Logo className={styles.sideLogo} title={null} />
      <ul className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <li
            key={item}
            className={styles.navItem}
            data-active={item === sidebar.activeNav || undefined}
          >
            <i />
            {item}
          </li>
        ))}
      </ul>
      <p className={styles.sideHeading}>{sidebar.heading}</p>
      <ul className={styles.sideList}>
        {sidebar.items.map((item, i) => (
          <li key={item.label} className={styles.sideItem} data-active={i === 0 || undefined}>
            <i className={styles.dot} data-tone={item.tone} />
            {item.label}
          </li>
        ))}
      </ul>
      {sidebar.footer ? <p className={styles.sideFooter}>{sidebar.footer}</p> : null}
    </div>
  );
}

function KpiRow({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className={styles.kpis} data-count={kpis.length}>
      {kpis.map((kpi, i) => (
        <div key={kpi.label} className={styles.kpi}>
          <span className={styles.kpiLabel}>{kpi.label}</span>
          <span className={styles.kpiValue}>
            <CountUp {...kpi.count} delay={1200 + i * 90} />
          </span>
          <span className={styles.delta} data-tone={kpi.tone === 'warn' ? 'orchid' : 'mint'}>
            {kpi.delta}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Panel({
  title,
  aside,
  children,
  className,
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.panel} ${className ?? ''}`}>
      <div className={styles.panelHead}>
        <p className={styles.panelTitle}>{title}</p>
        {aside}
      </div>
      {children}
    </div>
  );
}

export function FloatCard({
  title,
  aside,
  children,
  className,
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.floatCard} ${className ?? ''}`}>
      <div className={styles.panelHead}>
        <p className={styles.floatTitle}>{title}</p>
        {aside}
      </div>
      {children}
    </div>
  );
}

export function LiveBadge({ outlined = false }: { outlined?: boolean }) {
  return (
    <span className={styles.livePill} data-outlined={outlined || undefined}>
      <i className={styles.ping} />
      Live
    </span>
  );
}

/** Horizontal progress bar; `delay` staggers the grow-in animation (ms). */
export function Meter({
  value,
  tone,
  size = 'md',
  delay = 0,
}: {
  value: number;
  tone: Tone;
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
}) {
  return (
    <span className={styles.meter} data-size={size}>
      <span
        className={`${styles.meterFill} ${styles.grow}`}
        data-tone={tone}
        style={{ width: `${value}%`, '--delay': `${delay}ms` } as CSSProperties}
      />
    </span>
  );
}

export function Legend({ items }: { items: { label: string; tone: Tone }[] }) {
  return (
    <span className={styles.legend}>
      {items.map((item) => (
        <span key={item.label}>
          <i className={styles.dotSmall} data-tone={item.tone} />
          {item.label}
        </span>
      ))}
    </span>
  );
}
