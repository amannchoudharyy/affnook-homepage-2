import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ArrowUpRightIcon } from '@/components/ui/icons';
import type { AudienceId } from '@/content/audiences';
import { CASES, PROOF, PROOF_EYEBROW, PROOF_INVITATION, type CaseStudy } from '@/content/proof';

import { BeforeAfter } from './BeforeAfter';
import { CaseCarousel } from './CaseCarousel';
import styles from './Proof.module.css';

function CaseSlide({ study }: { study: CaseStudy }) {
  return (
    <article className={styles.case}>
      <div className={styles.story}>
        <span className={styles.tag}>
          <i aria-hidden="true" />
          {study.tag}
        </span>
        <h3 className={styles.name}>{study.name}</h3>
        <p className={styles.text}>{study.story}</p>
        <ul className={styles.metrics} data-count={study.metrics.length}>
          {study.metrics.map((metric) => (
            <li key={metric.label}>
              <span className={styles.metricValue}>
                <CountUp {...metric.count} />
              </span>
              <span className={styles.metricLabel}>{metric.label}</span>
            </li>
          ))}
        </ul>
        <a className={styles.link} href={study.link.href} target="_blank" rel="noopener">
          {study.link.label}
          <ArrowUpRightIcon />
          <span className="visually-hidden"> about {study.name} (opens in a new tab)</span>
        </a>
      </div>
      <BeforeAfter after={study.after} name={study.name} />
    </article>
  );
}

/**
 * Proof — case studies (Figma: carousel with drag / arrows; metrics count up; the
 * before/after slider sweeps once on enter). Same layout for every audience; the cases and
 * their order differ.
 */
export function Proof({ audience }: { audience: AudienceId }) {
  const content = PROOF[audience];
  const titleId = `proof-title-${audience}`;

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <Reveal className={styles.inner}>
        <CaseCarousel
          label={content.headline}
          header={
            <div className={styles.heading}>
              <div data-reveal="">
                <Eyebrow>{PROOF_EYEBROW}</Eyebrow>
              </div>
              <SectionHeading id={titleId} lines={[content.headline]} rise />
            </div>
          }
          after={
            <>
              <h3 className={styles.nextTitle}>{PROOF_INVITATION.title}</h3>
              <ButtonLink href={PROOF_INVITATION.cta.href}>{PROOF_INVITATION.cta.label}</ButtonLink>
            </>
          }
          slides={content.cases.map((id) => ({
            key: id,
            name: CASES[id].name,
            content: <CaseSlide study={CASES[id]} />,
          }))}
        />
      </Reveal>
    </section>
  );
}
