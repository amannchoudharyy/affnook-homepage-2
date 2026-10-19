import type { AudienceId } from './audiences';
import type { Tone } from './dashboards';
import { CTA_LINKS, affnookUrl } from './links';

/**
 * Copy for the "Turn — Affnook as your guide" and "Affnook MCP — AI assistant" sections,
 * from the Figma frames (Operators 9765:7878 / 9765:7974, Brands 9606:113597 / 9606:113693,
 * Networks 9606:114928 / 9606:115024). The chat and assistant conversations are sample
 * content illustrating the product, and are labelled as such in the UI.
 */

/* ------------------------------------------------------------------ turn */

export interface TurnContent {
  headline: string;
  body: string;
  cta: string;
  /** Sample conversation with the customer success team. */
  question: string;
  answer: string;
}

export const TURN_EYEBROW = 'Where Affnook comes in';

export const TURN: Record<AudienceId, TurnContent> = {
  operators: {
    headline: 'Five brands shouldn’t mean five logins.',
    body: 'Affnook puts every brand, affiliate and payout in one control panel. Then it gives you a team that stays with you long after go-live.',
    cta: 'Why operators choose Affnook',
    question: 'Can we add a custom NGR formula for our poker brand?',
    answer:
      'Yes. It’s logged as a feature request, and your CSM will confirm the timeline with you.',
  },
  brands: {
    headline: 'Grow the brand. Skip the spreadsheets.',
    body: 'Affnook puts every partner, promo code and payout in one dashboard. Then it gives you a team that stays with you long after go-live.',
    cta: 'Why brands choose Affnook',
    question: 'Can we pay our top partners weekly instead of monthly?',
    answer:
      'Yes. Put them in their own affiliate group with a weekly payout schedule. Invoices go out automatically.',
  },
  networks: {
    headline: 'Payouts shouldn’t need a whole team.',
    body: 'Affnook runs commission rules, invoices and fraud checks across every brand and publisher. Then it gives you a team that stays with you long after go-live.',
    cta: 'Why networks choose Affnook',
    question: 'Can Tier 2 publishers get CPA plus 25% rev share on one brand only?',
    answer:
      'Yes. Set a hybrid plan for that publisher group on that brand, and it’s applied automatically.',
  },
};

export const TURN_CSM = {
  initials: 'CS',
  title: 'Your customer success manager',
  meta: 'Named from day one · weekly check-ins',
  status: 'Online',
} as const;

export const TURN_UPTIME = {
  label: 'Platform uptime',
  value: '99.9%',
  /** Figma draws 30 day bars; one (index 17) is amber. */
  bars: 30,
  warnIndex: 17,
} as const;

export type PromiseIcon = 'person' | 'headset' | 'shield' | 'spark';

export interface GuidePromise {
  title: string;
  text: string;
  href: string;
  icon: PromiseIcon;
  tone: Tone;
}

/** Destinations follow the Figma layer names ("Promise — … → <page>"). */
export const TURN_PROMISES: readonly GuidePromise[] = [
  {
    title: 'Dedicated CSM',
    text: 'A named success manager from day one, with weekly check-ins.',
    href: affnookUrl('/24-7-support/'),
    icon: 'person',
    tone: 'indigo',
  },
  {
    title: '24/7 support',
    text: 'Email, chat, video or phone. Every request gets the same priority.',
    href: affnookUrl('/24-7-support/'),
    icon: 'headset',
    tone: 'mint',
  },
  {
    title: 'Anti-fraud built in',
    text: 'Bot, proxy and data-centre traffic blocked at no extra cost.',
    href: CTA_LINKS.bookDemo,
    icon: 'shield',
    tone: 'orchid',
  },
  {
    title: 'Features on request',
    text: 'Need something that isn’t there yet? Tell your CSM and our engineers build it.',
    href: CTA_LINKS.contactSales,
    icon: 'spark',
    tone: 'gold',
  },
];

export const TURN_ASSURANCES: readonly { label: string; tone: Tone }[] = [
  { label: '99.9% uptime', tone: 'mint' },
  { label: 'GDPR & CCPA compliant', tone: 'indigo' },
  { label: '100+ two-way integrations', tone: 'orchid' },
  { label: 'Data refreshed every minute', tone: 'gold' },
];

/* ------------------------------------------------------------------- mcp */

export interface AssistantRow {
  name: string;
  value: string;
  delta: string;
  /** Bar length as a share of the track (Figma 220 / 169 / 97 px of ≈291 px). */
  share: number;
  tone: Tone;
  positive: boolean;
}

/** Same for every audience in Figma. */
export const MCP = {
  badge: 'New',
  eyebrow: 'Affnook MCP · AI assistant',
  headline: ['Your Affnook Data,', 'Now in Your AI Assistant'],
  body: 'Connect Affnook MCP with Claude and turn your affiliate data into instant answers. Simply ask about performance, conversions, revenue, payouts, or campaigns, and get the insights you need without digging through reports.',
  cta: { label: 'Explore Affnook MCP', href: affnookUrl('/affnook-mcp/') },
  worksWith: 'Works with Claude',
  tryLabel: 'Try asking',
  prompts: [
    'What were my top 5 affiliates by NGR this month?',
    'Which campaigns converted best yesterday?',
    'What payouts are due this week, and to whom?',
  ],
  window: {
    title: 'AI assistant',
    status: 'Affnook MCP connected',
    question: 'Which affiliates drove the most revenue last week?',
    tool: 'Queried Affnook MCP · affiliate performance, 1–7 Oct',
    answer:
      'Here are your top affiliates by revenue for 1–7 Oct. SlotScout leads, up 18% on the week before.',
    rows: [
      {
        name: 'SlotScout',
        value: '€48.2k',
        delta: '+18%',
        share: 76,
        tone: 'mint',
        positive: true,
      },
      {
        name: 'BetWise Media',
        value: '€36.9k',
        delta: '+6%',
        share: 58,
        tone: 'indigo',
        positive: true,
      },
      {
        name: 'ReelTips',
        value: '€21.4k',
        delta: '−3%',
        share: 33,
        tone: 'indigo',
        positive: false,
      },
    ] satisfies AssistantRow[],
    followUp: 'Want me to check which of these have payouts due this week?',
    placeholder: 'Ask about performance, payouts, campaigns…',
  },
  /** Figma: "Sample conversation and data." — expanded so the demo can't be mistaken for a live AI. */
  caption: 'Product demo: sample conversation and data, not a live AI response.',
} as const;
