'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

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
 * Case-study carousel (Figma: drag / arrows; next case peeks in from the right).
 *
 * Built on a native horizontal scroll container with scroll snapping, so touch swipe,
 * trackpads and keyboard scrolling work without JavaScript. After hydration it adds
 * previous/next buttons, pagination dots and click-and-drag for
 * mouse users. It never hijacks vertical scrolling (the prototype's pinned horizontal
 * scroll was dropped).
 */
export function CaseCarousel({ header, label, slides }: CaseCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const last = slides.length - 1;

  const slideEls = () =>
    Array.from(trackRef.current?.querySelectorAll<HTMLElement>('[data-slide]') ?? []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const target = slideEls()[Math.max(0, Math.min(last, i))];
    if (!track || !target) return;
    track.scrollTo({
      left: target.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  // Track the slide nearest the start edge (scroll, swipe, drag, keyboard or buttons).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
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
    let dragging = false;
    let moved = false;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest('[data-no-drag], a, button')) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4 && !moved) {
        moved = true;
        track.dataset.dragging = '';
      }
      if (moved) track.scrollLeft = startScroll - dx;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
      if (!moved) return;
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
    track.addEventListener('pointerdown', onDown);
    track.addEventListener('pointermove', onMove);
    track.addEventListener('pointerup', onUp);
    track.addEventListener('pointercancel', onUp);
    track.addEventListener('click', onClick, true);
    return () => {
      track.removeEventListener('pointerdown', onDown);
      track.removeEventListener('pointermove', onMove);
      track.removeEventListener('pointerup', onUp);
      track.removeEventListener('pointercancel', onUp);
      track.removeEventListener('click', onClick, true);
    };
  }, []);

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label={`Case studies: ${label}`}
    >
      <div className={styles.head}>
        {header}
        <div className={styles.controls}>
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
  );
}
