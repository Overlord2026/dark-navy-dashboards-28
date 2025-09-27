// src/config/nav.ts
export type NavItem = {
  label: string;
  path?: string;
  children?: { label: string; path: string }[];
};

export const NAV: NavItem[] = [
  // NIL item conditionally included based on feature flag in components that use this config
  { label: 'Search', path: '/search' },
  { label: 'Goals', path: '/goals' },
  { label: 'Catalog', path: '/catalog' },
  {
    label: 'Families',
    children: [
      { label: 'Overview', path: '/families' },
      { label: 'Retirees', path: '/start/families?segment=retirees' },
      { label: 'Aspiring Families', path: '/start/families?segment=aspiring' },
    ],
  },
  {
    label: 'Service Professionals',
    children: [
      { label: 'Overview', path: '/pros' },
      { label: 'Financial Advisors', path: '/pros/advisors' },
      { label: 'Accountants', path: '/pros/accountants' },
      { label: 'Attorneys', path: '/pros/attorneys' },
      { label: 'Insurance (Life/Annuity)', path: '/pros/insurance/life' },
      { label: 'Insurance (P&C/Medicare/LTC)', path: '/pros/insurance/other' },
    ],
  },
  { label: 'Healthcare', path: '/health' },
  { label: 'Solutions', path: '/solutions' },
  { label: 'Pricing', path: '/pricing' },
];
