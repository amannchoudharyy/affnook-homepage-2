'use client';

import { useEffect, useRef } from 'react';

import type { CountValue } from '@/content/dashboards';
import { prefersReducedMotion } from '@/lib/motion';

export function formatCount(
  { value, decimals = 0, prefix = '', suffix = '' }: CountValue,
  n = value,
) {
  return `${prefix}${n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}${suffix}`;
}

interface CountUpProps extends CountValue {
  /** Delay before counting when visible on load, in ms (skipped if it scrolls in later). */
  delay?: number;
  duration?: number;
  className?: string;
}

/**
 * Number that counts up from zero once it scrolls into view (prototype: 1.7s, quartic ease).
 * The server renders the final value, so it is correct without JavaScript; the animation
 * writes to the DOM directly (no re-renders) and stops when finished.
 */
export function CountUp({ delay = 0, duration = 1700, className, ...count }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { value, decimals, prefix, suffix } = count;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    const spec = { value, decimals, prefix, suffix };
    let frame = 0;
    let timer = 0;
    let firstCallback = true;

    const run = () => {
      const step = (now: number, start: number) => {
        const k = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - k, 4);
        el.textContent = formatCount(spec, value * eased);
        if (k < 1) frame = requestAnimationFrame((t) => step(t, start));
      };
      frame = requestAnimationFrame((t) => step(t, t));
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        // `delay` staggers counts that are visible on first load (the hero entrance);
        // a count that scrolls into view later starts immediately instead of showing zero.
        const visibleOnLoad = firstCallback;
        firstCallback = false;
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        el.textContent = formatCount(spec, 0);
        timer = window.setTimeout(run, visibleOnLoad ? delay : 0);
      },
      // Trigger slightly before the number is visible so the reset to zero is never seen.
      { rootMargin: '0px 0px 10% 0px' },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      el.textContent = formatCount(spec);
    };
  }, [value, decimals, prefix, suffix, delay, duration]);

  const final = formatCount(count);
  return (
    // Reserve the final width so intermediate values never re-wrap neighbours (no CLS).
    <span
      ref={ref}
      className={className}
      style={{ display: 'inline-block', minWidth: `${final.length}ch` }}
    >
      {final}
    </span>
  );
}
