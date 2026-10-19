import type { CSSProperties, ReactNode } from 'react';

import { Reveal } from '@/components/motion/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { AudienceId } from '@/content/audiences';
import { BRANDS_FUNNEL, PROBLEM } from '@/content/sections';

import {
  DepositIllustration,
  FraudDotsIllustration,
  FraudListIllustration,
  MatrixIllustration,
  PanelsIllustration,
  QuestionBarsIllustration,
  ReconciliationIllustration,
  RulesIllustration,
  SetupIllustration,
  SheetIllustration,
  TabsIllustration,
} from './illustrations';
import styles from './Problem.module.css';

/** Figma illustrations per audience, in card order. */
const ILLUSTRATIONS: Record<AudienceId, ReactNode[]> = {
  operators: [
    <PanelsIllustration key="1" />,
    <QuestionBarsIllustration key="2" />,
    <SetupIllustration key="3" />,
    <FraudDotsIllustration
      key="4"
      hot={[11, 24, 34, 39, 46]}
      tags={[{ label: 'Proxy IP', left: '53%', top: '18%' }]}
    />,
  ],
  brands: [
    <TabsIllustration key="1" />,
    <DepositIllustration key="2" />,
    <SheetIllustration key="3" />,
    <FraudListIllustration key="4" />,
  ],
  networks: [
    <RulesIllustration key="1" />,
    <MatrixIllustration key="2" />,
    <ReconciliationIllustration key="3" />,
    <FraudDotsIllustration
      key="4"
      columns={10}
      rows={5}
      hot={[6, 12, 28, 34, 41]}
      tags={[
        { label: 'Proxy IP', left: '61%', top: '22%' },
        { label: 'Bot', left: '18%', top: '70%' },
      ]}
    />,
  ],
};

/**
 * Problem section (Figma "Problem — …"). Shared header and closing line; the card layout is
 * audience-specific: Operators — four tall cards in a row; Brands — 2×2 cards around a
 * central funnel; Networks — statement pinned on the left while wide cards scroll past.
 */
export function Problem({ audience }: { audience: AudienceId }) {
  const content = PROBLEM[audience];
  const illustrations = ILLUSTRATIONS[audience];

  const cards = content.cards.map((card, i) => (
    <article
      key={card.title}
      className={styles.card}
      data-reveal=""
      style={{ '--d': `${i * 80}ms` } as CSSProperties}
    >
      {illustrations[i]}
      <div className={styles.cardText}>
        <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
        <h3 className={styles.cardTitle}>{card.title}</h3>
        <p className={styles.cardBody}>{card.text}</p>
      </div>
    </article>
  ));

  const header = (
    <>
      <Eyebrow>The problem</Eyebrow>
      <SectionHeading id={`problem-title-${audience}`} lines={content.headline} scrub />
      <p className={styles.intro} data-reveal="">
        {content.intro}
      </p>
    </>
  );

  return (
    <section
      className={`${styles.section} ${styles[audience]}`}
      aria-labelledby={`problem-title-${audience}`}
    >
      <div className={styles.glow} aria-hidden="true" />
      <Reveal className={styles.inner}>
        {audience === 'networks' ? (
          <div className={styles.split}>
            <div className={styles.sticky}>{header}</div>
            <div className={styles.cards}>{cards}</div>
          </div>
        ) : (
          <>
            <div className={styles.head}>{header}</div>
            {audience === 'brands' ? (
              <div className={styles.cards}>
                {cards[0]}
                {cards[1]}
                <BrandsFunnel />
                {cards[2]}
                {cards[3]}
              </div>
            ) : (
              <div className={styles.cards}>{cards}</div>
            )}
          </>
        )}
        <p className={styles.closing} data-reveal="">
          <span>{content.closing[0]}</span> <span>{content.closing[1]}</span>
        </p>
      </Reveal>
    </section>
  );
}

function BrandsFunnel() {
  return (
    <figure className={styles.funnel} data-reveal="" style={{ '--d': '160ms' } as CSSProperties}>
      <figcaption className={styles.funnelHead}>
        <span>{BRANDS_FUNNEL.title}</span>
        <span className={styles.samplePill}>Sample data</span>
      </figcaption>
      <ol className={styles.funnelSteps}>
        {BRANDS_FUNNEL.steps.map((step, i) => (
          <li key={step.label} style={{ '--delay': `${i * 180}ms` } as CSSProperties}>
            <span className={styles.stepHead}>
              <span>{step.label}</span>
              <strong>{step.value}</strong>
            </span>
            <span
              className={styles.stepBar}
              style={{ width: `${step.width}%`, background: step.color }}
              aria-hidden="true"
            />
            {'leak' in step ? (
              <span className={styles.leak}>
                <i aria-hidden="true" />
                {step.leak}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <div className={styles.callout}>
        <p className={styles.calloutTitle}>{BRANDS_FUNNEL.callout.title}</p>
        <p className={styles.calloutText}>{BRANDS_FUNNEL.callout.text}</p>
      </div>
    </figure>
  );
}
