import { describe, it, expect } from 'vitest';
import { getScreenings, generateZKPredicates, isScreeningCovered, ScreeningFacts } from '@/features/health/screening/rules';

describe('Health Screening Rules', () => {
  const mockFacts: ScreeningFacts = {
    age: 52,
    sex: 'female',
    plan: {
      preventive_coverage: true,
      specialist_referral_required: false
    }
  };

  describe('getScreenings', () => {
    it('should return age-appropriate screenings for 52-year-old female', () => {
      const screenings = getScreenings(mockFacts);
      
      // Should include screenings for age 52
      const screeningKeys = screenings.map(s => s.key);
      expect(screeningKeys).toContain('colorectal'); // age 45+
      expect(screeningKeys).toContain('mammography'); // age 50+, female
      expect(screeningKeys).toContain('cervical'); // age 21-65, female
      expect(screeningKeys).toContain('cholesterol'); // age 40+
      expect(screeningKeys).toContain('diabetes'); // age 35+
      
      // Should not include male-only screenings
      expect(screeningKeys).not.toContain('prostate_psa');
    });

    it('should respect age thresholds correctly', () => {
      const youngFacts: ScreeningFacts = { ...mockFacts, age: 30 };
      const youngScreenings = getScreenings(youngFacts);
      const youngKeys = youngScreenings.map(s => s.key);
      
      // Should not include age-restricted screenings
      expect(youngKeys).not.toContain('colorectal'); // requires 45+
      expect(youngKeys).not.toContain('mammography'); // requires 50+
      
      // Should include age-appropriate screenings
      expect(youngKeys).toContain('cervical'); // 21-65
    });

    it('should respect sex-specific screenings', () => {
      const maleFacts: ScreeningFacts = { ...mockFacts, sex: 'male', age: 60 };
      const maleScreenings = getScreenings(maleFacts);
      const maleKeys = maleScreenings.map(s => s.key);
      
      // Should include male-eligible screenings
      expect(maleKeys).toContain('prostate_psa'); // male, 55-69
      expect(maleKeys).toContain('colorectal'); // age 60
      
      // Should not include female-only screenings
      expect(maleKeys).not.toContain('mammography');
      expect(maleKeys).not.toContain('cervical');
      expect(maleKeys).not.toContain('bone_density');
    });

    it('should handle upper age limits correctly', () => {
      const elderlyFacts: ScreeningFacts = { ...mockFacts, age: 80 };
      const elderlyScreenings = getScreenings(elderlyFacts);
      const elderlyKeys = elderlyScreenings.map(s => s.key);
      
      // Should not include age-limited screenings
      expect(elderlyKeys).not.toContain('colorectal'); // max 75
      expect(elderlyKeys).not.toContain('mammography'); // max 74
      expect(elderlyKeys).not.toContain('diabetes'); // max 70
    });
  });

  describe('generateZKPredicates', () => {
    it('should generate correct boolean predicates without exposing actual age', () => {
      const predicates = generateZKPredicates(52);
      
      // Should have correct boolean values for age 52
      expect(predicates.ageGte45).toBe(true);
      expect(predicates.ageGte50).toBe(true);
      expect(predicates.ageGte65).toBe(false);
      expect(predicates.ageLte74).toBe(true);
      expect(predicates.ageLte40).toBe(false);
      
      // Should not contain actual age or date information
      expect(Object.values(predicates)).toEqual(
        expect.arrayContaining([expect.any(Boolean)])
      );
      expect(Object.keys(predicates)).not.toContain('age');
      expect(Object.keys(predicates)).not.toContain('dob');
    });

    it('should generate different predicates for different ages', () => {
      const young = generateZKPredicates(25);
      const middle = generateZKPredicates(55);
      const old = generateZKPredicates(70);
      
      expect(young.ageGte65).toBe(false);
      expect(middle.ageGte65).toBe(false);
      expect(old.ageGte65).toBe(true);
      
      expect(young.ageGte35).toBe(false);
      expect(middle.ageGte35).toBe(true);
      expect(old.ageGte35).toBe(true);
    });
  });

  describe('isScreeningCovered', () => {
    it('should return true for preventive screening with coverage', () => {
      const mammographyRule = getScreenings(mockFacts).find(s => s.key === 'mammography')!;
      const covered = isScreeningCovered(mammographyRule, mockFacts);
      
      expect(covered).toBe(true);
    });

    it('should return false when preventive coverage is not available', () => {
      const noCoverageFacts: ScreeningFacts = {
        ...mockFacts,
        plan: { ...mockFacts.plan, preventive_coverage: false }
      };
      
      const mammographyRule = getScreenings(mockFacts).find(s => s.key === 'mammography')!;
      const covered = isScreeningCovered(mammographyRule, noCoverageFacts);
      
      expect(covered).toBe(false);
    });

    it('should handle referral requirements correctly', () => {
      const lungCancerRule = getScreenings(mockFacts).find(s => s.key === 'lung_cancer')!;
      
      // Should be covered even with referral requirement if plan allows
      const covered = isScreeningCovered(lungCancerRule, mockFacts);
      expect(covered).toBe(true);
    });
  });

  describe('PHI Protection', () => {
    it('should not expose actual age in any screening rule outputs', () => {
      const screenings = getScreenings(mockFacts);
      const serialized = JSON.stringify(screenings);
      
      // Should not contain actual age values
      expect(serialized).not.toContain('52');
      expect(serialized).not.toContain(mockFacts.age.toString());
    });

    it('should only expose boolean predicates in ZK proof', () => {
      const predicates = generateZKPredicates(52);
      const values = Object.values(predicates);
      
      // All values should be boolean
      values.forEach(value => {
        expect(typeof value).toBe('boolean');
      });
      
      // Should not contain numeric age
      expect(values).not.toContain(52);
      expect(values).not.toContain('52');
    });
  });
});