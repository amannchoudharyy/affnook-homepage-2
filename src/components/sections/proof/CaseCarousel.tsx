'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

import { prefersReducedMotion } from '@/lib/motion';

import styles from './Proof.module.css';

interface CaseCarouselProps {
  /** Eyebrow + heading, rendered on the server. */
  header: ReactNode;
  /** Accessible name of the carousel region. */
  label: string;
  slides: { key: string; name: string; content: ReactNode }[];
}

const ArrowGlyph = ({ flip }: { flip?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path
      d={flip ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Pinned mode (prototype `.proof-pin`): on wide, tall-enough screens with motion allowed the
 * carousel pins to the viewport and ordinary page scrolling slides the track sideways, with
 * the prototype's 01–03 progress bar. CSS switches it on (`html.js` + this media query, so
 * the extra height is in place at first paint); this query must match Proof.module.css.
 */
const PINNED_QUERY =
  '(min-width: 901px) and (min-height: 860px) and (prefers-reduced-motion: no-preference)';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Case-study carousel (Figma: drag / arrows; next case peeks in from the right).
 *
 * Built on a native horizontal scroll container with scroll snapping, so touch swipe,
 * trackpads and keyboard scrolling work without JavaScript. After hydration it adds
 * previous/next buttons, pagination dots and click-and-drag for mouse users.
 *
 * On desktop (see PINNED_QUERY) it becomes the prototype's pinned horizontal scroll: the
 * page scrolls normally (never hijacked) and the track's position follows the scroll
 * progress through the section. Arrows, dots and drag then move the page scroll to the
 * matching slide, and focusing something inside an off-screen slide brings it into view.
 */
export function CaseCarousel({ header, label, slides }: CaseCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const last = slides.length - 1;

  const slideEls = () =>
    Array.from(trackRef.current?.querySelectorAll<HTMLElement>('[data-slide]') ?? []);

  const pinned = () => window.matchMedia(PINNED_QUERY).matches;

  /** Page scroll position at which slide `i` is aligned in pinned mode. */
  const pinnedScrollFor = (i: number) => {
    const root = rootRef.current;
    if (!root) return window.scrollY;
    const top = root.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(0, root.offsetHeight - window.innerHeight);
    return top + (last > 0 ? (Math.max(0, Math.min(last, i)) / last) * range : 0);
  };

  const goTo = (i: number) => {
    if (pinned()) {
      window.scrollTo({ top: pinnedScrollFor(i), behavior: 'smooth' });
      return;
    }
    const track = trackRef.current;
    const target = slideEls()[Math.max(0, Math.min(last, i))];
    if (!track || !target) return;
    track.scrollTo({
      left: target.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  // Pinned mode: the track follows the page's scroll progress through the section.
  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    const query = window.matchMedia(PINNED_QUERY);
    const count = slides.length;
    let frame = 0;
    let near = false;

    const update = () => {
      frame = 0;
      if (!query.matches) {
        track.style.removeProperty('--pin-x');
        return;
      }
      const els = Array.from(track.querySelectorAll<HTMLElement>('[data-slide]'));
      const dist = els.length > 1 ? els[els.length - 1]!.offsetLeft - els[0]!.offsetLeft : 0;
      const range = Math.max(1, root.offsetHeight - window.innerHeight);
      const p = clamp01(-root.getBoundingClientRect().top / range);
      track.style.setProperty('--pin-x', `${(-p * dist).toFixed(1)}px`);
      progressRef.current?.style.setProperty('--pin-p', p.toFixed(4));
      // Prototype counter: 01 for the first third of the scroll, 02 for the second, …
      const active = Math.min(count - 1, Math.floor(p * count * 0.999));
      els.forEach((el, i) => {
        if (i === active) el.dataset.active = '';
        else delete el.dataset.active;
      });
      setIndex(active);
    };
    const onScroll = () => {
      if (near && !frame) frame = requestAnimationFrame(update);
    };
    const onChange = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Only follow the scroll while the section is near the viewport.
    const observer =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([entry]) => {
              near = entry?.isIntersecting ?? false;
              if (near) onChange();
            },
            { rootMargin: '50% 0px' },
          );
    if (observer) observer.observe(root);
    else near = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onChange);
    query.addEventListener('change', onChange);
    onChange();
    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onChange);
      query.removeEventListener('change', onChange);
      cancelAnimationFrame(frame);
    };
  }, [slides.length]);

  // Track the slide nearest the start edge (scroll, swipe, drag, keyboard or buttons).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      // Pinned mode tracks the page scroll instead (effect above).
      if (window.matchMedia(PINNED_QUERY).matches) return;
      const pad = parseFloat(getComputedStyle(track).paddingLeft);
      const els = Array.from(track.querySelectorAll<HTMLElement>('[data-slide]'));
      let best = 0;
      let bestDist = Infinity;
      els.forEach((el, i) => {
        const dist = Math.abs(el.offsetLeft - track.offsetLeft - pad - track.scrollLeft);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      els.forEach((el, i) => {
        if (i === best) el.dataset.active = '';
        else delete el.dataset.active;
      });
      setIndex(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Click-and-drag for mouse users (touch already swipes natively).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let startX = 0;
    let startScroll = 0;
    let startY = 0;
    let ratio = 0;
    let dragging = false;
    let moved = false;
    let pinnedDrag = false;

    const onDown = (e: PointerEvent) => {
      pinnedDrag = window.matchMedia(PINNED_QUERY).matches;
      // Carousel mode: mouse only (touch swipes natively). Pinned mode: mouse and touch, as
      // the track no longer scrolls itself (touch-action keeps vertical panning native).
      if (pinnedDrag ? e.pointerType === 'pen' : e.pointerType !== 'mouse') return;
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest('[data-no-drag], a, button')) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      startY = window.scrollY;
      if (pinnedDrag) {
        const root = track.closest<HTMLElement>('[data-pin-root]');
        const els = Array.from(track.querySelectorAll<HTMLElement>('[data-slide]'));
        const dist = els.length > 1 ? els[els.length - 1]!.offsetLeft - els[0]!.offsetLeft : 0;
        const range = root ? Math.max(0, root.offsetHeight - window.innerHeight) : 0;
        ratio = dist > 0 ? range / dist : 0;
      }
      track.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4 && !moved) {
        moved = true;
        track.dataset.dragging = '';
      }
      if (!moved) return;
      // Pinned: dragging the track left scrolls the page on, which moves the track left.
      if (pinnedDrag) window.scrollTo(0, startY - dx * ratio);
      else track.scrollLeft = startScroll - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
      if (!moved) return;
      if (pinnedDrag) {
        // Continuous, like the prototype's scroll-driven track: no settle.
        delete track.dataset.dragging;
        return;
      }
      const dx = e.clientX - startX;
      // Re-enable snapping only once the settle scroll ends, or it would jump back first.
      const resnap = () => delete track.dataset.dragging;
      if ('onscrollend' in track) track.addEventListener('scrollend', resnap, { once: true });
      window.setTimeout(resnap, 900);
      // Settle on the neighbouring slide in the drag direction.
      const els = Array.from(track.querySelectorAll<HTMLElement>('[data-slide]'));
      const current = els.findIndex((el) => el.dataset.active !== undefined);
      const nextIndex = Math.abs(dx) > 60 ? current + (dx < 0 ? 1 : -1) : current;
      const target = els[Math.max(0, Math.min(els.length - 1, nextIndex))];
      if (target) {
        track.scrollTo({
          left:
            target.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft),
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
      }
    };
    // A drag must not also follow a link it started on.
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    // Pinned: keyboard focus inside an off-screen slide scrolls the page to that slide.
    const onFocusIn = (e: FocusEvent) => {
      if (!window.matchMedia(PINNED_QUERY).matches) return;
      const slide = (e.target as HTMLElement).closest<HTMLElement>('[data-slide]');
      if (!slide) return;
      const i = Array.from(track.querySelectorAll('[data-slide]')).indexOf(slide);
      const root = track.closest<HTMLElement>('[data-pin-root]');
      if (i < 0 || !root) return;
      const top = root.getBoundingClientRect().top + window.scrollY;
      const range = Math.max(0, root.offsetHeight - window.innerHeight);
      const count = track.querySelectorAll('[data-slide]').length;
      window.scrollTo({ top: top + (count > 1 ? (i / (count - 1)) * range : 0) });
    };
    track.addEventListener('focusin', onFocusIn);
    track.addEventListener('pointerdown', onDown);
    track.addEventListener('pointermove', onMove);
    track.addEventListener('pointerup', onUp);
    track.addEventListener('pointercancel', onUp);
    track.addEventListener('click', onClick, true);
    return () => {
      track.removeEventListener('focusin', onFocusIn);
      track.removeEventListener('pointerdown', onDown);
      track.removeEventListener('pointermove', onMove);
      track.removeEventListener('pointerup', onUp);
      track.removeEventListener('pointercancel', onUp);
      track.removeEventListener('click', onClick, true);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label={`Case studies: ${label}`}
      data-pin-root=""
      style={{ '--slides': slides.length } as CSSProperties}
    >
      <div className={styles.pinStage}>
        <div className={styles.head}>
          {header}
          <div className={styles.controls}>
            {/* Prototype progress (pinned mode only): 01 ── 03, filling with the scroll. */}
            <span ref={progressRef} className={styles.pinProgress} aria-hidden="true">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <i />
              <span>{String(slides.length).padStart(2, '0')}</span>
            </span>
            <button
              type="button"
              className={styles.arrow}
              aria-label="Previous case study"
              // aria-disabled (not disabled) keeps keyboard focus on the button at either end.
              aria-disabled={index === 0}
              onClick={() => index > 0 && goTo(index - 1)}
            >
              <ArrowGlyph />
            </button>
            <button
              type="button"
              className={styles.arrow}
              aria-label="Next case study"
              aria-disabled={index === last}
              onClick={() => index < last && goTo(index + 1)}
            >
              <ArrowGlyph flip />
            </button>
          </div>
        </div>

        <div className={styles.viewport}>
          <div ref={trackRef} className={styles.track}>
            {slides.map((slide, i) => (
              <div
                key={slide.key}
                className={styles.slide}
                data-slide=""
                data-active={i === 0 || undefined}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${slides.length}: ${slide.name}`}
              >
                {slide.content}
              </div>
            ))}
            <span className={styles.trackEnd} aria-hidden="true" />
          </div>
          <span className={styles.edgeFade} aria-hidden="true" />
        </div>

        <div className={styles.dots}>
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              type="button"
              className={styles.dot}
              aria-label={`Show case study ${i + 1}: ${slide.name}`}
              aria-current={i === index || undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
