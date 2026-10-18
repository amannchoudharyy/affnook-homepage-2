'use client';

import { usePathname } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import styles from './SiteHeader.module.css';

interface HeaderState {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  closeMenu: (options?: { restoreFocus?: boolean }) => void;
  setDropdownOpen: (open: boolean) => void;
  menuButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const HeaderContext = createContext<HeaderState | null>(null);

export function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error('useHeader must be used inside <HeaderShell>');
  return ctx;
}

/** Above this width the desktop navigation is shown and the mobile menu must close. */
const DESKTOP_QUERY = '(min-width: 1024px)';

/**
 * Client wrapper for the fixed header: tracks scroll position (condensed style after 40px,
 * hide on scroll down / show on scroll up), owns the mobile-menu state, locks page scroll
 * while the menu is open and closes it on Escape, route change or desktop resize.
 * Scroll handling is passive and rAF-throttled; there is no perpetual animation loop.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpenState] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  const setMenuOpen = useCallback((open: boolean) => setMenuOpenState(open), []);
  const closeMenu = useCallback((options?: { restoreFocus?: boolean }) => {
    setMenuOpenState(false);
    if (options?.restoreFocus) menuButtonRef.current?.focus();
  }, []);

  // Close the menu whenever the route changes (state adjusted during render, not in an effect).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpenState(false);
  }

  // Scroll state.
  const pinned = menuOpen || dropdownOpen;
  const pinnedRef = useRef(pinned);
  useEffect(() => {
    pinnedRef.current = pinned;
  }, [pinned]);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      setScrolled(y > 40);
      if (Math.abs(dy) < 2) return;
      const focusInside = headerRef.current?.contains(document.activeElement) ?? false;
      setHidden(dy > 0 && y > 200 && !pinnedRef.current && !focusInside);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Escape closes the mobile menu and returns focus to the toggle.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu({ restoreFocus: true });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen, closeMenu]);

  // Lock page scroll while the menu is open (compensating for the scrollbar width).
  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    const prevOverflow = root.style.overflow;
    const prevPadding = root.style.paddingRight;
    root.style.overflow = 'hidden';
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    return () => {
      root.style.overflow = prevOverflow;
      root.style.paddingRight = prevPadding;
    };
  }, [menuOpen]);

  // Close the mobile menu when the viewport grows to the desktop layout.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      if (mq.matches) setMenuOpenState(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Close the menu when keyboard focus leaves the header entirely.
  useEffect(() => {
    const header = headerRef.current;
    if (!header || !menuOpen) return;
    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (next && !header.contains(next)) setMenuOpenState(false);
    };
    header.addEventListener('focusout', onFocusOut);
    return () => header.removeEventListener('focusout', onFocusOut);
  }, [menuOpen]);

  const value = useMemo<HeaderState>(
    () => ({ menuOpen, setMenuOpen, closeMenu, setDropdownOpen, menuButtonRef }),
    [menuOpen, setMenuOpen, closeMenu],
  );

  const className = [
    styles.header,
    scrolled ? styles.scrolled : '',
    hidden && !pinned ? styles.hidden : '',
    menuOpen ? styles.menuOpen : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <HeaderContext.Provider value={value}>
      <header ref={headerRef} className={className}>
        {children}
      </header>
    </HeaderContext.Provider>
  );
}
