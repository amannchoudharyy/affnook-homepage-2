'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';

import { audienceFromPathname, audiencePath, isAudiencePath } from '@/content/audience-routes';
import type { AudienceId } from '@/content/audiences';
import {
  cancelAudienceSwap,
  isModifiedClick,
  useAudienceNavigation,
} from '@/lib/audience-transition';

type AudienceLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  audience: AudienceId;
  /** Called before navigation starts (e.g. to close a menu). */
  onNavigate?: () => void;
};

/**
 * A plain link to an audience route. With JavaScript it switches audiences using the
 * cross-fade transition; without JavaScript it is an ordinary page link.
 */
export function AudienceLink({ audience, onNavigate, onClick, ...props }: AudienceLinkProps) {
  const pathname = usePathname();
  const navigate = useAudienceNavigation();
  const href = audiencePath(audience);
  const isCurrent = isAudiencePath(pathname) && audienceFromPathname(pathname) === audience;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || isModifiedClick(event)) return;
    event.preventDefault();
    onNavigate?.();
    if (isCurrent) {
      cancelAudienceSwap();
      window.scrollTo({ top: 0 });
      return;
    }
    navigate(href);
  }

  return (
    <Link
      href={href}
      aria-current={isCurrent ? 'page' : undefined}
      onClick={handleClick}
      {...props}
    />
  );
}
