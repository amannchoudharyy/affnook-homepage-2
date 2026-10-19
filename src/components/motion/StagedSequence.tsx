'use client';

import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react';

import { prefersReducedMotion } from '@/lib/motion';

interface StagedSequenceProps extends ComponentPropsWithoutRef<'div'> {
  /** Delays (ms after the region scrolls into view) at which `data-step` advances to 1, 2, … */
  steps: readonly number[];
  /** Share of the region that must be visible before the sequence starts. */
  threshold?: number;
}

/**
 * One-shot staged entrance (prototype "chat" runner: bubbles appear one after another).
 *
 * The server renders the finished state. After hydration the region arms itself
 * (`data-seq="armed"`, `data-step="0"`) so CSS can hide the later stages, then advances
 * `data-step` on a timer once it scrolls into view. It never arms under reduced motion, and
 * it skips the animation if the region is already on screen when it hydrates (so content
 * that is already visible never disappears). Timers stop when the sequence finishes.
 */
export function StagedSequence({ steps, threshold = 0.35, ...props }: StagedSequenceProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    const rect = root.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    const timers: number[] = [];
    root.dataset.seq = 'armed';
    root.dataset.step = '0';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        steps.forEach((delay, i) => {
          timers.push(
            window.setTimeout(() => {
              root.dataset.step = String(i + 1);
              if (i === steps.length - 1) root.dataset.seq = 'done';
            }, delay),
          );
        });
      },
      { threshold },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      delete root.dataset.seq;
      delete root.dataset.step;
    };
  }, [steps, threshold]);

  return <div ref={ref} {...props} />;
}
