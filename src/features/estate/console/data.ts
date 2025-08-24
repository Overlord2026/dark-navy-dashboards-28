import type { ChecklistItemKey, ChecklistStatus, ChecklistItem } from '../checklist/types';
import { getCurrentTenantId } from '@/features/tenant/context';

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

export async function listPortfolio(tenantId?: string): Promise<PortfolioRow[]> {
  const t = tenantId || getCurrentTenantId();
  // TODO: query per-tenant clients from your store; return rows with flags/checklist snapshots only, no PII
  return [];
}