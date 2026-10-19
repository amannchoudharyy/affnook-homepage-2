'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { prefersReducedMotion } from '@/lib/motion';

/**
 * Scroll-linked word highlight (prototype "scrub"): the heading's words start dim and light
 * up in order as it moves up the viewport. Server-rendered text stays fully visible until
 * this component arms itself after hydration; it never arms under reduced motion.
 *
 * The scroll listener is passive, rAF-throttled and attached only while the heading is on
 * screen (IntersectionObserver), so nothing runs while it is out of view.
 */
export function ScrubWords({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    const words = Array.from(root.querySelectorAll<HTMLElement>('[data-word]'));
    if (words.length === 0) return;

    let frame = 0;
    let lit = -1;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // Same curve as the prototype: start at 88% of the viewport, finish ~55% later.
      const progress = Math.min(
        1,
        Math.max(0, (vh * 0.88 - rect.top) / (vh * 0.55 + rect.height * 0.5)),
      );
      const count = Math.round(progress * words.length);
      if (count === lit) return;
      lit = count;
      words.forEach((word, i) => {
        if (i < count) word.dataset.lit = '';
        else delete word.dataset.lit;
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    root.dataset.scrub = 'armed';
    update();

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      } else {
        window.removeEventListener('scroll', onScroll);
      }
    });
    observer.observe(root);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
      delete root.dataset.scrub;
      words.forEach((word) => delete word.dataset.lit);
    };
  }, []);

  return (
    <div ref={ref} data-scrub-root="">
      {children}
    </div>
  );
}
