'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import { prefersReducedMotion } from '@/lib/motion';

import styles from './HowItWorks.module.css';

interface CapabilityTabsProps {
  label: string;
  tabs: { id: string; label: string; panel: ReactNode }[];
}

/**
 * Capability tabs (Figma: panel crossfade). WAI-ARIA tabs pattern: one tab stop, arrow
 * keys / Home / End move between tabs and activate them.
 *
 * Auto-advance as in the prototype (`.ftab .pr`): a 2px progress bar fills the active tab
 * over 7s (linear), then the next tab is selected, looping. Selecting a tab restarts the
 * timer from that tab. It pauses while the pointer is over the tabs, while keyboard focus
 * (`:focus-visible`) is inside them, so keyboard users are never moved on, and while they
 * are off screen, and
 * it never runs under reduced motion. The timer is a CSS animation whose `animationend`
 * advances the tab, so there are no JS timers to leak across navigations. Inactive panels
 * are `hidden`; without JavaScript the stylesheet shows every panel stacked.
 */
export function CapabilityTabs({ label, tabs }: CapabilityTabsProps) {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  // Auto-advance only with motion allowed; pause while off screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) =>
      setOnScreen(entry?.isIntersecting ?? false),
    );
    observer.observe(root);
    const frame = requestAnimationFrame(() => setAutoplay(true));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const paused = hovered || focused || !onScreen;
  const advance = () => setActive((i) => (i + 1) % tabs.length);

  const focusTab = (i: number) => {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
    const tab = tabRefs.current[next];
    tab?.focus();
    // On phones the tab list scrolls sideways: bring the newly selected tab into view.
    tab?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') focusTab(i + 1);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') focusTab(i - 1);
    else if (event.key === 'Home') focusTab(0);
    else if (event.key === 'End') focusTab(tabs.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <div
      ref={rootRef}
      className={styles.tabs}
      data-autoplay={autoplay || undefined}
      data-paused={paused || undefined}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
      // Keyboard focus only (:focus-visible): a mouse click restarts the timer and lets it
      // run on, as in the prototype.
      onFocus={(e) => setFocused((e.target as HTMLElement).matches(':focus-visible'))}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className={styles.tabList} role="tablist" aria-label={label}>
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${tab.id}`}
            className={styles.tab}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${tab.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {tab.label}
            {autoplay && i === active ? (
              // Keyed by the active tab, so selecting a tab restarts its 7s timer.
              <span
                key={`progress-${active}`}
                className={styles.tabProgress}
                aria-hidden="true"
                onAnimationEnd={advance}
              />
            ) : null}
          </button>
        ))}
      </div>
      <div className={styles.tabStage}>
        {tabs.map((tab, i) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${base}-panel-${tab.id}`}
            aria-labelledby={`${base}-tab-${tab.id}`}
            className={styles.tabPanel}
            hidden={i !== active}
            data-active={i === active || undefined}
            tabIndex={0}
          >
            {tab.panel}
          </div>
        ))}
      </div>
    </div>
  );
}
