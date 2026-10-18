import type { CSSProperties } from 'react';

import { CountUp } from '@/components/motion/CountUp';
import { OPERATORS_DASHBOARD as data } from '@/content/dashboards';

import charts from './Charts.module.css';
import { DashboardWindow, FloatCard, Legend, LiveBadge, Meter, Panel } from './Dashboard';
import dash from './Dashboard.module.css';
import { ActivityFeed } from './feeds';
import { AREA_CASINO, LINES } from './operators-chart-paths';
import { Stage } from './Stage';

/** Figma "Product stage — Operators": multi-brand control panel. */
export function OperatorsStage() {
  return (
    <Stage
      audience="operators"
      label="Sample Affnook operator dashboard: NGR, FTDs, active players and blocked clicks across casino, sportsbook, poker and live casino brands, with top markets and a live activity feed. Illustrative data."
      window={
        <DashboardWindow shell={data} className={charts.operatorsWindow}>
          <div className={charts.opsGrid}>
            <Panel title={data.chart.title} aside={<Legend items={data.chart.legend} />}>
              <NgrChart />
            </Panel>
            <Panel title={data.share.title}>
              <ShareDonut />
            </Panel>
          </div>
        </DashboardWindow>
      }
      floats={[
        <FloatCard key="markets" title={data.topMarkets.title}>
          <ul className={charts.barList}>
            {data.topMarkets.rows.map((row, i) => (
              <li key={row.label}>
                <span className={charts.barLabel}>{row.label}</span>
                <span className={charts.barValue}>{row.value}%</span>
                <Meter value={row.width} tone={row.tone} delay={200 + i * 120} />
              </li>
            ))}
          </ul>
        </FloatCard>,
        <FloatCard key="activity" title={data.activity.title} aside={<LiveBadge />}>
          <ActivityFeed rows={data.activity.rows} visible={data.activity.visible} />
        </FloatCard>,
      ]}
    />
  );
}

function NgrChart() {
  return (
    <div className={charts.lineChart}>
      <div className={charts.plot}>
        <svg viewBox="0 -60 532 298" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient
              id="ngr-area"
              x1="0"
              y1="0"
              x2="0"
              y2="238"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8C86FF" stopOpacity="0.22" />
              <stop offset="1" stopColor="#8C86FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[-52, 28, 108, 188].map((y) => (
            <line
              key={y}
              x1="0"
              x2="532"
              y1={y}
              y2={y}
              stroke="#1D2B5F"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path className={charts.area} d={AREA_CASINO} fill="url(#ngr-area)" />
          <g className={charts.lines}>
            {LINES.map((line) => (
              <path
                key={line.id}
                d={line.d}
                transform={`translate(-1.25 ${line.dy})`}
                fill="none"
                stroke={
                  line.tone === 'indigo' ? '#8C86FF' : line.tone === 'mint' ? '#00D17F' : '#ED74BC'
                }
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
        </svg>
        <span className={charts.point} aria-hidden="true">
          <i />
        </span>
        <span className={charts.tooltip}>
          <span>{data.chart.tooltip.label}</span>
          <strong>{data.chart.tooltip.value}</strong>
        </span>
      </div>
      <div className={charts.months}>
        {data.chart.months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

/** Ring geometry from Figma: 176px ring, 24.6px thick, segments clockwise from 12 o'clock. */
const RING = { size: 176, stroke: 24.6, gap: 1.2 };

function ShareDonut() {
  const r = (RING.size - RING.stroke) / 2;
  // Each segment starts where the previous ones end (percent of the ring).
  const starts = data.share.segments.map((_, i) =>
    data.share.segments.slice(0, i).reduce((sum, seg) => sum + seg.value, 0),
  );
  return (
    <div className={charts.donut}>
      <div className={charts.ring}>
        <svg viewBox={`0 0 ${RING.size} ${RING.size}`} aria-hidden="true">
          {data.share.segments.map((seg, i) => {
            const style = {
              '--len': seg.value - RING.gap,
              '--delay': `${300 + i * 220}ms`,
            } as CSSProperties;
            return (
              <circle
                key={seg.label}
                className={charts.arc}
                data-tone={seg.tone}
                cx={RING.size / 2}
                cy={RING.size / 2}
                r={r}
                pathLength={100}
                strokeWidth={RING.stroke}
                strokeDashoffset={-(starts[i] ?? 0)}
                style={style}
                transform={`rotate(-90 ${RING.size / 2} ${RING.size / 2})`}
              />
            );
          })}
        </svg>
        <span className={charts.ringLabel}>
          <strong>
            <CountUp {...data.share.total} delay={1400} />
          </strong>
          <span>{data.share.totalLabel}</span>
        </span>
      </div>
      <ul className={charts.donutLegend}>
        {data.share.segments.map((seg) => (
          <li key={seg.label}>
            <i className={dash.dot} data-tone={seg.tone} />
            {seg.label}
            <span aria-hidden="true">·</span>
            {seg.value}%
          </li>
        ))}
      </ul>
    </div>
  );
}
