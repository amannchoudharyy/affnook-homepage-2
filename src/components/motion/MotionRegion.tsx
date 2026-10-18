'use client';

import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react';

/**
 * Wrapper that marks itself `data-offscreen` while it is outside the viewport. CSS uses the
 * attribute to pause looping/entrance animations, so nothing animates while it cannot be
 * seen. Before hydration (or without JavaScript) the attribute is absent and content renders
 * normally — the region never hides content on its own.
 */
export function MotionRegion(props: ComponentPropsWithoutRef<'div'>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) delete el.dataset.offscreen;
      else el.dataset.offscreen = '';
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} {...props} />;
}
