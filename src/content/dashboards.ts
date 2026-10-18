/**
 * Sample data for the hero product stages. Every figure here is illustrative demonstration
 * data copied from the Figma frames (Operators 9765:7514, Brands 9606:113247,
 * Networks 9606:114510); the dashboards are labelled "Sample data" in the UI.
 */

export type Tone = 'indigo' | 'mint' | 'orchid' | 'gold' | 'white' | 'muted' | 'error';

export interface CountValue {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export interface Kpi {
  label: string;
  count: CountValue;
  delta: string;
  tone?: 'up' | 'warn';
}

export interface SidebarItem {
  label: string;
  tone: Tone;
}

export interface Sidebar {
  activeNav: 'Dashboard' | 'Reports';
  heading: string;
  items: SidebarItem[];
  footer?: string;
}

export interface FeedRow {
  title: string;
  detail: string;
  value?: string;
  tone: Tone;
  valueTone?: Tone;
}

export interface DashboardShell {
  url: string;
  title: string;
  subtitle: string;
  dateRange?: string;
  sidebar: Sidebar;
  kpis: Kpi[];
}

export interface Legend {
  label: string;
  tone: Tone;
}

export interface BarRow {
  label: string;
  value: string;
  width: number;
  tone: Tone;
}

export interface OperatorsDashboard extends DashboardShell {
  chart: {
    title: string;
    legend: Legend[];
    tooltip: { label: string; value: string };
    months: string[];
  };
  share: {
    title: string;
    total: CountValue;
    totalLabel: string;
    segments: { label: string; value: number; tone: Tone }[];
  };
  topMarkets: {
    title: string;
    rows: { label: string; value: number; width: number; tone: Tone }[];
  };
  activity: { title: string; visible: number; rows: FeedRow[] };
}

export interface BrandsDashboard extends DashboardShell {
  funnel: {
    title: string;
    rows: { label: string; total: string; width: number; parts: number[] }[];
    tones: Tone[];
  };
  heatmap: {
    title: string;
    columns: string[];
    rows: { label: string; cells: (number | null)[] }[];
  };
  promoCodes: {
    title: string;
    columns: string;
    rows: { code: string; uses: number; ftds: number; width: number; tone: Tone }[];
  };
  payout: {
    title: string;
    status: string;
    doneStatus: string;
    amount: CountValue;
    detail: string;
    progress: number;
    currencies: string[];
  };
}

export interface NetworksDashboard extends DashboardShell {
  tiers: {
    title: string;
    root: string;
    rows: {
      tier: string;
      publishers: string;
      share: string;
      plan: string;
      width: number;
      tone: Tone;
    }[];
  };
  revenue: { title: string; rows: BarRow[]; footnote: string };
  commissionRule: {
    title: string;
    badge: string;
    fields: { label: string; value: string }[];
    toggle: string;
  };
  postbacks: { title: string; visible: number; rows: FeedRow[] };
}

/* ----------------------------------------------------------------- operators */

export const OPERATORS_DASHBOARD: OperatorsDashboard = {
  url: 'app.affnook.com/dashboard',
  title: 'All brands',
  subtitle: 'Last 30 days · data refreshed every minute',
  dateRange: 'Sep 1 – Sep 30, 2026',
  sidebar: {
    activeNav: 'Dashboard',
    heading: 'Brands',
    items: [
      { label: 'All brands', tone: 'white' },
      { label: 'Casino', tone: 'indigo' },
      { label: 'Sportsbook', tone: 'mint' },
      { label: 'Poker', tone: 'orchid' },
      { label: 'Live casino', tone: 'gold' },
    ],
    footer: '+ Add brand',
  },
  kpis: [
    { label: 'NGR', count: { value: 1.24, decimals: 2, prefix: '$', suffix: 'M' }, delta: '+9.2%' },
    { label: 'FTDs', count: { value: 3482 }, delta: '+12.6%' },
    { label: 'Active players', count: { value: 21760 }, delta: '+4.8%' },
    { label: 'Clicks blocked', count: { value: 12906 }, delta: 'fraud', tone: 'warn' },
  ],
  chart: {
    title: 'NGR by brand',
    legend: [
      { label: 'Casino', tone: 'indigo' },
      { label: 'Sportsbook', tone: 'mint' },
      { label: 'Poker', tone: 'orchid' },
    ],
    tooltip: { label: 'Week 12 · Casino', value: '$184.6K NGR' },
    months: ['Jul', 'Aug', 'Sep'],
  },
  share: {
    title: 'Share of NGR',
    total: { value: 1.24, decimals: 2, prefix: '$', suffix: 'M' },
    totalLabel: 'total NGR',
    segments: [
      { label: 'Casino', value: 46, tone: 'indigo' },
      { label: 'Sportsbook', value: 31, tone: 'mint' },
      { label: 'Poker', value: 15, tone: 'orchid' },
      { label: 'Live casino', value: 8, tone: 'gold' },
    ],
  },
  topMarkets: {
    title: 'Top markets · NGR',
    rows: [
      { label: 'Germany', value: 34, width: 100, tone: 'indigo' },
      { label: 'Brazil', value: 22, width: 64.7, tone: 'mint' },
      { label: 'Canada', value: 18, width: 52.9, tone: 'orchid' },
      { label: 'Netherlands', value: 11, width: 32.4, tone: 'gold' },
    ],
  },
  activity: {
    title: 'Live activity',
    visible: 5,
    rows: [
      { title: 'FTD', detail: 'Sportsbook · DE', value: '$120', tone: 'mint' },
      { title: 'Registration', detail: 'Casino · BR', value: '—', tone: 'indigo' },
      {
        title: 'Click rejected',
        detail: 'Proxy IP · flagged',
        value: 'blocked',
        tone: 'error',
        valueTone: 'error',
      },
      { title: 'Deposit', detail: 'Poker · CA', value: '$60', tone: 'mint' },
      { title: 'FTD', detail: 'Live casino · NL', value: '$250', tone: 'mint' },
      { title: 'Deposit', detail: 'Casino · DE', value: '$80', tone: 'mint' },
      { title: 'Registration', detail: 'Sportsbook · BR', value: '—', tone: 'indigo' },
      {
        title: 'Click rejected',
        detail: 'Data-centre IP',
        value: 'blocked',
        tone: 'error',
        valueTone: 'error',
      },
    ],
  },
};

/* -------------------------------------------------------------------- brands */

export const BRANDS_DASHBOARD: BrandsDashboard = {
  url: 'app.affnook.com/reports/partners',
  title: 'Player journey by partner',
  subtitle: 'Last 30 days · data refreshed every minute',
  sidebar: {
    activeNav: 'Reports',
    heading: 'Top partners',
    items: [
      { label: 'All partners', tone: 'white' },
      { label: 'Partner #2231', tone: 'indigo' },
      { label: 'Partner #1874', tone: 'mint' },
      { label: 'Partner #0942', tone: 'orchid' },
      { label: 'Partner #3310', tone: 'gold' },
    ],
  },
  kpis: [
    { label: 'Clicks', count: { value: 1.28, decimals: 2, suffix: 'M' }, delta: '+6.1%' },
    { label: 'Registrations', count: { value: 42610 }, delta: '3.3% CR' },
    { label: 'FTDs', count: { value: 6904 }, delta: '16.2% of regs' },
  ],
  funnel: {
    title: 'Funnel · split by partner',
    /** Row width as % of the widest row; segment shares follow Figma's bar widths. */
    rows: [
      { label: 'Clicks', total: '1.28M', width: 100, parts: [42.2, 31.1, 16.9, 9.8] },
      { label: 'Registrations', total: '42.6K', width: 71.9, parts: [42.1, 30.9, 16.7, 9.6] },
      { label: 'FTDs', total: '6.9K', width: 45.8, parts: [42.5, 31.1, 16.7, 9.5] },
      { label: 'Repeat deposits', total: '3.1K', width: 29.7, parts: [42.9, 31.3, 16.6, 9.3] },
    ],
    tones: ['indigo', 'mint', 'orchid', 'gold'],
  },
  heatmap: {
    title: 'Player LTV by sign-up week',
    columns: ['D0', 'D7', 'D14', 'D30', 'D60', 'D90'],
    rows: [
      { label: 'Week 1', cells: [0.14, 0.26, 0.37, 0.48, 0.59, 0.7] },
      { label: 'Week 2', cells: [0.17, 0.28, 0.39, 0.5, 0.62, 0.73] },
      { label: 'Week 3', cells: [0.19, 0.3, 0.42, 0.53, 0.64, 0.75] },
      { label: 'Week 4', cells: [0.22, 0.33, 0.44, 0.55, 0.66, null] },
    ],
  },
  promoCodes: {
    title: 'Promo codes',
    columns: 'Uses · FTDs',
    rows: [
      { code: 'WELCOME50', uses: 812, ftds: 214, width: 100, tone: 'indigo' },
      { code: 'SPINS20', uses: 604, ftds: 166, width: 74.4, tone: 'mint' },
      { code: 'VIPBONUS', uses: 188, ftds: 97, width: 23.2, tone: 'orchid' },
      { code: 'CRYPTO10', uses: 143, ftds: 41, width: 17.6, tone: 'gold' },
    ],
  },
  payout: {
    title: 'Payout run · Oct 1',
    status: 'Scheduled',
    doneStatus: 'Paid',
    amount: { value: 182400, prefix: '$' },
    detail: '38 partners · CPA, rev share and hybrid plans',
    progress: 70,
    currencies: ['USD', 'EUR', 'BRL', 'CAD', '+ more'],
  },
};

/* ------------------------------------------------------------------ networks */

export const NETWORKS_DASHBOARD: NetworksDashboard = {
  url: 'app.affnook.com/network',
  title: 'Network overview',
  subtitle: 'All brand partners · last 30 days · data refreshed every minute',
  sidebar: {
    activeNav: 'Reports',
    heading: 'Brand partners',
    items: [
      { label: 'All brands', tone: 'white' },
      { label: 'Brand A · Casino', tone: 'indigo' },
      { label: 'Brand B · Sports', tone: 'mint' },
      { label: 'Brand C · Poker', tone: 'orchid' },
      { label: 'Brand D · Bingo', tone: 'gold' },
    ],
  },
  kpis: [
    { label: 'Brand partners', count: { value: 36 }, delta: '+4' },
    { label: 'Active publishers', count: { value: 1248 }, delta: '+86' },
    { label: 'Conversions', count: { value: 18420 }, delta: '+11.2%' },
    { label: 'Commissions due', count: { value: 412, prefix: '$', suffix: 'K' }, delta: 'Oct 1' },
  ],
  tiers: {
    title: 'Publishers by tier',
    root: 'Your network · 1,248 publishers',
    rows: [
      {
        tier: 'Tier 1',
        publishers: '42 publishers',
        share: '38% of revenue',
        plan: 'CPA $60 per FTD',
        width: 92.8,
        tone: 'gold',
      },
      {
        tier: 'Tier 2',
        publishers: '318 publishers',
        share: '41% of revenue',
        plan: 'Hybrid · CPA $40 + 25% rev share',
        width: 100,
        tone: 'orchid',
      },
      {
        tier: 'Tier 3',
        publishers: '888 publishers',
        share: '21% of revenue',
        plan: 'Rev share · 30% of NGR',
        width: 51.1,
        tone: 'indigo',
      },
    ],
  },
  revenue: {
    title: 'Revenue by brand partner',
    rows: [
      { label: 'Brand A · Casino', value: '$184K', width: 100, tone: 'indigo' },
      { label: 'Brand B · Sportsbook', value: '$142K', width: 77, tone: 'mint' },
      { label: 'Brand C · Poker', value: '$96K', width: 52, tone: 'orchid' },
      { label: 'Brand D · Bingo', value: '$61K', width: 33.1, tone: 'gold' },
      { label: '32 more brands', value: '$129K', width: 69.9, tone: 'muted' },
    ],
    footnote: 'Brand- and network-level postbacks',
  },
  commissionRule: {
    title: 'Commission rule',
    badge: 'Auto-applied',
    fields: [
      { label: 'Group', value: 'Tier 2 publishers' },
      { label: 'Brand', value: 'Brand B · Sportsbook' },
      { label: 'Model', value: 'Hybrid' },
      { label: 'Payout', value: 'CPA $40 + 25% rev share' },
    ],
    toggle: 'Negative carryover',
  },
  postbacks: {
    title: 'Postback log',
    visible: 4,
    rows: [
      { title: 'FTD · Pub 2231 · Brand A', detail: '200 OK · 124 ms', tone: 'mint' },
      { title: 'Registration · Pub 1874', detail: '200 OK · 98 ms', tone: 'mint' },
      { title: 'Click · Pub 0942', detail: 'Rejected · proxy IP', tone: 'error' },
      { title: 'Deposit · Pub 3310 · Brand C', detail: '200 OK · 131 ms', tone: 'mint' },
      { title: 'FTD · Pub 0518 · Brand B', detail: '200 OK · 109 ms', tone: 'mint' },
      { title: 'Click · Pub 7741', detail: 'Rejected · data-centre IP', tone: 'error' },
    ],
  },
};
