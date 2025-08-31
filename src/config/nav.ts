// src/config/nav.ts
export type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
  external?: boolean;
};

export const NAV: NavItem[] = [
  { label: 'NIL', href: '/nil' },
  { label: 'Search', href: '/nil/search' },
  { label: 'Goals', href: '/nil/goals' },
  { label: 'Catalog', href: '/catalog' },

  // Families (Retirees first)
  {
    label: 'Families',
    children: [
      { label: 'Retirees', href: '/families/retirees' },
      { label: 'Aspiring Families', href: '/families/aspiring' },
    ]
  },

  // Service Professionals with insurance sub-persona
  {
    label: 'Service Professionals',
    children: [
      { label: 'Financial Advisors', href: '/pros/advisors' },
      { label: 'Accountants (CPAs)', href: '/pros/cpas' },
      { label: 'Attorneys', href: '/pros/attorneys' },
      {
        label: 'Insurance',
        children: [
          { label: 'Life & Annuity', href: '/pros/insurance/life-annuity' },
          { label: 'Property & Casualty', href: '/pros/insurance/pc' },
          { label: 'Medicare & LTC', href: '/pros/insurance/medicare-ltc' },
        ]
      },
    ]
  },

  // Expose the health hub explicitly
  { label: 'Healthcare', href: '/health' },

  // Keep Solutions
  { label: 'Solutions', href: '/solutions' },
];
