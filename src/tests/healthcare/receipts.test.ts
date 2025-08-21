import { describe, it, expect, beforeEach } from 'vitest';
import { recordHealthRDS, recordConsentRDS, recordVaultRDS, HealthcareReceiptStore } from '@/features/healthcare/receipts';

describe('Healthcare Receipts', () => {
  let store: HealthcareReceiptStore;

  beforeEach(() => {
    store = new HealthcareReceiptStore();
  });

  describe('recordHealthRDS', () => {
    it('should create a health receipt with correct structure', () => {
      const inputs = { action: 'screening', userId: 'test-123' };
      const result = recordHealthRDS(
        'annual_screening',
        inputs,
        'allow',
        ['POLICY_MATCH', 'CONSENT_VALID']
      );

      expect(result.type).toBe('Health-RDS');
      expect(result.action).toBe('annual_screening');
      expect(result.result).toBe('allow');
      expect(result.reasons).toEqual(['POLICY_MATCH', 'CONSENT_VALID']);
      expect(result.policy_version).toBe('H-2025.08');
      expect(result.inputs_hash).toBeDefined();
      expect(result.ts).toBeDefined();
    });

    it('should sanitize PHI from inputs hash', () => {
      const inputsWithPHI = {
        name: 'John Doe',
        ssn: '123-45-6789',
        email: 'john@example.com',
        action: 'screening'
      };

      const result = recordHealthRDS('test', inputsWithPHI, 'allow', []);
      
      // Hash should not contain PHI
      expect(result.inputs_hash).toBeDefined();
      expect(result.inputs_hash.length).toBe(16);
    });

    it('should include financial data when provided', () => {
      const financial = {
        estimated_cost_cents: 15000,
        coverage_type: 'insurance'
      };

      const result = recordHealthRDS(
        'procedure',
        { action: 'test' },
        'allow',
        ['APPROVED'],
        [],
        financial
      );

      expect(result.financial).toEqual(financial);
    });

    it('should include anchor reference when provided', () => {
      const anchorRef = 'chain:tx:epoch';
      const result = recordHealthRDS(
        'test',
        {},
        'allow',
        [],
        [],
        undefined,
        anchorRef
      );

      expect(result.anchor_ref).toBe(anchorRef);
    });
  });

  describe('recordConsentRDS', () => {
    it('should create a consent receipt with correct structure', () => {
      const scope = ['health_records', 'prescriptions'];
      const purpose = 'treatment';

      const result = recordConsentRDS(scope, purpose, 30);

      expect(result.type).toBe('Consent-RDS');
      expect(result.hipaa_scope).toEqual(scope);
      expect(result.purpose_of_use).toBe(purpose);
      expect(result.freshness_score).toBe(1.0);
      expect(result.consent_time).toBeDefined();
      expect(result.expiry).toBeDefined();
      expect(result.proof_hash).toBeDefined();
    });

    it('should not set expiry when no days provided', () => {
      const result = recordConsentRDS(['health'], 'research');
      expect(result.expiry).toBeUndefined();
    });

    it('should calculate correct expiry date', () => {
      const days = 7;
      const result = recordConsentRDS(['health'], 'treatment', days);
      
      const consentTime = new Date(result.consent_time);
      const expiryTime = new Date(result.expiry!);
      const diffDays = Math.round((expiryTime.getTime() - consentTime.getTime()) / (1000 * 60 * 60 * 24));
      
      expect(diffDays).toBe(days);
    });
  });

  describe('recordVaultRDS', () => {
    it('should create a vault receipt with correct structure', () => {
      const result = recordVaultRDS('grant', 'doc-123', 'anchor-ref');

      expect(result.type).toBe('Vault-RDS');
      expect(result.action).toBe('grant');
      expect(result.doc_id).toBe('doc-123');
      expect(result.anchor_ref).toBe('anchor-ref');
      expect(result.inputs_hash).toBeDefined();
      expect(result.policy_version).toBe('H-2025.08');
    });

    it('should work without optional parameters', () => {
      const result = recordVaultRDS('revoke');

      expect(result.action).toBe('revoke');
      expect(result.doc_id).toBeUndefined();
      expect(result.anchor_ref).toBeUndefined();
    });
  });

  describe('HealthcareReceiptStore', () => {
    it('should store and retrieve receipts', () => {
      const receipt = recordHealthRDS('test', {}, 'allow', []);
      store.store(receipt);

      const healthReceipts = store.getByType('Health-RDS');
      expect(healthReceipts).toHaveLength(1);
      expect(healthReceipts[0]).toEqual(receipt);
    });

    it('should filter receipts by type', () => {
      const healthReceipt = recordHealthRDS('test', {}, 'allow', []);
      const consentReceipt = recordConsentRDS(['health'], 'treatment');
      const vaultReceipt = recordVaultRDS('grant');

      store.store(healthReceipt);
      store.store(consentReceipt);
      store.store(vaultReceipt);

      expect(store.getByType('Health-RDS')).toHaveLength(1);
      expect(store.getByType('Consent-RDS')).toHaveLength(1);
      expect(store.getByType('Vault-RDS')).toHaveLength(1);
    });

    it('should return recent receipts in chronological order', () => {
      // Create receipts with slight delays to ensure different timestamps
      const receipt1 = recordHealthRDS('test1', {}, 'allow', []);
      store.store(receipt1);

      // Small delay
      const receipt2 = recordHealthRDS('test2', {}, 'deny', []);
      receipt2.ts = new Date(Date.now() + 1000).toISOString();
      store.store(receipt2);

      const recent = store.getRecent(2);
      expect(recent).toHaveLength(2);
      expect(recent[0]).toEqual(receipt2); // Most recent first
      expect(recent[1]).toEqual(receipt1);
    });

    it('should limit recent receipts count', () => {
      // Store 15 receipts
      for (let i = 0; i < 15; i++) {
        const receipt = recordHealthRDS(`test${i}`, {}, 'allow', []);
        store.store(receipt);
      }

      const recent = store.getRecent(5);
      expect(recent).toHaveLength(5);
    });
  });
});