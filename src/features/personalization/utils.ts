import { UserFacts, ComplexityTier, TierReceipt, PersonalizationEvent } from './types';

/**
 * Derives complexity tier from user facts
 * Advanced if any condition is true:
 * - entitiesCount >= 2 OR propertiesCount >= 2
 * - hasAltsOrPrivate = true OR k1Count >= 2
 * - equityCompPresent = true OR estateInstrumentsPresent = true
 * - estimatedLinkedAssetsUSD >= 3_000_000
 */
export function deriveComplexityTier(facts: UserFacts): ComplexityTier {
  const conditions = [
    facts.entitiesCount >= 2 || facts.propertiesCount >= 2,
    facts.hasAltsOrPrivate || facts.k1Count >= 2,
    facts.equityCompPresent || facts.estateInstrumentsPresent,
    facts.estimatedLinkedAssetsUSD >= 3_000_000
  ];

  return conditions.some(condition => condition) ? 'advanced' : 'foundational';
}

/**
 * Creates a tier receipt when complexity changes
 */
export function createTierReceipt(
  userId: string,
  previousTier: ComplexityTier,
  newTier: ComplexityTier,
  facts: UserFacts
): TierReceipt {
  const receipt: TierReceipt = {
    id: `tier_receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    previousTier,
    newTier,
    triggerFacts: facts,
    timestamp: new Date(),
    reason: generateTierChangeReason(facts)
  };

  // Log receipt (will be replaced with actual storage later)
  console.log('Tier Receipt Created:', JSON.stringify(receipt, null, 2));
  
  // Write to tmp for audit (stub implementation)
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      const receipts = JSON.parse(localStorage.getItem('tier_receipts') || '[]');
      receipts.push(receipt);
      localStorage.setItem('tier_receipts', JSON.stringify(receipts));
    }
  } catch (error) {
    console.warn('Failed to store tier receipt:', error);
  }

  return receipt;
}

/**
 * Generates human-readable reason for tier change
 */
function generateTierChangeReason(facts: UserFacts): string {
  const reasons: string[] = [];

  if (facts.entitiesCount >= 2) {
    reasons.push(`Multiple entities (${facts.entitiesCount})`);
  }
  if (facts.propertiesCount >= 2) {
    reasons.push(`Multiple properties (${facts.propertiesCount})`);
  }
  if (facts.hasAltsOrPrivate) {
    reasons.push('Alternative investments present');
  }
  if (facts.k1Count >= 2) {
    reasons.push(`Multiple K-1s (${facts.k1Count})`);
  }
  if (facts.equityCompPresent) {
    reasons.push('Equity compensation present');
  }
  if (facts.estateInstrumentsPresent) {
    reasons.push('Estate planning instruments present');
  }
  if (facts.estimatedLinkedAssetsUSD >= 3_000_000) {
    reasons.push(`High net worth ($${(facts.estimatedLinkedAssetsUSD / 1_000_000).toFixed(1)}M+)`);
  }

  return reasons.length > 0 ? reasons.join(', ') : 'Foundational criteria met';
}

/**
 * Emits personalization events (analytics stub)
 */
export function emitPersonalizationEvent(event: PersonalizationEvent): void {
  console.log(`Analytics Event: ${event.type}`, event.payload);
  
  // Emit to any analytics service stubs
  if (typeof window !== 'undefined' && (window as any).analytics) {
    (window as any).analytics.track(event.type, event.payload);
  }
}

/**
 * Validates facts object
 */
export function validateFacts(facts: Partial<UserFacts>): facts is UserFacts {
  const requiredFields: (keyof UserFacts)[] = [
    'entitiesCount',
    'propertiesCount',
    'hasAltsOrPrivate',
    'k1Count',
    'equityCompPresent',
    'estateInstrumentsPresent',
    'estimatedLinkedAssetsUSD'
  ];

  return requiredFields.every(field => 
    facts[field] !== undefined && facts[field] !== null
  );
}

/**
 * Calculates tier change impact
 */
export function calculateTierImpact(
  currentTier: ComplexityTier,
  newTier: ComplexityTier
): 'upgrade' | 'downgrade' | 'no-change' {
  if (currentTier === newTier) return 'no-change';
  if (currentTier === 'foundational' && newTier === 'advanced') return 'upgrade';
  if (currentTier === 'advanced' && newTier === 'foundational') return 'downgrade';
  return 'no-change';
}

/**
 * Gets stored tier receipts (for audit/debugging)
 */
export function getTierReceipts(userId?: string): TierReceipt[] {
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      const receipts = JSON.parse(localStorage.getItem('tier_receipts') || '[]');
      return userId ? receipts.filter((r: TierReceipt) => r.userId === userId) : receipts;
    }
  } catch (error) {
    console.warn('Failed to retrieve tier receipts:', error);
  }
  return [];
}