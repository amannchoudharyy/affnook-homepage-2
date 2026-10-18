'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { prefersReducedMotion } from './motion';

/** Must match the fade-out duration in globals.css (`html[data-audience-swap] main`). */
export const AUDIENCE_SWAP_MS = 360;

/**
 * Navigates to another audience route with the prototype's cross-fade: the page content
 * fades out, the route changes, and the new page fades in while its hero entrance replays.
 * Falls back to an immediate navigation when reduced motion is requested.
 */
export function useAudienceNavigation() {
  const router = useRouter();

  return useCallback(
    (href: string) => {
      const root = document.documentElement;
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }
      root.dataset.audienceSwap = 'out';
      window.setTimeout(() => {
        router.push(href);
      }, AUDIENCE_SWAP_MS);
      // Safety net: never leave the page faded out if navigation stalls or fails.
      window.setTimeout(endAudienceSwap, AUDIENCE_SWAP_MS + 4000);
    },
    [router],
  );
}

/** Clears the fade-out state once the new route has rendered. */
export function endAudienceSwap() {
  delete document.documentElement.dataset.audienceSwap;
}

/** True for clicks that should keep the browser's default behaviour (new tab, etc.). */
export function isModifiedClick(event: {
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  button: number;
}) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}
