import Link from 'next/link';

import { listAudiences, type AudienceId } from '@/content/audiences';

import styles from './AudienceSwitcher.module.css';

interface AudienceSwitcherProps {
  current: AudienceId;
  /** Accessible name for the navigation landmark. */
  label?: string;
}

/**
 * Audience switcher rendered as ordinary links to the three audience routes, so
 * it works without JavaScript. Visual design and the animated transition are
 * layered on in the hero phase.
 */
export function AudienceSwitcher({ current, label = 'See Affnook for' }: AudienceSwitcherProps) {
  return (
    <nav aria-label={label} className={styles.switcher}>
      <ul className={styles.list}>
        {listAudiences().map((audience) => (
          <li key={audience.id}>
            <Link
              href={audience.path}
              className={styles.link}
              aria-current={audience.id === current ? 'page' : undefined}
            >
              {audience.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
