import { AudienceSwitcher } from '@/components/audience/AudienceSwitcher';
import { getAudience, type AudienceId } from '@/content/audiences';

import styles from './AudienceHomePage.module.css';

/**
 * Shared homepage composition for every audience route. Each route passes only
 * its audience id; sections read audience-specific content from the content
 * layer. The 14 Figma sections are added here phase by phase.
 */
export function AudienceHomePage({ audience: id }: { audience: AudienceId }) {
  const audience = getAudience(id);
  const [line1, line2] = audience.hero.headline;

  return (
    <main id="main" className={styles.main}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <h1 id="hero-title" className={styles.title}>
          <span>{line1}</span> <span className={styles.titleMuted}>{line2}</span>
        </h1>
        <p className={styles.subhead}>{audience.hero.subhead}</p>
        <AudienceSwitcher current={audience.id} />
      </section>
    </main>
  );
}
