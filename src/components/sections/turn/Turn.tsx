import type { CSSProperties } from 'react';

import { Reveal } from '@/components/motion/Reveal';
import { StagedSequence } from '@/components/motion/StagedSequence';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CtaArrowIcon } from '@/components/ui/icons';
import type { AudienceId } from '@/content/audiences';
import {
  TURN,
  TURN_ASSURANCES,
  TURN_CSM,
  TURN_EYEBROW,
  TURN_PROMISES,
  TURN_UPTIME,
} from '@/content/guide';
import { CTA_LINKS } from '@/content/links';

import { PromiseGlyph } from './promise-icons';
import styles from './Turn.module.css';

/** Prototype chat runner: your bubble at 350ms, typing dots at 1s, Affnook's reply at 2.3s. */
const CHAT_STEPS = [350, 1000, 2300] as const;

/**
 * Turn — "Affnook as your guide" (Figma: chat bubbles type in; uptime bars fill; cards
 * stagger). Same layout for every audience; headline, intro, CTA label and the sample
 * conversation differ.
 */
export function Turn({ audience }: { audience: AudienceId }) {
  const content = TURN[audience];
  const titleId = `turn-title-${audience}`;

  return (
    <section className={styles.section} aria-labelledby={titleId}>
      <div className={styles.glow} aria-hidden="true" />
      <Reveal className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.copy}>
            <div data-reveal="">
              <Eyebrow>{TURN_EYEBROW}</Eyebrow>
            </div>
            <SectionHeading
              id={titleId}
              lines={[content.headline]}
              scrub
              className={styles.title}
            />
            <p className={styles.body} data-reveal="" style={{ '--d': '100ms' } as CSSProperties}>
              {content.body}
            </p>
            <div data-reveal="" style={{ '--d': '200ms' } as CSSProperties}>
              <ButtonLink href={CTA_LINKS.whyAffnook} variant="secondary" arrow>
                {content.cta}
              </ButtonLink>
            </div>
          </div>

          <figure
            className={styles.visual}
            data-reveal=""
            style={{ '--d': '150ms' } as CSSProperties}
          >
            <figcaption className="visually-hidden">
              Sample conversation with your Affnook customer success manager. You ask: “
              {content.question}” Affnook replies: “{content.answer}” Platform uptime:{' '}
              {TURN_UPTIME.value}.
            </figcaption>
            <div aria-hidden="true" className={styles.visualInner}>
              <StagedSequence className={styles.chat} steps={CHAT_STEPS}>
                <div className={styles.csm}>
                  <span className={styles.avatar}>{TURN_CSM.initials}</span>
                  <span className={styles.csmText}>
                    <span className={styles.csmTitle}>{TURN_CSM.title}</span>
                    <span className={styles.csmMeta}>{TURN_CSM.meta}</span>
                    <span className={styles.online}>
                      <i />
                      {TURN_CSM.status}
                    </span>
                  </span>
                </div>
                <hr className={styles.divider} />
                <p className={`${styles.bubble} ${styles.you}`}>
                  <span className={styles.who}>You</span>
                  {content.question}
                </p>
                <div className={styles.replySlot}>
                  <span className={styles.typing}>
                    <i />
                    <i />
                    <i />
                  </span>
                  <p className={`${styles.bubble} ${styles.affnook}`}>
                    <span className={styles.who}>Affnook</span>
                    {content.answer}
                  </p>
                </div>
              </StagedSequence>

              <div
                className={styles.uptime}
                data-reveal=""
                style={{ '--d': '400ms' } as CSSProperties}
              >
                <span className={styles.uptimeLabel}>{TURN_UPTIME.label}</span>
                <span className={styles.uptimeValue}>{TURN_UPTIME.value}</span>
                <span className={styles.bars}>
                  {Array.from({ length: TURN_UPTIME.bars }, (_, i) => (
                    <i
                      key={i}
                      data-warn={i === TURN_UPTIME.warnIndex ? '' : undefined}
                      style={{ '--i': i } as CSSProperties}
                    />
                  ))}
                </span>
              </div>
              <p className={styles.sample}>Sample conversation</p>
            </div>
          </figure>
        </div>

        <ul className={styles.promises}>
          {TURN_PROMISES.map((promise, i) => (
            <li
              key={promise.title}
              className={styles.promise}
              data-reveal=""
              style={{ '--d': `${i * 100}ms` } as CSSProperties}
            >
              <a className={styles.card} href={promise.href} target="_blank" rel="noopener">
                <span className={styles.icon} data-tone={promise.tone}>
                  <PromiseGlyph icon={promise.icon} />
                </span>
                <span className={styles.cardArrow} aria-hidden="true">
                  <span className={styles.arrows}>
                    <CtaArrowIcon />
                    <CtaArrowIcon />
                  </span>
                </span>
                <h3 className={styles.cardTitle}>{promise.title}</h3>
                <span className={styles.cardText}>{promise.text}</span>
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>

        <ul className={styles.assurances} data-reveal="">
          {TURN_ASSURANCES.map((item) => (
            <li key={item.label} data-tone={item.tone}>
              {item.label}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
