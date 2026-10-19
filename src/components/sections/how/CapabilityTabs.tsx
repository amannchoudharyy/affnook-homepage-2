'use client';

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

import styles from './HowItWorks.module.css';

interface CapabilityTabsProps {
  label: string;
  tabs: { id: string; label: string; panel: ReactNode }[];
}

/**
 * Capability tabs (Figma: panel crossfade). WAI-ARIA tabs pattern: one tab stop, arrow
 * keys / Home / End move between tabs and activate them. Nothing rotates automatically
 * (the prototype's autoplay was dropped). Inactive panels are `hidden`; without JavaScript
 * the stylesheet shows every panel stacked so no content is lost.
 */
export function CapabilityTabs({ label, tabs }: CapabilityTabsProps) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  const focusTab = (i: number) => {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
    tabRefs.current[next]?.focus();
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
    <div className={styles.tabs}>
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
