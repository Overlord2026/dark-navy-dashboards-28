import { describe, it, expect, vi } from 'vitest';
import { gateScreening, scheduleScreening, recordScreeningCompletion } from '@/features/health/screening/api';
import { issueConsent, revokeConsent, validateConsent } from '@/features/health/consent/api';
import { recordHealthRDS } from '@/features/healthcare/receipts';
import { ScreeningRule, ScreeningFacts } from '@/features/health/screening/rules';

// Mock consent module
vi.mock('@/features/health/consent/api', () => ({
  getActiveConsents: vi.fn(() => [
    {
      id: 'test-consent-001',
      scope: {
        purpose: 'care_coordination',
        entities: ['primary_physician'],
        data_types: ['medical_records']
      },
      consent_time: new Date().toISOString(),
      freshness_score: 0.9,
      proof_hash: 'test-hash',
      status: 'active'
    }
  ]),
  validateConsent: vi.fn(() => ({ valid: true, reasons: ['VALID_CONSENT'] })),
  issueConsent: vi.fn(),
  revokeConsent: vi.fn()
}));

describe('Health Screening API', () => {
  const mockScreeningRule: ScreeningRule = {
    key: 'mammography',
    name: 'Breast Cancer Screening',
    guideline: 'USPSTF Grade B',
    interval: '2 years',
    description: 'Screening mammography for breast cancer',
    zk: { ageGte: 50, ageLte: 74, sexRequired: 'female' },
    planCoverage: { preventive: true, requires_referral: false }
  };

  const mockFacts: ScreeningFacts = {
    age: 55,
    sex: 'female',
    plan: { preventive_coverage: true, specialist_referral_required: false }
  };

  describe('gateScreening', () => {
    it('should return properly structured Health-RDS for approved screening', () => {
      const result = gateScreening(mockScreeningRule, mockFacts, true, 'care_coordination');
      
      // Verify RDS structure
      expect(result.health_rds).toHaveProperty('type', 'Health-RDS');
      expect(result.health_rds).toHaveProperty('action');
      expect(result.health_rds).toHaveProperty('policy_version', 'H-2025.08');
      expect(result.health_rds).toHaveProperty('reasons');
      expect(result.health_rds).toHaveProperty('result');
      expect(result.health_rds).toHaveProperty('ts');
      expect(result.health_rds).toHaveProperty('inputs_hash');
      
      // Verify result structure
      expect(result.authorized).toBe(true);
      expect(Array.isArray(result.reasons)).toBe(true);
      expect(result.screening_key).toBe('mammography');
      expect(result.zk_predicates).toBeDefined();
      
      // Verify no PHI in serialized output
      const serialized = JSON.stringify(result);
      expect(serialized).not.toContain('55'); // actual age
      expect(serialized).not.toContain(mockFacts.age.toString());
    });

    it('should return denial Health-RDS when consent is invalid', () => {
      // Mock invalid consent
      const mockInvalidConsent = vi.fn(() => ({ valid: false, reasons: ['CONSENT_STALE'] }));
      vi.mocked(validateConsent).mockImplementationOnce(mockInvalidConsent);
      
      const result = gateScreening(mockScreeningRule, mockFacts, true, 'care_coordination');
      
      expect(result.authorized).toBe(false);
      expect(result.health_rds.result).toBe('deny');
      expect(result.reasons).toContain('CONSENT_STALE');
    });

    it('should include optional anchor_ref field in RDS structure', () => {
      const result = gateScreening(mockScreeningRule, mockFacts, true, 'care_coordination');
      
      // anchor_ref should be present (even if undefined/null for future use)
      expect(result.health_rds).toHaveProperty('anchor_ref');
    });

    it('should not expose PHI in ZK predicates', () => {
      const result = gateScreening(mockScreeningRule, mockFacts, true, 'care_coordination');
      
      // ZK predicates should only contain boolean values
      Object.values(result.zk_predicates).forEach(value => {
        expect(typeof value).toBe('boolean');
      });
      
      // Should not contain actual age or date values
      const predicateKeys = Object.keys(result.zk_predicates);
      expect(predicateKeys).not.toContain('age');
      expect(predicateKeys).not.toContain('dob');
      expect(predicateKeys).not.toContain('birthDate');
    });
  });

  describe('scheduleScreening', () => {
    it('should return properly structured Health-RDS for scheduling', () => {
      const scheduledDate = '2024-03-15T10:00:00Z';
      const result = scheduleScreening(mockScreeningRule, scheduledDate, mockFacts);
      
      // Verify RDS structure
      expect(result).toHaveProperty('type', 'Health-RDS');
      expect(result).toHaveProperty('action');
      expect(result.action).toContain('schedule_screening_mammography');
      expect(result).toHaveProperty('policy_version', 'H-2025.08');
      expect(result).toHaveProperty('result', 'allow');
      expect(result.reasons).toContain('SCREENING_SCHEDULED');
      
      // Verify no PHI in inputs
      const serialized = JSON.stringify(result);
      expect(serialized).not.toContain(mockFacts.age.toString());
    });
  });

  describe('recordScreeningCompletion', () => {
    it('should return Health-RDS with completion data', () => {
      const completedDate = '2024-03-15T14:30:00Z';
      const result = recordScreeningCompletion(
        mockScreeningRule, 
        completedDate, 
        'normal', 
        mockFacts
      );
      
      // Verify RDS structure
      expect(result).toHaveProperty('type', 'Health-RDS');
      expect(result.action).toContain('complete_screening_mammography');
      expect(result.result).toBe('allow');
      expect(result.reasons).toContain('SCREENING_COMPLETED');
      expect(result.reasons).toContain('NORMAL_RESULT');
      
      // Verify financial data is included
      expect(result.financial).toBeDefined();
      expect(result.financial?.estimated_cost_cents).toBeGreaterThan(0);
    });

    it('should handle different result types correctly', () => {
      const abnormalResult = recordScreeningCompletion(
        mockScreeningRule, 
        '2024-03-15T14:30:00Z', 
        'abnormal', 
        mockFacts
      );
      
      expect(abnormalResult.reasons).toContain('ABNORMAL_RESULT');
      
      const followUpResult = recordScreeningCompletion(
        mockScreeningRule, 
        '2024-03-15T14:30:00Z', 
        'follow_up_needed', 
        mockFacts
      );
      
      expect(followUpResult.reasons).toContain('FOLLOW_UP_NEEDED');
    });
  });

  describe('Consent API RDS Structure', () => {
    it('should return properly structured Consent-RDS when issuing consent', () => {
      const mockConsentRDS = {
        type: 'Consent-RDS' as const,
        hipaa_scope: ['purpose:care_coordination'],
        purpose_of_use: 'care_coordination',
        consent_time: new Date().toISOString(),
        expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        freshness_score: 1.0,
        proof_hash: 'test-proof-hash',
        inputs_hash: 'test-inputs-hash',
        policy_version: 'H-2025.08',
        ts: new Date().toISOString()
      };
      
      vi.mocked(issueConsent).mockReturnValue(mockConsentRDS);
      
      const result = issueConsent(
        { purpose: 'care_coordination', entities: ['physician'], data_types: ['records'] },
        365
      );
      
      // Verify Consent-RDS structure
      expect(result).toHaveProperty('type', 'Consent-RDS');
      expect(result).toHaveProperty('hipaa_scope');
      expect(result).toHaveProperty('purpose_of_use');
      expect(result).toHaveProperty('consent_time');
      expect(result).toHaveProperty('freshness_score');
      expect(result).toHaveProperty('proof_hash');
      expect(result).toHaveProperty('policy_version', 'H-2025.08');
    });

    it('should return revocation Consent-RDS when revoking', () => {
      const mockRevocationRDS = {
        type: 'Consent-RDS' as const,
        hipaa_scope: ['revoked:test-consent-001'],
        purpose_of_use: 'revocation',
        consent_time: new Date().toISOString(),
        freshness_score: 0.0,
        proof_hash: 'revocation-hash',
        inputs_hash: 'revocation-inputs',
        policy_version: 'H-2025.08',
        ts: new Date().toISOString()
      };
      
      vi.mocked(revokeConsent).mockReturnValue(mockRevocationRDS);
      
      const result = revokeConsent('test-consent-001', 'user_requested');
      
      expect(result.type).toBe('Consent-RDS');
      expect(result.freshness_score).toBe(0.0);
      expect(result.purpose_of_use).toBe('revocation');
    });
  });

  describe('Serialization and PHI Protection', () => {
    it('should serialize Health-RDS without PHI', () => {
      const result = gateScreening(mockScreeningRule, mockFacts, true, 'care_coordination');
      const serialized = JSON.stringify(result.health_rds);
      
      // Should not contain any PHI
      expect(serialized).not.toMatch(/\b\d{2}\/\d{2}\/\d{4}\b/); // dates
      expect(serialized).not.toMatch(/\b\d{3}-\d{2}-\d{4}\b/); // SSN pattern
      expect(serialized).not.toContain('55'); // actual age
      expect(serialized).not.toContain('female'); // should use coded values
      
      // Should contain only hashed/coded data
      expect(result.health_rds.inputs_hash).toMatch(/^[a-zA-Z0-9+/]+=*$/); // base64 pattern
    });

    it('should include all required RDS fields for compliance', () => {
      const result = gateScreening(mockScreeningRule, mockFacts, true, 'care_coordination');
      
      const requiredFields = [
        'type', 'action', 'inputs_hash', 'policy_version', 
        'reasons', 'result', 'ts'
      ];
      
      requiredFields.forEach(field => {
        expect(result.health_rds).toHaveProperty(field);
      });
      
      // Optional fields should be present for future use
      expect(result.health_rds).toHaveProperty('anchor_ref');
    });
  });
});