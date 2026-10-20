'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { prefersReducedMotion } from './motion';

/** Must match the fade-out duration in globals.css (`html[data-audience-swap] main`). */
export const AUDIENCE_SWAP_MS = 360;

/** Pending swap timers. Module-level so every switcher/link shares one in-flight swap. */
let pendingPush: number | undefined;
let safetyNet: number | undefined;

function clearPendingSwap() {
  window.clearTimeout(pendingPush);
  window.clearTimeout(safetyNet);
  pendingPush = undefined;
  safetyNet = undefined;
}

/**
 * Navigates to another audience route with the prototype's cross-fade: the page content
 * fades out, the route changes, and the new page fades in while its hero entrance replays.
 * Falls back to an immediate navigation when reduced motion is requested. A new call cancels
 * a swap that is still fading out, so rapid switching always ends on the last choice.
 */
export function useAudienceNavigation() {
  const router = useRouter();

  return useCallback(
    (href: string) => {
      const root = document.documentElement;
      clearPendingSwap();
      if (prefersReducedMotion()) {
        delete root.dataset.audienceSwap;
        router.push(href);
        return;
      }
      root.dataset.audienceSwap = 'out';
      pendingPush = window.setTimeout(() => {
        pendingPush = undefined;
        router.push(href);
      }, AUDIENCE_SWAP_MS);
      // Safety net: never leave the page faded out if navigation stalls or fails.
      safetyNet = window.setTimeout(endAudienceSwap, AUDIENCE_SWAP_MS + 4000);
    },
    [router],
  );
}

/**
 * Cancels a swap that is still fading out (the user picked the audience already on screen)
 * and fades the current page back in.
 */
export function cancelAudienceSwap() {
  clearPendingSwap();
  endAudienceSwap();
}

/** After a keyboard switch, the new page focuses this audience's switcher link. */
export function rememberKeyboardSwitch(id: string) {
  window.__affnookFocusAudience = id;
}

/** Returns (and clears) the audience whose switcher link should receive focus. */
export function takeKeyboardSwitch() {
  const id = window.__affnookFocusAudience;
  window.__affnookFocusAudience = undefined;
  return id;
}

/** Clears the fade-out state once the new route has rendered. */
export function endAudienceSwap() {
  window.clearTimeout(safetyNet);
  safetyNet = undefined;
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

declare global {
  interface Window {
    /** Audience whose switcher link should receive focus after a keyboard switch. */
    __affnookFocusAudience?: string;
  }
}
