'use client';

import Link from 'next/link';
import { useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';

import { AudienceIcon } from '@/components/ui/icons';
import { listAudiences, type AudienceId } from '@/content/audiences';
import {
  cancelAudienceSwap,
  isModifiedClick,
  rememberKeyboardSwitch,
  useAudienceNavigation,
} from '@/lib/audience-transition';

import styles from './AudienceSwitcher.module.css';

interface AudienceSwitcherProps {
  current: AudienceId;
  /** id of the visible label element ("See Affnook for"). */
  labelledBy: string;
}

/**
 * Segmented audience switcher (Figma "Audience switcher").
 *
 * Server-rendered as ordinary links with `aria-current="page"`, so it works without
 * JavaScript. Once hydrated, a sliding indicator (prototype behaviour) moves to the chosen
 * audience while the page cross-fades to the new route.
 */
export function AudienceSwitcher({ current, labelledBy }: AudienceSwitcherProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [selected, setSelected] = useState<AudienceId>(current);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);
  const navigate = useAudienceNavigation();

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const active = list.querySelector<HTMLElement>(`[data-audience="${selected}"]`);
      if (active) setIndicator({ x: active.offsetLeft, w: active.offsetWidth });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [selected]);

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: AudienceId, href: string) {
    if (isModifiedClick(event)) return;
    event.preventDefault();
    setSelected(id);
    // Back to the audience on screen while a swap is still fading out: cancel that swap.
    if (id === current) return cancelAudienceSwap();
    // Keyboard activation (detail 0): put focus back on this switcher on the new page.
    if (event.detail === 0) rememberKeyboardSwitch(id);
    navigate(href);
  }

  const style = indicator
    ? ({ '--ind-x': `${indicator.x}px`, '--ind-w': `${indicator.w}px` } as CSSProperties)
    : undefined;

  return (
    <nav aria-labelledby={labelledBy} className={styles.switcher}>
      <ul
        ref={listRef}
        className={styles.list}
        data-ready={indicator ? '' : undefined}
        style={style}
      >
        {listAudiences().map((audience) => (
          <li key={audience.id}>
            <Link
              href={audience.path}
              className={styles.link}
              data-audience={audience.id}
              data-selected={audience.id === selected || undefined}
              aria-current={audience.id === current ? 'page' : undefined}
              onClick={(event) => handleClick(event, audience.id, audience.path)}
            >
              <AudienceIcon audience={audience.id} className={styles.icon} />
              {audience.label}
            </Link>
          </li>
        ))}
        <li className={styles.indicator} aria-hidden="true" />
      </ul>
    </nav>
  );
}
