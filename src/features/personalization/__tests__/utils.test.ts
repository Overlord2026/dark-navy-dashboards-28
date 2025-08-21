import { describe, it, expect, beforeEach } from 'vitest';
import { 
  deriveComplexityTier, 
  createTierReceipt, 
  calculateTierImpact,
  validateFacts
} from '../utils';
import { UserFacts, DEFAULT_FACTS } from '../types';

describe('personalization utils', () => {
  describe('deriveComplexityTier', () => {
    it('should return foundational for default facts', () => {
      const result = deriveComplexityTier(DEFAULT_FACTS);
      expect(result).toBe('foundational');
    });

    it('should return advanced when entitiesCount >= 2', () => {
      const facts: UserFacts = { ...DEFAULT_FACTS, entitiesCount: 2 };
      const result = deriveComplexityTier(facts);
      expect(result).toBe('advanced');
    });

    it('should return advanced when propertiesCount >= 2', () => {
      const facts: UserFacts = { ...DEFAULT_FACTS, propertiesCount: 3 };
      const result = deriveComplexityTier(facts);
      expect(result).toBe('advanced');
    });

    it('should return advanced when hasAltsOrPrivate is true', () => {
      const facts: UserFacts = { ...DEFAULT_FACTS, hasAltsOrPrivate: true };
      const result = deriveComplexityTier(facts);
      expect(result).toBe('advanced');
    });

    it('should return advanced when k1Count >= 2', () => {
      const facts: UserFacts = { ...DEFAULT_FACTS, k1Count: 2 };
      const result = deriveComplexityTier(facts);
      expect(result).toBe('advanced');
    });

    it('should return advanced when equityCompPresent is true', () => {
      const facts: UserFacts = { ...DEFAULT_FACTS, equityCompPresent: true };
      const result = deriveComplexityTier(facts);
      expect(result).toBe('advanced');
    });

    it('should return advanced when estateInstrumentsPresent is true', () => {
      const facts: UserFacts = { ...DEFAULT_FACTS, estateInstrumentsPresent: true };
      const result = deriveComplexityTier(facts);
      expect(result).toBe('advanced');
    });

    it('should return advanced when estimatedLinkedAssetsUSD >= 3M', () => {
      const facts: UserFacts = { ...DEFAULT_FACTS, estimatedLinkedAssetsUSD: 3_000_000 };
      const result = deriveComplexityTier(facts);
      expect(result).toBe('advanced');
    });

    it('should return foundational when assets are just under 3M', () => {
      const facts: UserFacts = { ...DEFAULT_FACTS, estimatedLinkedAssetsUSD: 2_999_999 };
      const result = deriveComplexityTier(facts);
      expect(result).toBe('foundational');
    });
  });

  describe('createTierReceipt', () => {
    it('should create a valid tier receipt', () => {
      const userId = 'test-user';
      const facts: UserFacts = { ...DEFAULT_FACTS, entitiesCount: 2 };
      
      const receipt = createTierReceipt(userId, 'foundational', 'advanced', facts);
      
      expect(receipt.userId).toBe(userId);
      expect(receipt.previousTier).toBe('foundational');
      expect(receipt.newTier).toBe('advanced');
      expect(receipt.triggerFacts).toEqual(facts);
      expect(receipt.timestamp).toBeInstanceOf(Date);
      expect(receipt.id).toMatch(/^tier_receipt_/);
      expect(receipt.reason).toContain('Multiple entities');
    });
  });

  describe('calculateTierImpact', () => {
    it('should return no-change for same tier', () => {
      const result = calculateTierImpact('foundational', 'foundational');
      expect(result).toBe('no-change');
    });

    it('should return upgrade for foundational to advanced', () => {
      const result = calculateTierImpact('foundational', 'advanced');
      expect(result).toBe('upgrade');
    });

    it('should return downgrade for advanced to foundational', () => {
      const result = calculateTierImpact('advanced', 'foundational');
      expect(result).toBe('downgrade');
    });
  });

  describe('validateFacts', () => {
    it('should validate complete facts object', () => {
      const result = validateFacts(DEFAULT_FACTS);
      expect(result).toBe(true);
    });

    it('should fail validation for incomplete facts', () => {
      const incomplete = { entitiesCount: 1 };
      const result = validateFacts(incomplete);
      expect(result).toBe(false);
    });

    it('should fail validation for facts with null values', () => {
      const withNull = { ...DEFAULT_FACTS, entitiesCount: null };
      const result = validateFacts(withNull as any);
      expect(result).toBe(false);
    });
  });
});