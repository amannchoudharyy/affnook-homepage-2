'use client';

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';

import { ChevronDownIcon } from '@/components/ui/icons';
import { hasFinePointer } from '@/lib/motion';

import { useHeader } from './HeaderShell';
import styles from './SiteHeader.module.css';

export interface DropdownItem {
  id: string;
  label: string;
  /** Server-rendered panel content. */
  panel: ReactNode;
  /** Panel width variant. */
  size: 'sm' | 'md' | 'lg';
}

interface DesktopNavProps {
  dropdowns: DropdownItem[];
  /** Plain top-level links rendered after the dropdowns. */
  links: ReactNode;
}

const CLOSE_DELAY_MS = 160;

/**
 * Desktop navigation with disclosure-style dropdowns:
 * - click or Enter/Space toggles; hover opens on fine pointers (with a short close delay)
 * - Escape closes and returns focus to the trigger; clicking outside or tabbing away closes
 * - panels stay in the DOM (server-rendered links) and are hidden with `visibility`
 */
export function DesktopNav({ dropdowns, links }: DesktopNavProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const { setDropdownOpen } = useHeader();
  const baseId = useId();

  useEffect(() => {
    setDropdownOpen(openId !== null);
  }, [openId, setDropdownOpen]);

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenId(null), CLOSE_DELAY_MS);
  };

  const close = useCallback((restoreFocusTo?: string) => {
    setOpenId(null);
    if (restoreFocusTo) triggerRefs.current.get(restoreFocusTo)?.focus();
  }, []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(openId);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [openId, close]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Close the open panel once one of its links is activated.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest('a');
      if (link && link.closest(`.${styles.panel}`)) setOpenId(null);
    };
    nav.addEventListener('click', onClick);
    return () => nav.removeEventListener('click', onClick);
  }, []);

  return (
    <nav
      ref={navRef}
      className={styles.desktopNav}
      aria-label="Main"
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (next && !event.currentTarget.contains(next)) setOpenId(null);
      }}
    >
      <ul className={styles.navList}>
        {dropdowns.map((item) => {
          const open = openId === item.id;
          const panelId = `${baseId}-${item.id}`;
          return (
            <li
              key={item.id}
              className={styles.dropdown}
              data-open={open || undefined}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'mouse' || !hasFinePointer()) return;
                cancelClose();
                setOpenId(item.id);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType !== 'mouse' || !hasFinePointer()) return;
                scheduleClose();
              }}
            >
              <button
                ref={(node) => {
                  if (node) triggerRefs.current.set(item.id, node);
                  else triggerRefs.current.delete(item.id);
                }}
                type="button"
                className={styles.navTrigger}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
              >
                {item.label}
                <ChevronDownIcon className={styles.chevron} />
              </button>
              <div id={panelId} className={`${styles.panel} ${styles[`panel-${item.size}`]}`}>
                {item.panel}
              </div>
            </li>
          );
        })}
        {links}
      </ul>
    </nav>
  );
}
