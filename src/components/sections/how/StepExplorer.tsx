'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';

import styles from './HowItWorks.module.css';

interface StepExplorerProps {
  layout: 'pinned' | 'timeline';
  steps: readonly { title: string; text: string }[];
  /** One window per step; omit for a progress-only timeline (Networks). */
  windows?: ReactNode[];
  /** Step shown before any scrolling or selection (Figma's on-page state is step 03). */
  initial?: number;
}

/**
 * Four-step "How it works" explorer.
 *
 * Desktop (≥1024px): the active step follows the reader's scroll position through the
 * block — no scroll hijacking, the page scrolls normally — and the matching window swaps
 * in (Operators: pinned beside the steps; Brands: below a timeline whose progress line fills
 * to the active step). Selecting a step (click, tap, Enter/Space) takes over from scrolling.
 * Smaller screens use the steps as an explicit selectable list; nothing advances on its
 * own. Without JavaScript the server-rendered initial step and all step text are shown.
 */
export function StepExplorer({ layout, steps, windows, initial = 2 }: StepExplorerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(initial);
  const manual = useRef(false);
  const panelId = useId();
  const interactive = Boolean(windows);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    let frame = 0;

    const update = () => {
      frame = 0;
      if (manual.current || !desktop.matches) return;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top reaches 75% of the viewport, 1 when its bottom reaches 60%.
      const progress = (vh * 0.75 - rect.top) / (rect.height + vh * 0.15);
      const next = Math.max(0, Math.min(steps.length - 1, Math.floor(progress * steps.length)));
      setActive(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Listen to scroll only while the block is near the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          window.addEventListener('scroll', onScroll, { passive: true });
          onScroll();
        } else {
          window.removeEventListener('scroll', onScroll);
        }
      },
      { rootMargin: '25% 0px' },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [steps.length]);

  const select = (i: number) => {
    manual.current = true;
    setActive(i);
  };

  return (
    <div
      ref={rootRef}
      className={styles.explorer}
      data-layout={layout}
      data-windows={interactive || undefined}
      style={{ '--active': active } as CSSProperties}
    >
      <ol className={styles.steps}>
        {layout === 'timeline' ? (
          <li className={styles.timeline} aria-hidden="true">
            <span className={styles.timelineFill} />
          </li>
        ) : null}
        {steps.map((step, i) => {
          const isActive = i === active;
          const body = (
            <>
              <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.stepText}>
                <span className={styles.stepTitle}>{step.title}</span>
                <span className={styles.stepBody}>{step.text}</span>
              </span>
              <span className={styles.stepBar} aria-hidden="true" />
            </>
          );
          return (
            <li
              key={step.title}
              className={styles.step}
              data-active={isActive || undefined}
              data-done={i < active || undefined}
            >
              {interactive ? (
                <button
                  type="button"
                  className={styles.stepButton}
                  aria-current={isActive ? 'step' : undefined}
                  aria-controls={panelId}
                  onClick={() => select(i)}
                >
                  {body}
                </button>
              ) : (
                <div className={styles.stepButton} aria-current={isActive ? 'step' : undefined}>
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {windows ? (
        <div id={panelId} className={styles.stage} aria-hidden="true">
          {windows.map((win, i) => (
            <div
              key={i}
              className={styles.panel}
              data-active={i === active || undefined}
              inert={i !== active}
            >
              {win}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
