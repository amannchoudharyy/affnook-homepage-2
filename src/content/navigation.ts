import type { AudienceId } from './audiences';
import { affnookUrl as af, type ExternalLink, type NavLink } from './links';

/** Header navigation content (desktop dropdowns and mobile menu). */

export interface SolutionItem {
  audience: AudienceId;
  description: string;
}

export interface LinkGroup {
  heading: string;
  links: ExternalLink[];
}

export const SOLUTIONS: readonly SolutionItem[] = [
  {
    audience: 'operators',
    description: 'Run every casino, sportsbook and poker brand from one log-in.',
  },
  {
    audience: 'brands',
    description: 'Track partners, promo codes and deposits, and pay partners on time.',
  },
  {
    audience: 'networks',
    description: 'Tiered publishers, commission rules and fraud checks across brands.',
  },
];

export const PLATFORM_GROUPS: readonly LinkGroup[] = [
  {
    heading: 'Power insightful growth',
    links: [
      { label: 'Live attribution data', href: af('/affiliate-marketing-software/') },
      { label: 'Promo-level insights', href: af('/promo-tracking/') },
      { label: 'Lifetime value calculator', href: af('/lifetime-value/') },
      { label: 'Affiliate network amplifier', href: af('/super-affiliate-program/') },
    ],
  },
  {
    heading: 'Streamline operations',
    links: [
      { label: 'Automated invoicing', href: af('/invoicing-automation/') },
      { label: 'Commission bundling', href: af('/custom-affiliate-payout-structures-for-groups/') },
      { label: 'Migration made easy', href: af('/seamless-migration/') },
      { label: 'Made-to-order solutions', href: af('/features-on-request/') },
    ],
  },
  {
    heading: 'Engineered for trust',
    links: [
      { label: 'Anytime assistance', href: af('/24-7-support/') },
      { label: 'Global fraud shield', href: af('/affiliate-marketing-fraud-prevention/') },
      { label: 'Integrations', href: af('/integrations/') },
    ],
  },
];

/** Featured promo in the Platform dropdown; links to the MCP section once it exists. */
export const PLATFORM_FEATURE = {
  badge: 'New',
  title: 'Affnook MCP.',
  text: 'Ask Claude about your affiliate data and get instant answers.',
  cta: 'Explore',
  href: '#mcp',
} as const;

export const RESOURCE_GROUPS: readonly LinkGroup[] = [
  {
    heading: 'Learn',
    links: [
      { label: 'Blogs', href: af('/blog') },
      { label: 'Guides', href: af('/guides') },
      { label: 'Industry reports', href: af('/industry-reports/') },
      { label: 'Whitepapers', href: af('/whitepapers/') },
      { label: 'Glossary', href: af('/glossary/') },
    ],
  },
  {
    heading: 'Explore',
    links: [
      { label: 'Case studies', href: af('/success-stories-case-study') },
      { label: 'Ask Affnook', href: af('/ask-affnook/') },
      { label: 'News & events', href: af('/news-events') },
      { label: 'Checklists', href: af('/igaming-checklist/') },
      { label: 'Product updates', href: af('/product-updates') },
      { label: 'Compare us', href: af('/compare-us') },
    ],
  },
];

export const RESOURCE_FEATURE = {
  eyebrow: 'Case study',
  title: 'How Unicon365 grew NGR 200% across 9+ brands',
  text: 'Tracking, fraud checks and payouts in one Affnook dashboard.',
  cta: 'Read the story',
  /** Unicon365 case study (page title "Online Casino Brand Case Study | Unicon365"). */
  href: af('/customer-success-story-online-casino-brand/'),
} as const;

/* ------------------------------------------------------------------ footer */

export interface FooterColumn {
  heading: string;
  links: NavLink[];
}

export const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    heading: 'Platform',
    links: [
      { label: 'Live attribution', href: af('/affiliate-marketing-software/') },
      { label: 'Fraud Shield', href: af('/affiliate-marketing-fraud-prevention/') },
      { label: 'Automated invoicing', href: af('/invoicing-automation/') },
      { label: 'Commission bundling', href: af('/custom-affiliate-payout-structures-for-groups/') },
      { label: 'Migration', href: af('/seamless-migration/') },
      { label: 'Integrations', href: af('/integrations/') },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Blog', href: af('/blog') },
      { label: 'Guides', href: af('/guides') },
      { label: 'Industry reports', href: af('/industry-reports/') },
      { label: 'Case studies', href: af('/success-stories-case-study') },
      { label: 'Glossary', href: af('/glossary') },
      { label: 'Compare us', href: af('/compare-us') },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Why Affnook', href: af('/why-choose-affnook') },
      { label: 'About us', href: af('/about/') },
      { label: 'Contact sales', href: af('/contact-sales/') },
      { label: '24/7 support', href: af('/24-7-support/') },
      { label: 'Product updates', href: af('/product-updates') },
      { label: 'Career', href: af('/career/') },
    ],
  },
];

export const API_DOC_LINKS: readonly ExternalLink[] = [
  { label: 'Admin API docs', href: 'https://admin-api-docs.affnook.com/' },
  { label: 'Affiliate API docs', href: 'https://affiliate-api-docs.affnook.com/' },
];

export const SOCIAL_LINKS = [
  { network: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/affnook' },
  { network: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/affnook/' },
  {
    network: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61563616059791',
  },
  { network: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@Affnook' },
] as const;

export const LEGAL_LINKS: readonly ExternalLink[] = [
  { label: 'Billing policy', href: af('/billing-policy') },
  { label: 'Privacy policy', href: af('/privacy-policy') },
  { label: 'Terms', href: af('/terms-of-service') },
  { label: 'GDPR · CCPA', href: af('/gdpr-ccpa-compliance') },
];
