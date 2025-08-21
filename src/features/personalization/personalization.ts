import { Persona, ComplexityTier, UserFacts } from './types';

/**
 * Gets the current user persona from profile or defaults to 'aspiring'
 */
export function getPersona(): Persona {
  try {
    // Try to get from localStorage first (demo implementation)
    const stored = localStorage.getItem('user_personalization');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.persona && (parsed.persona === 'aspiring' || parsed.persona === 'retiree')) {
        return parsed.persona;
      }
    }
  } catch (error) {
    console.warn('Failed to load persona from storage:', error);
  }
  
  // Default to aspiring
  return 'aspiring';
}

/**
 * Computes complexity tier based on user facts
 * Advanced if any condition is true:
 * - entitiesCount >= 2 OR propertiesCount >= 2
 * - hasAltsOrPrivate = true OR k1Count >= 2
 * - equityCompPresent = true OR estateInstrumentsPresent = true
 * - estimatedLinkedAssetsUSD >= 3_000_000
 */
export function computeComplexityTier(facts: UserFacts): ComplexityTier {
  const conditions = [
    facts.entitiesCount >= 2 || facts.propertiesCount >= 2,
    facts.hasAltsOrPrivate || facts.k1Count >= 2,
    facts.equityCompPresent || facts.estateInstrumentsPresent,
    facts.estimatedLinkedAssetsUSD >= 3_000_000
  ];

  return conditions.some(condition => condition) ? 'advanced' : 'foundational';
}

/**
 * Gets module order based on persona and complexity tier
 */
export function getModuleOrder(persona: Persona, tier: ComplexityTier): string[] {
  const baseOrders = {
    aspiring: ['goals', 'cashflow', 'vault', 'properties', 'education'],
    retiree: ['income', 'goals', 'hsa', 'vault', 'properties']
  };

  const baseOrder = baseOrders[persona];

  // For advanced tier, we could modify the order or add modules
  if (tier === 'advanced') {
    // Add advanced modules or reorder for complexity
    const advancedModules = ['entities', 'tax-planning', 'estate-planning'];
    return [...baseOrder, ...advancedModules];
  }

  return baseOrder;
}

/**
 * Default user facts for new users
 */
export const getDefaultFacts = (): UserFacts => ({
  entitiesCount: 0,
  propertiesCount: 0,
  hasAltsOrPrivate: false,
  k1Count: 0,
  equityCompPresent: false,
  estateInstrumentsPresent: false,
  estimatedLinkedAssetsUSD: 0
});

/**
 * Validates that all required facts are present
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