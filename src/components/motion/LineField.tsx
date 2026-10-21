'use client';

import { useEffect, useRef } from 'react';

import { prefersReducedMotion } from '@/lib/motion';

/** Prototype `drawLines`: 14 lines, one gradient each, sampled every 14px. */
const LINES = 14;
const STEP = 14;

/**
 * Animated "data landscape" line field (the prototype's `canvas.lines`). Each line is a sum
 * of two sine waves whose phases drift with time; colours run from transparent through
 * violet and mint back to transparent, with opacity rising line by line. Draws only while
 * the canvas is on screen and the tab is visible; under reduced motion it draws one still
 * frame (t = 0), as the prototype does. Decorative: hidden from assistive technology.
 */
export function LineField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = prefersReducedMotion();
    let width = 0;
    let height = 0;
    let gradients: CanvasGradient[] = [];
    let frame = 0;
    let visible = true;

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      for (let i = 0; i < LINES; i++) {
        const base = height * 0.2 + i * (height * 0.055);
        const amp = 18 + i * 3.2;
        ctx.strokeStyle = gradients[i]!;
        ctx.beginPath();
        for (let x = 0; x <= width; x += STEP) {
          const y =
            base +
            Math.sin(x * 0.0042 + t * 0.00035 + i * 0.55) * amp +
            Math.sin(x * 0.011 - t * 0.0005 + i) * (amp * 0.35);
          if (x) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // The gradients depend only on the width, so build them once per size.
      gradients = Array.from({ length: LINES }, (_, i) => {
        const alpha = 0.12 + (i / LINES) * 0.3;
        const g = ctx.createLinearGradient(0, 0, width, 0);
        g.addColorStop(0, 'rgba(140, 134, 255, 0)');
        g.addColorStop(0.35, `rgba(140, 134, 255, ${alpha})`);
        g.addColorStop(0.75, `rgba(0, 209, 127, ${alpha * 0.9})`);
        g.addColorStop(1, 'rgba(0, 209, 127, 0)');
        return g;
      });
      draw(reduce ? 0 : performance.now());
    };

    const loop = (t: number) => {
      frame = 0;
      if (!visible || document.hidden) return;
      draw(t);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!reduce && visible && !document.hidden && !frame) frame = requestAnimationFrame(loop);
    };

    resize();
    canvas.dataset.ready = '';
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize);
    resizeObserver?.observe(canvas);
    const visibility =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? false;
            if (visible) start();
          });
    visibility?.observe(canvas);
    document.addEventListener('visibilitychange', start);
    start();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      visibility?.disconnect();
      document.removeEventListener('visibilitychange', start);
      delete canvas.dataset.ready;
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
