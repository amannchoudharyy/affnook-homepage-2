'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { prefersReducedMotion } from '@/lib/motion';

/** Prototype marquee constants (`data-speed="1.2"`, hover ×0.25, velocity boost and skew). */
const SPEED = 1.2; // px per 60fps frame
const HOVER_FACTOR = 0.25;
const VELOCITY_CLAMP = 60;
const VELOCITY_BOOST = 0.25;
const SKEW_FACTOR = -0.25;
const SKEW_CLAMP = 10;
const FRAME = 1000 / 60;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
/** Per-frame lerp factor `a`, corrected for frame time (k = elapsed / one 60fps frame). */
const ease = (a: number, k: number) => 1 - Math.pow(1 - a, k);

interface VelocityMarqueeProps {
  className?: string;
  trackClassName?: string;
  /** One set of items; it is rendered twice so the loop wraps seamlessly. */
  children: ReactNode;
}

/**
 * The prototype's "big velocity marquee": a continuous leftward loop that slows to 25% on
 * hover, speeds up with the page's scroll velocity (up to 16×), follows the scroll direction
 * (it keeps the last direction when scrolling stops) and skews while scrolling. Two copies
 * of the set make the wrap invisible. Runs only while on screen and the tab is visible;
 * under reduced motion (or without JavaScript) it is a static strip.
 */
export function VelocityMarquee({ className, trackClassName, children }: VelocityMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || prefersReducedMotion()) return;

    let x = 0;
    let setWidth = track.scrollWidth / 2;
    let velocity = 0;
    let direction = 1;
    let skew = 0;
    let hover = false;
    let visible = false;
    let frame = 0;
    let lastTime = 0;
    let lastY = window.scrollY;

    const tick = (t: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      const k = lastTime ? Math.min(4, (t - lastTime) / FRAME) : 1;
      lastTime = t;
      const y = window.scrollY;
      velocity += (clamp((y - lastY) / k, -500, 500) - velocity) * ease(0.15, k);
      lastY = y;

      const v = clamp(velocity, -VELOCITY_CLAMP, VELOCITY_CLAMP);
      if (v < -1) direction = -1;
      else if (v > 1) direction = 1;
      const speed = SPEED * (hover ? HOVER_FACTOR : 1) * (1 + Math.abs(v) * VELOCITY_BOOST);
      x -= speed * direction * k;
      if (setWidth > 0) {
        while (x <= -setWidth) x += setWidth;
        while (x > 0) x -= setWidth;
      }
      skew += (clamp(velocity * SKEW_FACTOR, -SKEW_CLAMP, SKEW_CLAMP) - skew) * ease(0.12, k);
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!visible || document.hidden || frame) return;
      // Resume from the current scroll: no spike from scrolling done while it was hidden,
      // and no stale skew (the prototype's never-paused loop would have settled meanwhile).
      lastTime = 0;
      lastY = window.scrollY;
      velocity = 0;
      skew = 0;
      frame = requestAnimationFrame(tick);
    };

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hover = true;
    };
    const onLeave = () => {
      hover = false;
    };
    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);

    const resize =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            setWidth = track.scrollWidth / 2;
          });
    resize?.observe(track);
    const visibility =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? false;
            // Also pauses the spinning stars (global [data-offscreen] rule).
            if (visible) delete root.dataset.offscreen;
            else root.dataset.offscreen = '';
            start();
          });
    if (visibility) visibility.observe(root);
    else {
      visible = true;
      start();
    }
    document.addEventListener('visibilitychange', start);

    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      resize?.disconnect();
      visibility?.disconnect();
      document.removeEventListener('visibilitychange', start);
      track.style.removeProperty('transform');
      delete root.dataset.offscreen;
    };
  }, []);

  return (
    <div ref={rootRef} className={className}>
      <div ref={trackRef} className={trackClassName} data-mq-track="">
        {children}
        {children}
      </div>
    </div>
  );
}
