import { Reveal } from '@/components/motion/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { AudienceId } from '@/content/audiences';
import { CAPABILITIES, HOW, HOW_EYEBROW, STEP_TITLES } from '@/content/how';

import { CapabilityTabs } from './CapabilityTabs';
import { CapabilityVisual } from './CapabilityVisual';
import { FlowDiagram } from './FlowDiagram';
import styles from './HowItWorks.module.css';
import { StepExplorer } from './StepExplorer';
import { stepWindows } from './StepWindows';

function Tick() {
  return (
    <svg
      width="12"
      height="10"
      viewBox="0 0 12 10"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1 5.5 4.2 8.5 11 1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * How it works + capability tabs (Figma: Operators — steps with a pinned dashboard that
 * swaps per step; Brands — four-step timeline with a progress line and a swapping window;
 * Networks — flow diagram, then a progress timeline). One shared step explorer and tab set
 * render all three layouts from audience data.
 */
export function HowItWorks({ audience }: { audience: AudienceId }) {
  const content = HOW[audience];
  const titleId = `how-title-${audience}`;
  const steps = STEP_TITLES.map((title, i) => ({ title, text: content.steps[i]! }));

  return (
    <section className={styles.section} aria-labelledby={titleId} data-layout={content.layout}>
      <div className={styles.glow} aria-hidden="true" />
      <Reveal className={styles.inner}>
        <div data-reveal="">
          <Eyebrow>{HOW_EYEBROW}</Eyebrow>
        </div>
        <SectionHeading id={titleId} lines={[content.headline]} className={styles.title} />

        {content.layout === 'flow' ? (
          <>
            <FlowDiagram />
            <h3 className={styles.subheading} data-reveal="">
              {content.stepsHeading}
            </h3>
            <StepExplorer layout="timeline" steps={steps} />
          </>
        ) : (
          <StepExplorer
            layout={content.layout}
            steps={steps}
            windows={stepWindows(content.checklist)}
          />
        )}

        <h3 className={styles.subheading} data-reveal="">
          {content.tabsHeading}
        </h3>
        <div data-reveal="">
          <CapabilityTabs
            label={content.tabsHeading}
            tabs={content.tabs.map((id) => {
              const cap = CAPABILITIES[id];
              return {
                id,
                label: cap.tab,
                panel: (
                  <div className={styles.capability}>
                    <div className={styles.capCopy}>
                      <h4 className={styles.capTitle}>{cap.title}</h4>
                      <p className={styles.capText}>{cap.text}</p>
                      <ul className={styles.ticks}>
                        {cap.ticks.map((tick) => (
                          <li key={tick}>
                            <span className={styles.tickMark}>
                              <Tick />
                            </span>
                            {tick}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.capVisual}>
                      <div aria-hidden="true">
                        <CapabilityVisual visual={cap.visual} />
                      </div>
                      <p className={styles.sampleNote}>Sample data</p>
                    </div>
                  </div>
                ),
              };
            })}
          />
        </div>
      </Reveal>
    </section>
  );
}
