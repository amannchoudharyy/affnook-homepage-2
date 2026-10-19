import type { CSSProperties, ReactNode } from 'react';

import { WindowChrome } from '@/components/sections/hero/stage/Dashboard';
import { STEP_WINDOWS } from '@/content/how';

import styles from './HowItWorks.module.css';

const W = STEP_WINDOWS;

function Tick() {
  return (
    <svg
      width="14"
      height="12"
      viewBox="0 0 14 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1.5 6.5 5 10l7.5-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
      />
    </svg>
  );
}

function Window({
  step,
  title,
  subtitle,
  children,
}: {
  step: number;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.window}>
      <WindowChrome url={W.urls[step]!} />
      <div className={styles.windowBody}>
        <p className={styles.windowTitle}>{title}</p>
        <p className={styles.windowSub}>{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

function DemoWindow() {
  const d = W.demo;
  return (
    <Window step={0} title={d.title} subtitle={d.subtitle}>
      <div className={styles.calendar}>
        {d.weekdays.map((day, i) => (
          <span key={i} className={styles.weekday}>
            {day}
          </span>
        ))}
        {Array.from({ length: 21 }, (_, i) => (
          <span
            key={i}
            className={styles.day}
            data-state={
              i === d.picked
                ? 'picked'
                : (d.available as readonly number[]).includes(i)
                  ? 'open'
                  : undefined
            }
            style={{ '--i': i } as CSSProperties}
          >
            {i + d.firstDay}
          </span>
        ))}
      </div>
      <div className={styles.slot}>
        <span>
          <strong>{d.slot}</strong>
          <span>{d.slotText}</span>
        </span>
        <span className={styles.chip} data-tone="mint">
          <Tick />
          {d.slotStatus}
        </span>
      </div>
    </Window>
  );
}

function OnboardingWindow({ checklist }: { checklist: readonly string[] }) {
  const o = W.onboarding;
  return (
    <Window step={1} title={o.title} subtitle={o.subtitle}>
      <ul className={styles.checklist}>
        {checklist.map((item, i) => {
          const done = i < 3;
          return (
            <li key={item} style={{ '--i': i } as CSSProperties}>
              <span className={styles.checkItem}>
                <span className={styles.checkMark} data-done={done || undefined}>
                  {done ? <Tick /> : null}
                </span>
                {item}
              </span>
              <span className={styles.chip} data-tone={done ? 'mint' : 'indigo'}>
                {done ? <Tick /> : null}
                {done ? 'Done' : 'In progress'}
              </span>
            </li>
          );
        })}
      </ul>
    </Window>
  );
}

function MigrationWindow() {
  const m = W.migration;
  return (
    <Window step={2} title={m.title} subtitle={m.subtitle}>
      <div className={styles.methods}>
        {m.methods.map((method, i) => (
          <span key={method} className={styles.method} data-active={i === 0 || undefined}>
            {method}
          </span>
        ))}
      </div>
      <ul className={styles.migration}>
        {m.rows.map((row, i) => (
          <li key={row.name} style={{ '--i': i } as CSSProperties}>
            <span className={styles.migName}>
              <strong>{row.name}</strong>
              <span>{row.records}</span>
            </span>
            <span className={styles.migTrack}>
              <span
                className={styles.migFill}
                data-tone={row.progress === 100 ? 'mint' : 'indigo'}
                style={{ '--w': `${row.progress}%` } as CSSProperties}
              />
            </span>
            <span
              className={styles.chip}
              data-tone={row.progress === 100 ? 'mint' : row.progress > 0 ? 'indigo' : 'muted'}
            >
              {row.progress === 100 ? <Tick /> : null}
              {row.status}
            </span>
          </li>
        ))}
      </ul>
      <span className={styles.badge}>
        <Tick />
        {m.badge}
      </span>
    </Window>
  );
}

export function chartPath(points: readonly number[], w: number, h: number, max: number) {
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => [i * step, h - (p / max) * h] as const);
  // Smooth curve through the points (Catmull-Rom → cubic Bézier).
  let d = `M${coords[0]![0]},${coords[0]![1].toFixed(1)}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i - 1] ?? coords[i]!;
    const p1 = coords[i]!;
    const p2 = coords[i + 1]!;
    const p3 = coords[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]!.toFixed(1)},${c1[1]!.toFixed(1)} ${c2[0]!.toFixed(1)},${c2[1]!.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

function OptimiseWindow() {
  const o = W.optimise;
  const line = chartPath(o.chart, 300, 130, 70);
  return (
    <Window step={3} title={o.title} subtitle={o.subtitle}>
      <div className={styles.optimise}>
        <div className={styles.chartCard}>
          <span className={styles.chartHead}>
            <strong>{o.chartTitle}</strong>
            <span className={styles.chip} data-tone="mint">
              {o.chartBadge}
            </span>
          </span>
          <svg
            viewBox="0 0 300 140"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d={`${line} L300,140 L0,140 Z`} fill="rgba(0, 209, 127, 0.12)" />
            <path
              className={styles.chartLine}
              d={line}
              fill="none"
              stroke="#00D17F"
              strokeWidth="2.4"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        <ul className={styles.toggles}>
          {o.toggles.map((toggle, i) => (
            <li key={toggle} style={{ '--i': i } as CSSProperties}>
              {toggle}
              <span className={styles.toggle} />
            </li>
          ))}
        </ul>
      </div>
    </Window>
  );
}

/** The four step windows (Figma draws step 03; the others follow the prototype). */
export function stepWindows(checklist: readonly string[]): ReactNode[] {
  return [
    <DemoWindow key="demo" />,
    <OnboardingWindow key="onboarding" checklist={checklist} />,
    <MigrationWindow key="migration" />,
    <OptimiseWindow key="optimise" />,
  ];
}
