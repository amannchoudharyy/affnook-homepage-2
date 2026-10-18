import { Fragment, type CSSProperties } from 'react';

import { CountUp } from '@/components/motion/CountUp';
import { BRANDS_DASHBOARD as data } from '@/content/dashboards';

import charts from './Charts.module.css';
import { DashboardWindow, FloatCard, Meter, Panel } from './Dashboard';
import { Stage } from './Stage';

/** Figma "Product stage — Brands": partner attribution, funnel and LTV. */
export function BrandsStage() {
  return (
    <Stage
      audience="brands"
      label="Sample Affnook brand dashboard: clicks, registrations and FTDs split by partner, a player-journey funnel, player lifetime value by sign-up week, promo-code performance and a scheduled partner payout run. Illustrative data."
      window={
        <DashboardWindow shell={data} className={charts.sideNarrow}>
          <Panel title={data.funnel.title}>
            <div className={charts.funnel}>
              {data.funnel.rows.map((row, i) => (
                <div key={row.label} className={charts.funnelRow}>
                  <span className={charts.funnelLabel}>{row.label}</span>
                  <span className={charts.funnelTrack}>
                    <span
                      className={charts.funnelBar}
                      style={
                        {
                          '--w': row.width / 100,
                          '--delay': `${400 + i * 160}ms`,
                        } as CSSProperties
                      }
                    >
                      {row.parts.map((part, j) => (
                        <i key={j} data-tone={data.funnel.tones[j]} style={{ flexGrow: part }} />
                      ))}
                    </span>
                    <strong>{row.total}</strong>
                  </span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title={data.heatmap.title}>
            <div className={charts.heatmap}>
              <span />
              {data.heatmap.columns.map((col) => (
                <span key={col} className={charts.heatHead}>
                  {col}
                </span>
              ))}
              {data.heatmap.rows.map((row, r) => (
                <Fragment key={row.label}>
                  <span className={charts.heatLabel}>{row.label}</span>
                  {row.cells.map((cell, c) =>
                    cell === null ? (
                      <span key={c} />
                    ) : (
                      <i
                        key={c}
                        className={charts.heatCell}
                        style={
                          { '--o': cell, '--delay': `${500 + r * 160 + c * 40}ms` } as CSSProperties
                        }
                      />
                    ),
                  )}
                </Fragment>
              ))}
            </div>
          </Panel>
        </DashboardWindow>
      }
      floats={[
        <FloatCard
          key="promo"
          title={data.promoCodes.title}
          aside={<span className={charts.floatAside}>{data.promoCodes.columns}</span>}
        >
          <ul className={charts.promoList}>
            {data.promoCodes.rows.map((row, i) => (
              <li key={row.code}>
                <span className={charts.code} data-tone={row.tone}>
                  {row.code}
                </span>
                <span className={charts.barValue}>
                  <CountUp value={row.uses} delay={1300 + i * 100} /> ·{' '}
                  <CountUp value={row.ftds} delay={1300 + i * 100} />
                </span>
                <Meter value={row.width} tone={row.tone} size="sm" delay={300 + i * 120} />
              </li>
            ))}
          </ul>
        </FloatCard>,
        <FloatCard
          key="payout"
          title={data.payout.title}
          aside={
            <span className={charts.status}>
              <span className={charts.statusScheduled}>{data.payout.status}</span>
              <span className={charts.statusPaid}>{data.payout.doneStatus}</span>
            </span>
          }
        >
          <p className={charts.amount}>
            <CountUp {...data.payout.amount} delay={1400} />
          </p>
          <p className={charts.payoutDetail}>{data.payout.detail}</p>
          <span className={charts.payoutMeter}>
            <Meter value={data.payout.progress} tone="gold" size="lg" delay={500} />
          </span>
          <ul className={charts.chips}>
            {data.payout.currencies.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </FloatCard>,
      ]}
    />
  );
}
