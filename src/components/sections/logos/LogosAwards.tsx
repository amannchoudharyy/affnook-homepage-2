import Image from 'next/image';
import type { CSSProperties } from 'react';

import { Reveal } from '@/components/motion/Reveal';
import { LOGOS } from '@/content/sections';

import styles from './LogosAwards.module.css';

/**
 * Logos + awards (Figma "Logos + awards": logo row marquees on a 40s loop, pauses on hover;
 * the "Awards band — Compact" tiles below). Identical for all audiences.
 *
 * The marquee is pure CSS: the wordmark list is rendered twice and translated by -50%.
 * The duplicate is hidden from assistive technology. With reduced motion the row becomes a
 * static, wrapping list.
 */
export function LogosAwards() {
  return (
    <section className={styles.section} aria-labelledby="logos-title">
      <Reveal>
        <h2 id="logos-title" className={styles.heading} data-reveal="">
          {LOGOS.heading}
        </h2>
        <div className={styles.marquee}>
          <div className={styles.track}>
            <ul className={styles.set}>
              {LOGOS.wordmarks.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
            <ul className={styles.set} aria-hidden="true">
              {LOGOS.wordmarks.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
        <ul className={styles.awards}>
          {LOGOS.awards.map((award, i) => (
            <li
              key={award.title}
              className={styles.award}
              data-reveal=""
              style={{ '--d': `${i * 90}ms` } as CSSProperties}
            >
              <span className={styles.logoCard}>
                <Image src={award.image} alt={award.alt} width={121} height={80} sizes="121px" />
              </span>
              <span className={styles.caption}>
                <strong>{award.title}</strong>
                <span>{award.issuer}</span>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
