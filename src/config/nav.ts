// src/config/nav.ts
export type NavItem = {
  label: string;
  path?: string;
  children?: { label: string; path: string }[];
};

export const NAV: NavItem[] = [
  { label: 'NIL', path: '/nil' },
  { label: 'Search', path: '/search' },
  { label: 'Goals', path: '/goals' },
  { label: 'Catalog', path: '/catalog' },
  {
    label: 'Families',
    children: [
      { label: 'Retirees', path: '/families/retirees' },
      { label: 'Aspiring Families', path: '/families/aspiring' },
    ],
  },
  {
    label: 'Service Professionals',
    children: [
      { label: 'Financial Advisors', path: '/pros/advisors' },
      { label: 'Accountants (CPAs/EA)', path: '/pros/accountants' },
      { label: 'Attorneys (Estate / Litigation)', path: '/pros/attorneys' },
      { label: 'Insurance — Life & Annuities', path: '/pros/insurance/life' },
      { label: 'Insurance — P&C', path: '/pros/insurance/pc' },
      { label: 'Insurance — Medicare', path: '/pros/insurance/medicare' },
      { label: 'Insurance — Long-Term Care', path: '/pros/insurance/ltc' },
    ],
  },
  {
    label: 'Healthcare',
    children: [
      { label: 'Health Hub (Family)', path: '/health/hub' },
      { label: 'Providers / Clinics', path: '/health/providers' },
      { label: 'Longevity Programs', path: '/health/longevity' },
    ],
  },
  {
    label: 'Solutions',
    children: [
      { label: 'Wealth Solutions', path: '/solutions/wealth' },
      { label: 'Health Solutions', path: '/solutions/health' },
    ],
  },
];
