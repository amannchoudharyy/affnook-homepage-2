import { AudienceLink } from '@/components/audience/AudienceLink';
import { GiantLogo } from '@/components/brand/GiantLogo';
import { Logo } from '@/components/brand/Logo';
import { FacebookIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from '@/components/ui/icons';
import { NewTabHint } from '@/components/ui/NewTabHint';
import { listAudiences } from '@/content/audiences';
import type { NavLink } from '@/content/links';
import { API_DOC_LINKS, FOOTER_COLUMNS, LEGAL_LINKS, SOCIAL_LINKS } from '@/content/navigation';

import styles from './SiteFooter.module.css';

const SOCIAL_ICONS = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
} as const;

function FooterLink({ link }: { link: NavLink }) {
  if (link.href === null) {
    // Destination not confirmed yet: shown as text, never as a dead link.
    return <span className={styles.pending}>{link.label}</span>;
  }
  return (
    <a href={link.href} target="_blank" rel="noopener">
      {link.label}
      <NewTabHint />
    </a>
  );
}

/** Site footer (Figma "Footer"). Server-rendered; the newsletter form is not live yet. */
export function SiteFooter() {
  return (
    <footer id="site-footer" className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.brand}>
            <Logo className={styles.logo} />
            <p className={styles.tagline}>
              The iGaming affiliate marketing platform for operators, brands and affiliate networks.
            </p>

            <div className={styles.newsletter}>
              <h2 className={styles.newsletterTitle}>Subscribe to our Newsletter</h2>
              {/* Not connected to an email provider yet: the controls are disabled and the
                  form cannot be submitted. */}
              <form className={styles.newsletterForm} aria-describedby="newsletter-status">
                <label className="visually-hidden" htmlFor="newsletter-email">
                  Work email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  placeholder="Your work email"
                  autoComplete="email"
                  disabled
                />
                <button type="button" disabled>
                  Submit
                </button>
              </form>
              <p id="newsletter-status" className={styles.newsletterStatus}>
                Newsletter sign-up is coming soon.
              </p>
            </div>
          </div>

          <nav className={styles.linkGrid} aria-label="Footer">
            <div>
              <h2 className={styles.heading}>Solutions</h2>
              <ul className={styles.list}>
                {listAudiences().map((audience) => (
                  <li key={audience.id}>
                    <AudienceLink audience={audience.id}>{audience.label}</AudienceLink>
                  </li>
                ))}
              </ul>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className={styles.heading}>{column.heading}</h2>
                <ul className={styles.list}>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h2 className={styles.heading}>API docs</h2>
              <ul className={styles.list}>
                {API_DOC_LINKS.map((link) => (
                  <li key={link.href}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
              <h2 className={`${styles.heading} ${styles.followHeading}`}>Follow us</h2>
              <ul className={styles.social}>
                {SOCIAL_LINKS.map((item) => {
                  const Icon = SOCIAL_ICONS[item.network];
                  return (
                    <li key={item.network}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener"
                        aria-label={`Affnook on ${item.label} (opens in a new tab)`}
                      >
                        <Icon />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>

        <div className={styles.giant}>
          <GiantLogo />
        </div>

        <div className={styles.legal}>
          <div>
            <p className={styles.copyright}>© 2026 Affnook. All rights reserved.</p>
            <p className={styles.disclaimer}>
              Affnook is a B2B SaaS platform. We do not provide gambling or betting services to
              consumers.
            </p>
          </div>
          <nav aria-label="Legal">
            <ul className={styles.legalLinks}>
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
