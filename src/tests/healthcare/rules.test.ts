import { describe, it, expect } from 'vitest';

// Mock rules for testing
const mockRules = {
  'annual_screening': {
    policy_version: 'H-2025.08',
    conditions: [
      { field: 'age', operator: '>=', value: 18 },
      { field: 'last_screening', operator: 'older_than', value: '1_year' }
    ],
    result: 'allow',
    reasons: ['ELIGIBLE_FOR_ANNUAL_SCREENING']
  },
  'emergency_access': {
    policy_version: 'H-2025.08',
    conditions: [
      { field: 'emergency', operator: '===', value: true }
    ],
    result: 'allow',
    reasons: ['EMERGENCY_OVERRIDE']
  },
  'restricted_procedure': {
    policy_version: 'H-2025.08',
    conditions: [
      { field: 'authorization', operator: '===', value: 'required' },
      { field: 'prior_auth', operator: '===', value: false }
    ],
    result: 'deny',
    reasons: ['PRIOR_AUTHORIZATION_REQUIRED']
  }
};

// Simple rule engine for testing
class TestRuleEngine {
  evaluateRule(ruleName: string, inputs: Record<string, any>) {
    const rule = mockRules[ruleName as keyof typeof mockRules];
    if (!rule) {
      return {
        result: 'deny',
        reasons: ['RULE_NOT_FOUND'],
        policy_version: 'H-2025.08'
      };
    }

    const allConditionsMet = rule.conditions.every(condition => {
      const value = inputs[condition.field];
      
      switch (condition.operator) {
        case '===':
          return value === condition.value;
        case '>=':
          return typeof value === 'number' && typeof condition.value === 'number' && value >= condition.value;
        case 'older_than':
          if (condition.value === '1_year' && value) {
            const lastDate = new Date(value);
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            return lastDate < oneYearAgo;
          }
          return false;
        default:
          return false;
      }
    });

    return {
      result: allConditionsMet ? rule.result : 'deny',
      reasons: allConditionsMet ? rule.reasons : ['CONDITIONS_NOT_MET'],
      policy_version: rule.policy_version
    };
  }
}

describe('Healthcare Rules Engine', () => {
  const engine = new TestRuleEngine();

  describe('annual_screening rule', () => {
    it('should allow screening for eligible patient', () => {
      const inputs = {
        age: 25,
        last_screening: '2023-01-01' // More than a year ago
      };

      const result = engine.evaluateRule('annual_screening', inputs);

      expect(result.result).toBe('allow');
      expect(result.reasons).toContain('ELIGIBLE_FOR_ANNUAL_SCREENING');
      expect(result.policy_version).toBe('H-2025.08');
    });

    it('should deny screening for underage patient', () => {
      const inputs = {
        age: 16,
        last_screening: '2023-01-01'
      };

      const result = engine.evaluateRule('annual_screening', inputs);

      expect(result.result).toBe('deny');
      expect(result.reasons).toContain('CONDITIONS_NOT_MET');
    });

    it('should deny screening if recent screening exists', () => {
      const inputs = {
        age: 25,
        last_screening: new Date().toISOString() // Recent screening
      };

      const result = engine.evaluateRule('annual_screening', inputs);

      expect(result.result).toBe('deny');
      expect(result.reasons).toContain('CONDITIONS_NOT_MET');
    });
  });

  describe('emergency_access rule', () => {
    it('should allow emergency access', () => {
      const inputs = {
        emergency: true
      };

      const result = engine.evaluateRule('emergency_access', inputs);

      expect(result.result).toBe('allow');
      expect(result.reasons).toContain('EMERGENCY_OVERRIDE');
    });

    it('should deny non-emergency access', () => {
      const inputs = {
        emergency: false
      };

      const result = engine.evaluateRule('emergency_access', inputs);

      expect(result.result).toBe('deny');
      expect(result.reasons).toContain('CONDITIONS_NOT_MET');
    });
  });

  describe('restricted_procedure rule', () => {
    it('should deny procedure without prior authorization', () => {
      const inputs = {
        authorization: 'required',
        prior_auth: false
      };

      const result = engine.evaluateRule('restricted_procedure', inputs);

      expect(result.result).toBe('deny');
      expect(result.reasons).toContain('PRIOR_AUTHORIZATION_REQUIRED');
    });

    it('should handle missing rule', () => {
      const result = engine.evaluateRule('nonexistent_rule', {});

      expect(result.result).toBe('deny');
      expect(result.reasons).toContain('RULE_NOT_FOUND');
    });
  });

  describe('rule evaluation edge cases', () => {
    it('should handle undefined values gracefully', () => {
      const inputs = {
        age: undefined,
        last_screening: undefined
      };

      const result = engine.evaluateRule('annual_screening', inputs);

      expect(result.result).toBe('deny');
      expect(result.reasons).toContain('CONDITIONS_NOT_MET');
    });

    it('should handle null values', () => {
      const inputs = {
        emergency: null
      };

      const result = engine.evaluateRule('emergency_access', inputs);

      expect(result.result).toBe('deny');
    });

    it('should handle wrong data types', () => {
      const inputs = {
        age: 'twenty-five', // String instead of number
        last_screening: '2023-01-01'
      };

      const result = engine.evaluateRule('annual_screening', inputs);

      expect(result.result).toBe('deny');
      expect(result.reasons).toContain('CONDITIONS_NOT_MET');
    });
  });
});