/**
 * External destinations. Every URL here points to an existing page on affnook.com (or an
 * Affnook-owned property) as referenced by the approved motion prototype. Destinations that
 * have not been confirmed yet are typed as `PendingLink` and rendered as non-links.
 */

export const AFFNOOK_ORIGIN = 'https://affnook.com';

export interface ExternalLink {
  label: string;
  href: string;
}

export interface PendingLink {
  label: string;
  /** Destination not yet confirmed; rendered as text, never as a fake link. */
  href: null;
}

export type NavLink = ExternalLink | PendingLink;

export const affnookUrl = (path: string) => `${AFFNOOK_ORIGIN}${path}`;
const af = affnookUrl;

export const CTA_LINKS = {
  bookDemo: af('/book-free-demo/'),
  contactSales: af('/contact-sales/'),
  /** Product tour video. */
  takeTour: 'https://vimeo.com/1152140502/62c8d0ebe9',
  whyAffnook: af('/why-choose-affnook'),
  /** The prototype links "Pricing" to the contact-sales page; no separate pricing page exists. */
  pricing: af('/contact-sales/'),
  award: 'https://affpapa.com/affpapa-awards-2024/client-satisfaction-of-the-year/',
} as const;
