'use client';

import { useEffect } from 'react';

import { endAudienceSwap } from '@/lib/audience-transition';

/** Rendered by each audience page: fades the content back in once the new route mounts. */
export function AudienceSwapReset() {
  useEffect(() => {
    endAudienceSwap();
  }, []);
  return null;
}
