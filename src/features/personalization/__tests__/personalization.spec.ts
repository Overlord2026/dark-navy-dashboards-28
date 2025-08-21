import { describe, it, expect } from 'vitest';
import { computeComplexityTier, getModuleOrder, getDefaultFacts, validateFacts } from '../personalization';
import { UserFacts, Persona, ComplexityTier } from '../types';

describe('personalization', () => {
  describe('computeComplexityTier', () => {
    it('should return foundational for default facts', () => {
      const facts = getDefaultFacts();
      const result = computeComplexityTier(facts);
      expect(result).toBe('foundational');
    });

    it('should return advanced when entitiesCount >= 2', () => {
      const facts: UserFacts = { ...getDefaultFacts(), entitiesCount: 2 };
      const result = computeComplexityTier(facts);
      expect(result).toBe('advanced');
    });

    it('should return advanced when propertiesCount >= 2', () => {
      const facts: UserFacts = { ...getDefaultFacts(), propertiesCount: 3 };
      const result = computeComplexityTier(facts);
      expect(result).toBe('advanced');
    });

    it('should return advanced when hasAltsOrPrivate is true', () => {
      const facts: UserFacts = { ...getDefaultFacts(), hasAltsOrPrivate: true };
      const result = computeComplexityTier(facts);
      expect(result).toBe('advanced');
    });

    it('should return advanced when k1Count >= 2', () => {
      const facts: UserFacts = { ...getDefaultFacts(), k1Count: 2 };
      const result = computeComplexityTier(facts);
      expect(result).toBe('advanced');
    });

    it('should return advanced when equityCompPresent is true', () => {
      const facts: UserFacts = { ...getDefaultFacts(), equityCompPresent: true };
      const result = computeComplexityTier(facts);
      expect(result).toBe('advanced');
    });

    it('should return advanced when estateInstrumentsPresent is true', () => {
      const facts: UserFacts = { ...getDefaultFacts(), estateInstrumentsPresent: true };
      const result = computeComplexityTier(facts);
      expect(result).toBe('advanced');
    });

    it('should return advanced when estimatedLinkedAssetsUSD >= 3M', () => {
      const facts: UserFacts = { ...getDefaultFacts(), estimatedLinkedAssetsUSD: 3_000_000 };
      const result = computeComplexityTier(facts);
      expect(result).toBe('advanced');
    });

    it('should return foundational when assets are just under 3M', () => {
      const facts: UserFacts = { ...getDefaultFacts(), estimatedLinkedAssetsUSD: 2_999_999 };
      const result = computeComplexityTier(facts);
      expect(result).toBe('foundational');
    });

    it('should return advanced when multiple conditions are met', () => {
      const facts: UserFacts = {
        ...getDefaultFacts(),
        entitiesCount: 3,
        hasAltsOrPrivate: true,
        estimatedLinkedAssetsUSD: 5_000_000
      };
      const result = computeComplexityTier(facts);
      expect(result).toBe('advanced');
    });
  });

  describe('getModuleOrder', () => {
    it('should return aspiring foundational order', () => {
      const result = getModuleOrder('aspiring', 'foundational');
      expect(result).toEqual(['goals', 'cashflow', 'vault', 'properties', 'education']);
    });

    it('should return aspiring advanced order with additional modules', () => {
      const result = getModuleOrder('aspiring', 'advanced');
      expect(result).toEqual([
        'goals', 'cashflow', 'vault', 'properties', 'education',
        'entities', 'tax-planning', 'estate-planning'
      ]);
    });

    it('should return retiree foundational order', () => {
      const result = getModuleOrder('retiree', 'foundational');
      expect(result).toEqual(['income', 'goals', 'hsa', 'vault', 'properties']);
    });

    it('should return retiree advanced order with additional modules', () => {
      const result = getModuleOrder('retiree', 'advanced');
      expect(result).toEqual([
        'income', 'goals', 'hsa', 'vault', 'properties',
        'entities', 'tax-planning', 'estate-planning'
      ]);
    });

    it('should handle all persona and tier combinations', () => {
      const personas: Persona[] = ['aspiring', 'retiree'];
      const tiers: ComplexityTier[] = ['foundational', 'advanced'];

      personas.forEach(persona => {
        tiers.forEach(tier => {
          const result = getModuleOrder(persona, tier);
          expect(Array.isArray(result)).toBe(true);
          expect(result.length).toBeGreaterThan(0);
          
          // Should contain base modules
          if (persona === 'aspiring') {
            expect(result).toContain('goals');
            expect(result).toContain('cashflow');
          } else {
            expect(result).toContain('income');
            expect(result).toContain('hsa');
          }
          
          // Advanced tier should have additional modules
          if (tier === 'advanced') {
            expect(result).toContain('entities');
            expect(result).toContain('tax-planning');
            expect(result).toContain('estate-planning');
          }
        });
      });
    });
  });

  describe('getDefaultFacts', () => {
    it('should return valid default facts', () => {
      const facts = getDefaultFacts();
      
      expect(facts.entitiesCount).toBe(0);
      expect(facts.propertiesCount).toBe(0);
      expect(facts.hasAltsOrPrivate).toBe(false);
      expect(facts.k1Count).toBe(0);
      expect(facts.equityCompPresent).toBe(false);
      expect(facts.estateInstrumentsPresent).toBe(false);
      expect(facts.estimatedLinkedAssetsUSD).toBe(0);
      
      expect(validateFacts(facts)).toBe(true);
    });
  });

  describe('validateFacts', () => {
    it('should validate complete facts object', () => {
      const facts = getDefaultFacts();
      expect(validateFacts(facts)).toBe(true);
    });

    it('should fail validation for incomplete facts', () => {
      const incomplete = { entitiesCount: 1 };
      expect(validateFacts(incomplete)).toBe(false);
    });

    it('should fail validation for facts with null values', () => {
      const withNull = { ...getDefaultFacts(), entitiesCount: null as any };
      expect(validateFacts(withNull)).toBe(false);
    });

    it('should fail validation for facts with undefined values', () => {
      const withUndefined = { ...getDefaultFacts() };
      delete (withUndefined as any).entitiesCount;
      expect(validateFacts(withUndefined)).toBe(false);
    });

    it('should pass validation for facts with all required fields', () => {
      const customFacts: UserFacts = {
        entitiesCount: 2,
        propertiesCount: 1,
        hasAltsOrPrivate: true,
        k1Count: 3,
        equityCompPresent: false,
        estateInstrumentsPresent: true,
        estimatedLinkedAssetsUSD: 5_000_000
      };
      expect(validateFacts(customFacts)).toBe(true);
    });
  });

  describe('integration scenarios', () => {
    it('should correctly handle persona switching workflow', () => {
      // Test that different personas get different module orders
      const aspiringOrder = getModuleOrder('aspiring', 'foundational');
      const retireeOrder = getModuleOrder('retiree', 'foundational');
      
      expect(aspiringOrder).not.toEqual(retireeOrder);
      expect(aspiringOrder[0]).toBe('goals');
      expect(retireeOrder[0]).toBe('income');
    });

    it('should correctly handle tier upgrade workflow', () => {
      const facts = getDefaultFacts();
      const initialTier = computeComplexityTier(facts);
      expect(initialTier).toBe('foundational');
      
      // Trigger upgrade
      const upgradedFacts = { ...facts, entitiesCount: 3, estimatedLinkedAssetsUSD: 4_000_000 };
      const newTier = computeComplexityTier(upgradedFacts);
      expect(newTier).toBe('advanced');
      
      // Check module orders are different
      const foundationalOrder = getModuleOrder('aspiring', 'foundational');
      const advancedOrder = getModuleOrder('aspiring', 'advanced');
      expect(advancedOrder.length).toBeGreaterThan(foundationalOrder.length);
    });
  });
});