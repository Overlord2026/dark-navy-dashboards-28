export const FAMILY_SEGMENTS = [
  { slug: 'retirees', title: 'Retirees', blurb: 'Consolidate, plan RMDs, and coordinate pros.' },
  { slug: 'aspiring', title: 'Aspiring Wealthy', blurb: 'Build habits, automate saving & documents.' },
  { slug: 'hnw', title: 'High-Net-Worth', blurb: 'Advanced tax, vault, and estate coordination.' },
  { slug: 'entrepreneurs', title: 'Business Owners', blurb: 'Entity, liquidity, and succession workflows.' },
  { slug: 'physicians', title: 'Physicians & Dentists', blurb: 'Malpractice, entity, and LTC strategies.' },
  { slug: 'executives', title: 'Corporate Executives', blurb: 'Equity comp, 10b5-1, and tax planning.' },
  { slug: 'independent_women', title: 'Independent Women', blurb: 'Goal-first planning and safety controls.' },
  { slug: 'athletes', title: 'Athletes & Entertainers', blurb: 'NIL contracts, branding, and advisors.' },
] as const;

export type FamilySegmentSlug = typeof FAMILY_SEGMENTS[number]['slug'];