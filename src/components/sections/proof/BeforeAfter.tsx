'use client';

import {
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

import { AFTER_BARS, BEFORE_SHEETS, type CaseStudy } from '@/content/proof';
import { prefersReducedMotion } from '@/lib/motion';

import styles from './Proof.module.css';

const START = 50;
/** One sweep on first view (prototype/Figma: "slider handle sweeps once on enter"). */
const SWEEP: readonly [number, number][] = [
  [0, 50],
  [0.35, 74],
  [0.75, 28],
  [1, 50],
];
const SWEEP_MS = 1800;

const clamp = (n: number) => Math.min(100, Math.max(0, n));

/**
 * Before/after comparison: scattered spreadsheet exports versus one Affnook view.
 *
 * The divider is a real slider (role="slider") that works with the keyboard (arrows,
 * Page Up/Down, Home/End), mouse and touch. Dragging anywhere on the image moves it;
 * vertical swipes still scroll the page (`touch-action: pan-y`). Position updates write a
 * CSS variable directly, so dragging never re-renders React. Without JavaScript it shows a
 * static 50/50 split.
 */
export function BeforeAfter({ after, name }: { after: CaseStudy['after']; name: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const pos = useRef(START);
  const sweep = useRef(0);

  const set = (value: number) => {
    const next = clamp(value);
    pos.current = next;
    rootRef.current?.style.setProperty('--pos', `${next}%`);
    const knob = knobRef.current;
    if (knob) {
      knob.setAttribute('aria-valuenow', String(Math.round(next)));
      knob.setAttribute(
        'aria-valuetext',
        `${Math.round(next)}% before, ${Math.round(100 - next)}% after`,
      );
    }
  };
  const stopSweep = () => {
    cancelAnimationFrame(sweep.current);
    sweep.current = 0;
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const step = (now: number, t0: number) => {
          const k = Math.min(1, (now - t0) / SWEEP_MS);
          let i = 1;
          while (i < SWEEP.length - 1 && SWEEP[i]![0] < k) i++;
          const [k0, v0] = SWEEP[i - 1]!;
          const [k1, v1] = SWEEP[i]!;
          const local = (k - k0) / (k1 - k0 || 1);
          const eased = local < 0.5 ? 2 * local * local : 1 - Math.pow(-2 * local + 2, 2) / 2;
          set(v0 + (v1 - v0) * eased);
          sweep.current = k < 1 ? requestAnimationFrame((t) => step(t, t0)) : 0;
        };
        sweep.current = requestAnimationFrame((t) => step(t, t));
      },
      { threshold: 0.6 },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(sweep.current);
    };
  }, []);

  const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    set(((event.clientX - rect.left) / rect.width) * 100);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    stopSweep();
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = '';
    fromPointer(event);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.dataset.dragging === undefined) return;
    fromPointer(event);
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    delete event.currentTarget.dataset.dragging;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowLeft: -5,
      ArrowDown: -5,
      ArrowRight: 5,
      ArrowUp: 5,
      PageDown: -20,
      PageUp: 20,
    };
    if (event.key in steps) set(pos.current + steps[event.key]!);
    else if (event.key === 'Home') set(0);
    else if (event.key === 'End') set(100);
    else return;
    event.preventDefault();
    stopSweep();
  };

  return (
    <div
      ref={rootRef}
      className={styles.compare}
      style={{ '--pos': `${START}%` } as CSSProperties}
      data-no-drag=""
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className={styles.before} aria-hidden="true">
        <span className={styles.compareLabel}>Before</span>
        <span className={styles.sheets}>
          {BEFORE_SHEETS.map((rotate, i) => (
            <span
              key={i}
              className={styles.sheet}
              style={{ '--r': `${rotate}deg` } as CSSProperties}
            >
              {Array.from({ length: 12 }, (_, c) => (
                <i key={c} />
              ))}
            </span>
          ))}
        </span>
      </div>
      <div className={styles.after} aria-hidden="true">
        <span className={`${styles.compareLabel} ${styles.afterLabel}`}>After</span>
        <span className={styles.mini}>
          <span className={styles.miniTitle}>{after.title}</span>
          <span className={styles.miniSub}>{after.subtitle}</span>
          <span className={styles.miniValue}>{after.value}</span>
          <span className={styles.miniBars}>
            {AFTER_BARS.map((h, i) => (
              <i
                key={i}
                style={{ '--h': `${(h / 140) * 100}%`, '--i': i } as CSSProperties}
                data-last={i === AFTER_BARS.length - 1 || undefined}
              />
            ))}
          </span>
        </span>
      </div>
      {/* Moved with a transform so dragging and the sweep never count as layout shifts. */}
      <div className={styles.handle}>
        <span className={styles.divider} aria-hidden="true" />
        <div
          ref={knobRef}
          className={styles.knob}
          role="slider"
          tabIndex={0}
          aria-label={`Compare before and after Affnook for ${name}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={START}
          aria-valuetext={`${START}% before, ${100 - START}% after`}
          onKeyDown={onKeyDown}
        >
          <svg width="20" height="12" viewBox="0 0 20 12" aria-hidden="true" focusable="false">
            <path
              d="M6 1 1 6l5 5M14 1l5 5-5 5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
