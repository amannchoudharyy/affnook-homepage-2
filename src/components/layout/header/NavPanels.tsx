import { AudienceLink } from '@/components/audience/AudienceLink';
import { AudienceIcon } from '@/components/ui/icons';
import { AUDIENCES } from '@/content/audiences';
import {
  PLATFORM_FEATURE,
  PLATFORM_GROUPS,
  RESOURCE_FEATURE,
  RESOURCE_GROUPS,
  SOLUTIONS,
  type LinkGroup,
} from '@/content/navigation';

import styles from './SiteHeader.module.css';

function ExternalMenuLink({ href, label, index }: { href: string; label: string; index: number }) {
  return (
    <a
      className={`${styles.menuLink} ${styles.stagger}`}
      style={{ '--i': index } as React.CSSProperties}
      href={href}
      target="_blank"
      rel="noopener"
    >
      {label}
    </a>
  );
}

function LinkColumns({ groups }: { groups: readonly LinkGroup[] }) {
  let index = 0;
  return (
    <>
      {groups.map((group) => (
        <div key={group.heading} className={styles.menuColumn}>
          <p className={styles.menuHeading}>{group.heading}</p>
          <ul className={styles.menuList}>
            {group.links.map((link) => (
              <li key={link.href}>
                <ExternalMenuLink href={link.href} label={link.label} index={index++} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export function SolutionsPanel() {
  return (
    <ul className={styles.menuList}>
      {SOLUTIONS.map((item, index) => (
        <li key={item.audience}>
          <AudienceLink
            audience={item.audience}
            className={`${styles.solution} ${styles.stagger}`}
            style={{ '--i': index } as React.CSSProperties}
          >
            <span className={styles.solutionIcon} aria-hidden="true">
              <AudienceIcon audience={item.audience} />
            </span>
            <span>
              <span className={styles.solutionTitle}>
                {AUDIENCES[item.audience].label}
                <span className={styles.viewingTag}>Viewing</span>
              </span>
              <span className={styles.solutionText}>{item.description}</span>
            </span>
          </AudienceLink>
        </li>
      ))}
    </ul>
  );
}

export function PlatformPanel() {
  const count = PLATFORM_GROUPS.reduce((n, g) => n + g.links.length, 0);
  return (
    <>
      <div className={styles.menuColumns}>
        <LinkColumns groups={PLATFORM_GROUPS} />
      </div>
      <a
        className={`${styles.featureLink} ${styles.stagger}`}
        style={{ '--i': count } as React.CSSProperties}
        href={PLATFORM_FEATURE.href}
      >
        <span>
          <span className={styles.newBadge}>{PLATFORM_FEATURE.badge}</span>
          <strong>{PLATFORM_FEATURE.title}</strong> {PLATFORM_FEATURE.text}
        </span>
        <span className={styles.featureCta}>{PLATFORM_FEATURE.cta} →</span>
      </a>
    </>
  );
}

export function ResourcesPanel() {
  const count = RESOURCE_GROUPS.reduce((n, g) => n + g.links.length, 0);
  return (
    <div className={`${styles.menuColumns} ${styles.resourceColumns}`}>
      <LinkColumns groups={RESOURCE_GROUPS} />
      <a
        className={`${styles.caseCard} ${styles.stagger}`}
        style={{ '--i': count } as React.CSSProperties}
        href={RESOURCE_FEATURE.href}
        target="_blank"
        rel="noopener"
      >
        <span>
          <small>{RESOURCE_FEATURE.eyebrow}</small>
          <strong>{RESOURCE_FEATURE.title}</strong>
          <span className={styles.caseText}>{RESOURCE_FEATURE.text}</span>
        </span>
        <span className={styles.featureCta}>{RESOURCE_FEATURE.cta} →</span>
      </a>
    </div>
  );
}

/** Flat link lists used inside the mobile menu accordions. */
export function MobileSolutionLinks() {
  return (
    <ul className={styles.menuList}>
      {SOLUTIONS.map((item) => (
        <li key={item.audience}>
          <AudienceLink audience={item.audience} className={styles.menuLink}>
            {AUDIENCES[item.audience].label}
          </AudienceLink>
        </li>
      ))}
    </ul>
  );
}

export function MobileGroupLinks({
  groups,
  extra,
}: {
  groups: readonly LinkGroup[];
  extra?: { label: string; href: string };
}) {
  return (
    <ul className={styles.menuList}>
      {groups.flatMap((group) =>
        group.links.map((link) => (
          <li key={link.href}>
            <a className={styles.menuLink} href={link.href} target="_blank" rel="noopener">
              {link.label}
            </a>
          </li>
        )),
      )}
      {extra ? (
        <li>
          <a className={styles.menuLink} href={extra.href}>
            {extra.label}
          </a>
        </li>
      ) : null}
    </ul>
  );
}
