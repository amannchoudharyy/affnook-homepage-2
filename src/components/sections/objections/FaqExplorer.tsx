'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';

import type { FaqItem } from '@/content/closing';

import styles from './Objections.module.css';

interface FaqExplorerProps {
  categories: readonly { category: string; items: readonly FaqItem[] }[];
}

/**
 * FAQ with category tabs (Figma: General · Migration · Pricing · Fraud & data) and an
 * accordion per category (Figma: expands in 300ms; the first answer starts open).
 *
 * Categories follow the WAI-ARIA tabs pattern (arrow keys / Home / End); each question is
 * a disclosure button with `aria-expanded`. Without JavaScript every category is listed
 * with all answers expanded, so nothing is hidden behind the interaction.
 */
export function FaqExplorer({ categories }: FaqExplorerProps) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Record<number, number | null>>({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  const openIn = (c: number) => (c in open ? open[c] : 0);

  const focusTab = (i: number) => {
    const next = (i + categories.length) % categories.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') focusTab(i + 1);
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') focusTab(i - 1);
    else if (event.key === 'Home') focusTab(0);
    else if (event.key === 'End') focusTab(categories.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <div className={styles.faqBody}>
      <div
        className={styles.categories}
        role="tablist"
        aria-label="FAQ categories"
        aria-orientation="vertical"
      >
        {categories.map((cat, i) => (
          <button
            key={cat.category}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            className={styles.category}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {cat.category}
          </button>
        ))}
      </div>

      <div>
        {categories.map((cat, c) => (
          <div
            key={cat.category}
            role="tabpanel"
            id={`${base}-panel-${c}`}
            aria-labelledby={`${base}-tab-${c}`}
            hidden={c !== active}
            className={styles.panel}
          >
            <h4 className={styles.panelTitle}>{cat.category}</h4>
            <ul className={styles.accordion}>
              {cat.items.map((item, q) => {
                const isOpen = openIn(c) === q;
                const id = `${base}-${c}-${q}`;
                return (
                  <li key={item.question} className={styles.item} data-open={isOpen || undefined}>
                    <h5 className={styles.qHeading}>
                      <button
                        type="button"
                        id={`${id}-q`}
                        className={styles.question}
                        aria-expanded={isOpen}
                        aria-controls={`${id}-a`}
                        onClick={() => setOpen({ ...open, [c]: isOpen ? null : q })}
                      >
                        <span>{item.question}</span>
                        <span className={styles.toggle} aria-hidden="true" />
                      </button>
                    </h5>
                    <div
                      id={`${id}-a`}
                      role="region"
                      aria-labelledby={`${id}-q`}
                      className={styles.answer}
                    >
                      <div className={styles.answerInner}>
                        <p>{item.answer}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
