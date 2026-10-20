import type { CSSProperties } from 'react';

import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { AudienceId } from '@/content/audiences';
import { MCP } from '@/content/guide';

import { AssistantDemo } from './AssistantDemo';
import styles from './Mcp.module.css';

/**
 * Affnook MCP — AI assistant (Figma: window rises 40px and fades in; the user bubble types
 * in, the tool chip pulses, answer rows stagger 120ms; prompt chips cycle into the input).
 * Identical for every audience in Figma. The assistant window is a scripted product demo
 * with sample data — there is no AI or API behind it, and the caption says so.
 */
export function Mcp({ audience }: { audience: AudienceId }) {
  const titleId = `mcp-title-${audience}`;

  return (
    <section id="mcp" className={styles.section} aria-labelledby={titleId}>
      <div className={styles.glow} aria-hidden="true" />
      <Reveal className={styles.inner}>
        <AssistantDemo>
          <p className={styles.eyebrow} data-reveal="">
            <span className={styles.badge}>{MCP.badge}</span>
            {MCP.eyebrow}
          </p>
          <SectionHeading
            id={titleId}
            lines={MCP.headline}
            size="display"
            className={styles.title}
          />
          <p className={styles.body} data-reveal="" style={{ '--d': '100ms' } as CSSProperties}>
            {MCP.body}
          </p>
          <div className={styles.ctaRow} data-reveal="" style={{ '--d': '200ms' } as CSSProperties}>
            <ButtonLink href={MCP.cta.href} arrow={false}>
              {MCP.cta.label} <span aria-hidden="true">→</span>
            </ButtonLink>
            <span className={styles.works}>
              <i aria-hidden="true" />
              {MCP.worksWith}
            </span>
          </div>
        </AssistantDemo>
      </Reveal>
    </section>
  );
}
