'use client';

import { useEffect } from 'react';

import { endAudienceSwap, takeKeyboardSwitch } from '@/lib/audience-transition';

/**
 * Rendered by each audience page: fades the content back in once the new route mounts and,
 * after a keyboard switch, moves focus to the selected switcher link so the reader keeps
 * their place (otherwise focus would fall back to the document body).
 */
export function AudienceSwapReset() {
  useEffect(() => {
    endAudienceSwap();
    const id = takeKeyboardSwitch();
    if (id) document.querySelector<HTMLElement>(`main a[data-audience="${id}"]`)?.focus();
  }, []);
  return null;
}
