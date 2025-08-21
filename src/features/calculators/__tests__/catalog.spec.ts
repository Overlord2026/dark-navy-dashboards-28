import { describe, it, expect } from 'vitest';
import { 
  getAvailableCalculators, 
  hasCalculatorAccess, 
  getPricingUrl,
  getCalculatorCounts,
  searchCalculators,
  getCalculatorByKey
} from '../catalog';
import { Persona, ComplexityTier } from '@/features/personalization/types';

describe('calculator catalog', () => {
  describe('getAvailableCalculators', () => {
    it('should return foundational calculators for foundational tier', () => {
      const calculators = getAvailableCalculators('aspiring', 'foundational', 'basic');
      
      // Should include foundational calculators
      expect(calculators.some(c => c.key === 'swag-monte-carlo')).toBe(true);
      expect(calculators.some(c => c.key === 'budget-planner')).toBe(true);
      expect(calculators.some(c => c.key === 'emergency-fund')).toBe(true);
      
      // Should exclude advanced-only calculators
      expect(calculators.some(c => c.key === 'equity-comp-planner')).toBe(false);
      expect(calculators.some(c => c.key === 'charitable-trust')).toBe(false);
    });

    it('should return foundational + advanced calculators for advanced tier', () => {
      const foundational = getAvailableCalculators('aspiring', 'foundational', 'basic');
      const advanced = getAvailableCalculators('aspiring', 'advanced', 'basic');
      
      expect(advanced.length).toBeGreaterThan(foundational.length);
      
      // Should include advanced calculators
      expect(advanced.some(c => c.key === 'equity-comp-planner')).toBe(true);
      expect(advanced.some(c => c.key === 'charitable-trust')).toBe(true);
      expect(advanced.some(c => c.key === 'roth-conversion-ladder')).toBe(true);
    });

    it('should filter by persona correctly', () => {
      const aspiringCalcs = getAvailableCalculators('aspiring', 'foundational', 'basic');
      const retireeCalcs = getAvailableCalculators('retiree', 'foundational', 'basic');
      
      // Aspiring should have emergency fund and debt payoff
      expect(aspiringCalcs.some(c => c.key === 'emergency-fund')).toBe(true);
      expect(aspiringCalcs.some(c => c.key === 'debt-payoff')).toBe(true);
      
      // Retiree should have RMD and SS timing
      expect(retireeCalcs.some(c => c.key === 'rmd-basic')).toBe(true);
      expect(retireeCalcs.some(c => c.key === 'ss-timing-basic')).toBe(true);
      
      // Persona-specific calculators should not cross over
      expect(retireeCalcs.some(c => c.key === 'emergency-fund')).toBe(false);
      expect(aspiringCalcs.some(c => c.key === 'rmd-basic')).toBe(false);
    });

    it('should include general calculators for both personas', () => {
      const aspiringCalcs = getAvailableCalculators('aspiring', 'foundational', 'basic');
      const retireeCalcs = getAvailableCalculators('retiree', 'foundational', 'basic');
      
      // General calculators should appear for both
      expect(aspiringCalcs.some(c => c.key === 'swag-monte-carlo')).toBe(true);
      expect(retireeCalcs.some(c => c.key === 'swag-monte-carlo')).toBe(true);
      expect(aspiringCalcs.some(c => c.key === 'budget-planner')).toBe(true);
      expect(retireeCalcs.some(c => c.key === 'budget-planner')).toBe(true);
    });
  });

  describe('hasCalculatorAccess', () => {
    it('should grant access for basic calculators with basic entitlement', () => {
      expect(hasCalculatorAccess('swag-monte-carlo', 'basic')).toBe(true);
      expect(hasCalculatorAccess('budget-planner', 'basic')).toBe(true);
      expect(hasCalculatorAccess('emergency-fund', 'basic')).toBe(true);
    });

    it('should deny access for premium calculators with basic entitlement', () => {
      expect(hasCalculatorAccess('equity-comp-planner', 'basic')).toBe(false);
      expect(hasCalculatorAccess('charitable-trust', 'basic')).toBe(false);
      expect(hasCalculatorAccess('nua-calculator', 'basic')).toBe(false);
    });

    it('should grant access for premium calculators with premium entitlement', () => {
      expect(hasCalculatorAccess('equity-comp-planner', 'premium')).toBe(true);
      expect(hasCalculatorAccess('charitable-trust', 'premium')).toBe(true);
      expect(hasCalculatorAccess('nua-calculator', 'premium')).toBe(true);
    });

    it('should deny access for elite calculators with premium entitlement', () => {
      expect(hasCalculatorAccess('roth-conversion-ladder', 'premium')).toBe(false);
      expect(hasCalculatorAccess('estate-tax-planning', 'premium')).toBe(false);
    });

    it('should grant access for all calculators with elite entitlement', () => {
      expect(hasCalculatorAccess('swag-monte-carlo', 'elite')).toBe(true);
      expect(hasCalculatorAccess('equity-comp-planner', 'elite')).toBe(true);
      expect(hasCalculatorAccess('roth-conversion-ladder', 'elite')).toBe(true);
      expect(hasCalculatorAccess('estate-tax-planning', 'elite')).toBe(true);
    });
  });

  describe('getPricingUrl', () => {
    it('should generate correct pricing URL with feature parameter', () => {
      expect(getPricingUrl('equity-comp-planner')).toBe('/pricing?feature=equity-comp-planner&tier=premium');
      expect(getPricingUrl('roth-conversion-ladder')).toBe('/pricing?feature=roth-conversion-ladder&tier=elite');
      expect(getPricingUrl('charitable-trust')).toBe('/pricing?feature=charitable-trust&tier=premium');
    });

    it('should handle non-existent calculator keys', () => {
      expect(getPricingUrl('non-existent')).toBe('/pricing?feature=non-existent&tier=premium');
    });
  });

  describe('getCalculatorCounts', () => {
    it('should count calculators correctly for foundational aspiring', () => {
      const counts = getCalculatorCounts('aspiring', 'foundational');
      
      expect(counts.basic).toBeGreaterThan(0);
      expect(counts.premium).toBeGreaterThan(0); // Advanced calcs still counted
      expect(counts.elite).toBeGreaterThan(0);
      expect(counts.total).toBe(counts.basic + counts.premium + counts.elite);
    });

    it('should count calculators correctly for advanced aspiring', () => {
      const foundationalCounts = getCalculatorCounts('aspiring', 'foundational');
      const advancedCounts = getCalculatorCounts('aspiring', 'advanced');
      
      // Advanced tier should show more available calculators
      expect(advancedCounts.available).toBeGreaterThanOrEqual(foundationalCounts.available);
    });

    it('should count persona-specific calculators correctly', () => {
      const aspiringCounts = getCalculatorCounts('aspiring', 'foundational');
      const retireeCounts = getCalculatorCounts('retiree', 'foundational');
      
      // Different personas should have different available counts
      // due to persona-specific calculators
      expect(aspiringCounts.available).not.toBe(retireeCounts.available);
    });
  });

  describe('searchCalculators', () => {
    it('should search by title', () => {
      const results = searchCalculators('Monte Carlo', 'aspiring', 'foundational', 'basic');
      expect(results.some(c => c.key === 'swag-monte-carlo')).toBe(true);
    });

    it('should search by description', () => {
      const results = searchCalculators('budget planning', 'aspiring', 'foundational', 'basic');
      expect(results.some(c => c.key === 'budget-planner')).toBe(true);
    });

    it('should search by tags', () => {
      const results = searchCalculators('retirement', 'retiree', 'foundational', 'basic');
      expect(results.some(c => c.tags.includes('retirement'))).toBe(true);
    });

    it('should return empty array for no matches', () => {
      const results = searchCalculators('nonexistent calculator', 'aspiring', 'foundational', 'basic');
      expect(results).toHaveLength(0);
    });

    it('should respect persona and tier filters in search', () => {
      const results = searchCalculators('equity', 'aspiring', 'foundational', 'basic');
      // Should not find equity comp calculator in foundational tier
      expect(results.some(c => c.key === 'equity-comp-planner')).toBe(false);
      
      const advancedResults = searchCalculators('equity', 'aspiring', 'advanced', 'basic');
      // Should find it in advanced tier
      expect(advancedResults.some(c => c.key === 'equity-comp-planner')).toBe(true);
    });
  });

  describe('getCalculatorByKey', () => {
    it('should find existing calculator', () => {
      const calc = getCalculatorByKey('swag-monte-carlo');
      expect(calc).toBeDefined();
      expect(calc?.title).toBe('SWAG/Monte Carlo');
      expect(calc?.entitlement).toBe('basic');
    });

    it('should return undefined for non-existent calculator', () => {
      const calc = getCalculatorByKey('non-existent');
      expect(calc).toBeUndefined();
    });

    it('should find advanced calculators', () => {
      const calc = getCalculatorByKey('roth-conversion-ladder');
      expect(calc).toBeDefined();
      expect(calc?.entitlement).toBe('elite');
      expect(calc?.advancedOnly).toBe(true);
    });
  });
});