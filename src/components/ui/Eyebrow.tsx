import styles from './Section.module.css';

/** Figma "Eyebrow": pill label with a pulsing mint dot. */
export function Eyebrow({ children }: { children: string }) {
  return (
    <p className={styles.eyebrow}>
      <i aria-hidden="true" />
      {children}
    </p>
  );
}
