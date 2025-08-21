import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Persona, ComplexityTier, UserFacts } from './types';
import { computeComplexityTier, getDefaultFacts, getPersona } from './personalization';

interface PersonalizationState {
  persona: Persona;
  tier: ComplexityTier;
  facts: UserFacts;
  lastTierChange?: Date;
}

interface PersonalizationActions {
  setPersona: (persona: Persona) => void;
  updateFacts: (facts: Partial<UserFacts>) => void;
  refreshFromStorage: () => void;
  reset: () => void;
}

interface TierReceipt {
  timestamp: Date;
  userId: string;
  previousTier: ComplexityTier;
  newTier: ComplexityTier;
  triggerFacts: UserFacts;
  reason: string;
}

const initialState: PersonalizationState = {
  persona: getPersona(),
  tier: 'foundational',
  facts: getDefaultFacts()
};

// Initialize with computed tier
const initFacts = getDefaultFacts();
initialState.tier = computeComplexityTier(initFacts);

export const usePersonalizationStore = create<PersonalizationState & PersonalizationActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    setPersona: (persona: Persona) => {
      set({ persona });
      
      // Persist to storage
      try {
        const current = get();
        localStorage.setItem('user_personalization', JSON.stringify({
          persona,
          facts: current.facts
        }));
      } catch (error) {
        console.warn('Failed to persist persona:', error);
      }
      
      // Emit analytics event
      console.log('Analytics: personalization.changed', {
        type: 'persona.switched',
        persona,
        timestamp: new Date()
      });
    },

    updateFacts: (newFacts: Partial<UserFacts>) => {
      const current = get();
      const updatedFacts = { ...current.facts, ...newFacts };
      const newTier = computeComplexityTier(updatedFacts);
      
      set({ 
        facts: updatedFacts,
        tier: newTier,
        lastTierChange: newTier !== current.tier ? new Date() : current.lastTierChange
      });

      // If tier changed, emit receipt
      if (newTier !== current.tier) {
        emitTierReceipt(current.tier, newTier, updatedFacts);
      }
      
      // Persist to storage
      try {
        localStorage.setItem('user_personalization', JSON.stringify({
          persona: current.persona,
          facts: updatedFacts
        }));
      } catch (error) {
        console.warn('Failed to persist facts:', error);
      }
      
      // Emit analytics event
      console.log('Analytics: personalization.changed', {
        type: 'facts.updated',
        facts: updatedFacts,
        tier: newTier,
        timestamp: new Date()
      });
    },

    refreshFromStorage: () => {
      try {
        const stored = localStorage.getItem('user_personalization');
        if (stored) {
          const parsed = JSON.parse(stored);
          const facts = { ...getDefaultFacts(), ...parsed.facts };
          const tier = computeComplexityTier(facts);
          
          set({
            persona: parsed.persona || 'aspiring',
            facts,
            tier
          });
        }
      } catch (error) {
        console.warn('Failed to refresh from storage:', error);
      }
    },

    reset: () => {
      set(initialState);
      try {
        localStorage.removeItem('user_personalization');
      } catch (error) {
        console.warn('Failed to clear storage:', error);
      }
    }
  }))
);

/**
 * Emits a tier receipt when complexity tier changes
 */
function emitTierReceipt(previousTier: ComplexityTier, newTier: ComplexityTier, facts: UserFacts) {
  const receipt: TierReceipt = {
    timestamp: new Date(),
    userId: 'demo-user', // In real app, get from auth
    previousTier,
    newTier,
    triggerFacts: facts,
    reason: generateTierChangeReason(facts)
  };

  console.log('Tier-Receipt', receipt);
  
  // Store receipt for audit trail
  try {
    const receipts = JSON.parse(localStorage.getItem('tier_receipts') || '[]');
    receipts.push(receipt);
    localStorage.setItem('tier_receipts', JSON.stringify(receipts));
  } catch (error) {
    console.warn('Failed to store tier receipt:', error);
  }
}

/**
 * Generates human-readable reason for tier change
 */
function generateTierChangeReason(facts: UserFacts): string {
  const triggers: string[] = [];

  if (facts.entitiesCount >= 2) triggers.push(`${facts.entitiesCount} entities`);
  if (facts.propertiesCount >= 2) triggers.push(`${facts.propertiesCount} properties`);
  if (facts.hasAltsOrPrivate) triggers.push('alternative investments');
  if (facts.k1Count >= 2) triggers.push(`${facts.k1Count} K-1s`);
  if (facts.equityCompPresent) triggers.push('equity compensation');
  if (facts.estateInstrumentsPresent) triggers.push('estate instruments');
  if (facts.estimatedLinkedAssetsUSD >= 3_000_000) {
    triggers.push(`$${(facts.estimatedLinkedAssetsUSD / 1_000_000).toFixed(1)}M assets`);
  }

  return triggers.length > 0 ? `Triggered by: ${triggers.join(', ')}` : 'Default tier';
}

// Subscribe to tier changes for additional side effects
usePersonalizationStore.subscribe(
  (state) => state.tier,
  (tier, previousTier) => {
    if (tier !== previousTier && previousTier) {
      console.log('Module order changed due to tier change:', { previousTier, tier });
      
      // Emit module order change event
      console.log('Analytics: module.order.applied', {
        previousTier,
        newTier: tier,
        timestamp: new Date()
      });
    }
  }
);

// Initialize from storage on first load
if (typeof window !== 'undefined') {
  usePersonalizationStore.getState().refreshFromStorage();
}