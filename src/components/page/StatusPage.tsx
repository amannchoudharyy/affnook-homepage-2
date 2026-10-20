import Link from 'next/link';
import type { ReactNode } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { listAudiences } from '@/content/audiences';

import styles from './StatusPage.module.css';

interface StatusPageProps {
  code: string;
  title: string;
  text: string;
  /** Extra actions (e.g. "Try again" on the error page). */
  actions?: ReactNode;
}

/**
 * Branded 404 / error page body. Rendered inside the root layout, so the header, footer and
 * skip link stay available; `main#main` is the skip-link target.
 */
export function StatusPage({ code, title, text, actions }: StatusPageProps) {
  return (
    <main id="main" tabIndex={-1} className={styles.main}>
      <div className={styles.inner}>
        <p className={styles.code}>{code}</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.text}>{text}</p>
        <div className={styles.actions}>
          {actions}
          <ButtonLink href="/">Go to the homepage</ButtonLink>
        </div>
        <nav aria-label="Affnook for" className={styles.audiences}>
          <ul>
            {listAudiences().map((audience) => (
              <li key={audience.id}>
                <Link href={audience.path}>Affnook for {audience.label.toLowerCase()}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
