import type { CSSProperties } from 'react';

import { NETWORKS_DASHBOARD as data } from '@/content/dashboards';

import charts from './Charts.module.css';
import { DashboardWindow, FloatCard, LiveBadge, Meter, Panel } from './Dashboard';
import dash from './Dashboard.module.css';
import { PostbackFeed } from './feeds';
import { Stage } from './Stage';

/** Figma "Product stage — Affiliate networks": tiers, brand revenue and commission rules. */
export function NetworksStage() {
  return (
    <Stage
      audience="networks"
      label="Sample Affnook network dashboard: brand partners, active publishers, conversions and commissions due, publishers grouped into three commission tiers, revenue by brand partner, an auto-applied commission rule and a live postback log. Illustrative data."
      window={
        <DashboardWindow shell={data} className={charts.sideNarrow}>
          <div className={charts.netGrid}>
            <Panel title={data.tiers.title} className={charts.mutedTitle}>
              <div className={charts.tree}>
                <span className={charts.treeRoot}>{data.tiers.root}</span>
                <ul className={charts.tiers}>
                  {data.tiers.rows.map((row, i) => (
                    <li
                      key={row.tier}
                      className={charts.tier}
                      style={{ '--delay': `${500 + i * 180}ms` } as CSSProperties}
                    >
                      <span className={charts.tierHead}>
                        <span className={charts.tierPill} data-tone={row.tone}>
                          {row.tier}
                        </span>
                        <strong>{row.publishers}</strong>
                        <span className={charts.tierShare}>{row.share}</span>
                      </span>
                      <span className={charts.tierPlan}>{row.plan}</span>
                      <Meter value={row.width} tone={row.tone} size="sm" delay={700 + i * 180} />
                    </li>
                  ))}
                </ul>
              </div>
            </Panel>
            <Panel title={data.revenue.title} className={charts.mutedTitle}>
              <ul className={charts.revenue}>
                {data.revenue.rows.map((row, i) => (
                  <li key={row.label}>
                    <span className={charts.barLabel}>{row.label}</span>
                    <span className={charts.barValue}>{row.value}</span>
                    <Meter value={row.width} tone={row.tone} size="lg" delay={400 + i * 120} />
                  </li>
                ))}
              </ul>
              <span className={charts.footPill}>
                <i className={dash.ping} />
                {data.revenue.footnote}
              </span>
            </Panel>
          </div>
        </DashboardWindow>
      }
      floats={[
        <FloatCard
          key="rule"
          title={data.commissionRule.title}
          aside={
            <span className={charts.autoPill}>
              <i className={dash.ping} />
              {data.commissionRule.badge}
            </span>
          }
        >
          <dl className={charts.fields}>
            {data.commissionRule.fields.map((field, i) => (
              <div key={field.label} style={{ '--delay': `${300 + i * 160}ms` } as CSSProperties}>
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
            <div style={{ '--delay': '940ms' } as CSSProperties}>
              <dt>{data.commissionRule.toggle}</dt>
              <dd>
                <span className={charts.toggle} />
              </dd>
            </div>
          </dl>
        </FloatCard>,
        <FloatCard key="postbacks" title={data.postbacks.title} aside={<LiveBadge outlined />}>
          <PostbackFeed rows={data.postbacks.rows} visible={data.postbacks.visible} />
        </FloatCard>,
      ]}
    />
  );
}
