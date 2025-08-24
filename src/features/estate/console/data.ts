import type { ChecklistItemKey, ChecklistStatus, ChecklistItem } from '../checklist/types';

export type Origin = 'autofill' | 'manual' | 'notary' | 'erecord' | 'review' | 'esign';

export type PortfolioRow = {
  clientId: string;
  state?: string;
  checklist?: {
    items: Record<ChecklistItemKey, ChecklistItem>;
    hash?: string;
  };
  flags?: {
    trustWithoutDeed?: boolean;
    healthIncomplete?: boolean;
    noReviewFinal?: boolean;
    signedNoFinal?: boolean;
    deliveredNotLatest?: boolean;
    consentMissing?: boolean;
    autofillOff?: boolean;
  };
};