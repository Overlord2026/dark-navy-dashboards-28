export interface SplitParty {
  party: 'brand' | 'athlete' | 'advisor';
  share: number;
  notes?: string;
}

export function previewSplit(offerId: string): SplitParty[] {
  // Standard split configuration for NIL deals
  const splits: SplitParty[] = [
    {
      party: 'athlete',
      share: 0.75,
      notes: 'Primary beneficiary - 75% of deal value'
    },
    {
      party: 'advisor',
      share: 0.20,
      notes: 'Advisory services and negotiation - 20%'
    },
    {
      party: 'brand',
      share: 0.05,
      notes: 'Platform fees and processing - 5%'
    }
  ];

  return splits;
}

export function calculateSplitAmounts(offerId: string, totalAmount: number): Array<SplitParty & { amount: number }> {
  const splits = previewSplit(offerId);
  
  return splits.map(split => ({
    ...split,
    amount: Math.round(totalAmount * split.share * 100) / 100
  }));
}

import * as Canonical from '@/lib/canonical';

export async function hashSplit(splits: SplitParty[]): Promise<string> {
  const splitData = splits.map(s => ({ party: s.party, share: s.share }));
  return await Canonical.hash(splitData);
}