'use client';

import { useEffect, useLayoutEffect, useRef, type ComponentPropsWithoutRef } from 'react';

import { prefersReducedMotion } from '@/lib/motion';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Reveal-on-scroll for a section (prototype ".rv": fade + rise, staggered by `--d`).
 *
 * Descendants marked `data-reveal` start hidden only once this component has armed itself
 * after hydration — so without JavaScript (or before hydration) everything is visible.
 * Elements already on screen when it arms are revealed immediately (no flash); the rest are
 * revealed as they scroll in. Never arms under reduced motion. Also marks itself
 * `data-offscreen` while out of view so looping illustrations can pause.
 */
export function Reveal(props: ComponentPropsWithoutRef<'div'>) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) delete root.dataset.offscreen;
      else root.dataset.offscreen = '';
    });
    visibility.observe(root);

    if (prefersReducedMotion()) return () => visibility.disconnect();

    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const vh = window.innerHeight;
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.in = '';
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    for (const el of targets) {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) el.dataset.in = '';
      else reveal.observe(el);
    }
    // Character-rise headings (SectionHeading `rise`): the prototype's trigger, 8% of the
    // heading visible above the bottom 10% of the viewport; plays once.
    const rise = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.in = '';
          rise.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );
    for (const el of root.querySelectorAll<HTMLElement>('[data-rise]')) {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) el.dataset.in = '';
      else rise.observe(el);
    }
    root.dataset.reveal = 'armed';

    return () => {
      visibility.disconnect();
      reveal.disconnect();
      rise.disconnect();
      delete root.dataset.reveal;
    };
  }, []);

  return <div ref={ref} {...props} />;
}
