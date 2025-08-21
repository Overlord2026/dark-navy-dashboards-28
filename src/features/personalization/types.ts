export type Persona = 'aspiring' | 'retiree';
export type ComplexityTier = 'foundational' | 'advanced';

export interface UserFacts {
  entitiesCount: number;
  propertiesCount: number;
  hasAltsOrPrivate: boolean;
  k1Count: number;
  equityCompPresent: boolean;
  estateInstrumentsPresent: boolean;
  estimatedLinkedAssetsUSD: number;
}

export interface PersonalizationState {
  persona: Persona;
  complexityTier: ComplexityTier;
  facts: UserFacts;
  lastTierChange?: Date;
}

export interface TierReceipt {
  id: string;
  userId: string;
  previousTier: ComplexityTier;
  newTier: ComplexityTier;
  triggerFacts: Partial<UserFacts>;
  timestamp: Date;
  reason: string;
}

export interface PersonalizationEvent {
  type: 'personalization.changed' | 'tier.changed' | 'persona.switched';
  payload: {
    userId: string;
    persona?: Persona;
    previousTier?: ComplexityTier;
    newTier?: ComplexityTier;
    facts?: UserFacts;
    timestamp: Date;
  };
}

export const DEFAULT_FACTS: UserFacts = {
  entitiesCount: 0,
  propertiesCount: 0,
  hasAltsOrPrivate: false,
  k1Count: 0,
  equityCompPresent: false,
  estateInstrumentsPresent: false,
  estimatedLinkedAssetsUSD: 0
};

export const DEFAULT_PERSONALIZATION: PersonalizationState = {
  persona: 'aspiring',
  complexityTier: 'foundational',
  facts: DEFAULT_FACTS
};