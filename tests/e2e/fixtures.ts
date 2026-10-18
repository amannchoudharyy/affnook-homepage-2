export const ROUTES = [
  { id: 'operators', path: '/', label: 'Operators', h1: 'All your brands. One control panel.' },
  {
    id: 'brands',
    path: '/brands',
    label: 'Brands',
    h1: 'Know which partners bring players who pay.',
  },
  {
    id: 'networks',
    path: '/affiliate-networks',
    label: 'Affiliate networks',
    h1: 'Scale the network. Not the busywork.',
  },
] as const;

/** Agreed responsive QA widths (CSS px). */
export const QA_WIDTHS = [320, 360, 390, 768, 1024, 1280, 1440, 1920, 2560] as const;

export const pathRegExp = (path: string) => new RegExp(`${path === '/' ? '/' : path}$`);
