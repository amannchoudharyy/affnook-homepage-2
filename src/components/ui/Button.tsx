import Link from 'next/link';
import type { ReactNode } from 'react';

import styles from './Button.module.css';
import { CtaArrowIcon } from './icons';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'md' | 'nav';

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show the circular arrow "arc" (Figma primary CTA). Defaults to true for primary. */
  arrow?: boolean;
  /** Stretch to the container width (used in the mobile menu). */
  block?: boolean;
  className?: string;
}

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

/**
 * Call-to-action rendered as a link. External destinations open in a new tab with a
 * screen-reader hint; internal routes use Next.js client-side navigation.
 */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  arrow = variant === 'primary',
  block = false,
  className,
}: ButtonLinkProps) {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    arrow ? styles.withArc : '',
    block ? styles.block : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {arrow ? (
        <span className={styles.arc} aria-hidden="true">
          <span className={styles.arrows}>
            <CtaArrowIcon />
            <CtaArrowIcon />
          </span>
        </span>
      ) : null}
    </>
  );

  if (isExternal(href)) {
    return (
      <a className={classes} href={href} target="_blank" rel="noopener">
        {content}
        <span className="visually-hidden"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {content}
    </Link>
  );
}
