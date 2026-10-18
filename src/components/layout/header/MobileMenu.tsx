'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

import { ChevronDownIcon } from '@/components/ui/icons';

import { useHeader } from './HeaderShell';
import styles from './SiteHeader.module.css';

export interface MobileMenuSection {
  id: string;
  label: string;
  content: ReactNode;
}

interface MobileMenuProps {
  sections: MobileMenuSection[];
  /** Plain links and CTAs rendered below the accordion sections. */
  footer: ReactNode;
}

/** Hamburger toggle. Without JavaScript the server-rendered fallback link is shown instead. */
export function MenuToggle() {
  const { menuOpen, setMenuOpen, menuButtonRef } = useHeader();
  return (
    <button
      ref={menuButtonRef}
      type="button"
      className={styles.burger}
      aria-expanded={menuOpen}
      aria-controls="mobile-menu"
      aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      onClick={() => setMenuOpen(!menuOpen)}
    >
      <i aria-hidden="true" />
      <i aria-hidden="true" />
    </button>
  );
}

/**
 * Mobile/tablet navigation panel with accordion sections (one open at a time).
 * Closes when a link inside it is activated; Escape, focus-out and scroll locking are
 * handled by HeaderShell.
 */
export function MobileMenu({ sections, footer }: MobileMenuProps) {
  const { menuOpen, closeMenu } = useHeader();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  // Close the menu once a link inside it is activated.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const onClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('a')) closeMenu();
    };
    panel.addEventListener('click', onClick);
    return () => panel.removeEventListener('click', onClick);
  }, [closeMenu]);

  // Move focus into the menu when it opens.
  useEffect(() => {
    if (!menuOpen) return;
    const first = panelRef.current?.querySelector<HTMLElement>('button, a[href]');
    first?.focus();
  }, [menuOpen]);

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      className={styles.mobileMenu}
      data-open={menuOpen || undefined}
      inert={!menuOpen}
    >
      <nav aria-label="Main menu">
        {sections.map((section) => {
          const open = openSection === section.id;
          const bodyId = `${baseId}-${section.id}`;
          return (
            <div key={section.id} className={styles.mmSection} data-open={open || undefined}>
              <button
                type="button"
                className={styles.mmTrigger}
                aria-expanded={open}
                aria-controls={bodyId}
                onClick={() => setOpenSection(open ? null : section.id)}
              >
                {section.label}
                <ChevronDownIcon className={styles.chevron} />
              </button>
              <div id={bodyId} className={styles.mmBody} inert={!open}>
                <div>{section.content}</div>
              </div>
            </div>
          );
        })}
        {footer}
      </nav>
    </div>
  );
}
