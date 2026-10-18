import Link from 'next/link';

import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui/Button';
import { CTA_LINKS } from '@/content/links';
import { PLATFORM_FEATURE, PLATFORM_GROUPS, RESOURCE_GROUPS } from '@/content/navigation';

import { DesktopNav } from './DesktopNav';
import { HeaderShell } from './HeaderShell';
import { MenuToggle, MobileMenu } from './MobileMenu';
import {
  MobileGroupLinks,
  MobileSolutionLinks,
  PlatformPanel,
  ResourcesPanel,
  SolutionsPanel,
} from './NavPanels';
import styles from './SiteHeader.module.css';

function ExternalNavLink({ href, children }: { href: string; children: string }) {
  return (
    <li>
      <a className={styles.navLink} href={href} target="_blank" rel="noopener">
        {children}
      </a>
    </li>
  );
}

/**
 * Site header (Figma "Nav — Desktop"). Markup and link content are server-rendered;
 * HeaderShell, DesktopNav and MobileMenu add the interactive behaviour.
 */
export function SiteHeader() {
  return (
    <HeaderShell>
      <div className={styles.bar}>
        <Link href="/" className={styles.logo} aria-label="Affnook home">
          <Logo title={null} />
        </Link>

        <DesktopNav
          dropdowns={[
            { id: 'solutions', label: 'Solutions', panel: <SolutionsPanel />, size: 'sm' },
            { id: 'platform', label: 'Platform', panel: <PlatformPanel />, size: 'lg' },
            { id: 'resources', label: 'Resources', panel: <ResourcesPanel />, size: 'md' },
          ]}
          links={
            <>
              <ExternalNavLink href={CTA_LINKS.whyAffnook}>Why Affnook</ExternalNavLink>
              <ExternalNavLink href={CTA_LINKS.pricing}>Pricing</ExternalNavLink>
            </>
          }
        />

        <div className={styles.actions}>
          <a
            className={styles.contact}
            href={CTA_LINKS.contactSales}
            target="_blank"
            rel="noopener"
          >
            Contact sales
          </a>
          <ButtonLink href={CTA_LINKS.bookDemo} size="nav" className={styles.navCta}>
            Book a free demo
          </ButtonLink>
          <MenuToggle />
          {/* Without JavaScript the toggle cannot work; link to the footer sitemap instead. */}
          <a className={styles.noJsMenu} href="#site-footer">
            Menu
          </a>
        </div>
      </div>

      <MobileMenu
        sections={[
          { id: 'solutions', label: 'Solutions', content: <MobileSolutionLinks /> },
          {
            id: 'platform',
            label: 'Platform',
            content: (
              <MobileGroupLinks
                groups={PLATFORM_GROUPS}
                extra={{ label: 'Affnook MCP · New', href: PLATFORM_FEATURE.href }}
              />
            ),
          },
          {
            id: 'resources',
            label: 'Resources',
            content: <MobileGroupLinks groups={RESOURCE_GROUPS} />,
          },
        ]}
        footer={
          <>
            <a className={styles.mmLink} href={CTA_LINKS.whyAffnook} target="_blank" rel="noopener">
              Why Affnook
            </a>
            <a className={styles.mmLink} href={CTA_LINKS.pricing} target="_blank" rel="noopener">
              Pricing
            </a>
            <div className={styles.mmCtas}>
              <ButtonLink href={CTA_LINKS.bookDemo} block>
                Book a free demo
              </ButtonLink>
              <ButtonLink href={CTA_LINKS.contactSales} variant="secondary" block>
                Contact sales
              </ButtonLink>
            </div>
          </>
        }
      />
    </HeaderShell>
  );
}
