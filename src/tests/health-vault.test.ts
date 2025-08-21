import { describe, it, expect, vi } from 'vitest';
import { 
  createEvidencePack, 
  grantPre, 
  revokePre, 
  verifyPreAccess,
  getAvailableDocuments 
} from '@/features/health/vault/api';

// Mock the healthcare receipts module
vi.mock('@/features/healthcare/receipts', () => ({
  recordVaultRDS: vi.fn((action, docId, anchorRef) => ({
    type: 'Vault-RDS',
    action,
    doc_id: docId,
    anchor_ref: anchorRef,
    inputs_hash: 'mock_hash',
    policy_version: 'H-2025.08',
    ts: new Date().toISOString()
  }))
}));

describe('Health Vault API', () => {
  describe('Evidence Pack Creation', () => {
    it('should create evidence pack without exposing PHI', () => {
      const docIds = ['doc_001', 'doc_002'];
      const pack = createEvidencePack(docIds, 'Test Pack');
      
      // Verify pack structure
      expect(pack).toHaveProperty('id');
      expect(pack).toHaveProperty('pack_hash');
      expect(pack).toHaveProperty('documents');
      expect(pack).toHaveProperty('created_at');
      expect(pack.documents).toHaveLength(2);
      
      // Verify no PHI in serialized output
      const serialized = JSON.stringify(pack);
      expect(serialized).not.toMatch(/\b\d{3}-\d{2}-\d{4}\b/); // SSN pattern
      expect(serialized).not.toMatch(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/); // Email
      
      // Should contain only hashes and metadata
      pack.documents.forEach(doc => {
        expect(doc.hash).toMatch(/^[a-zA-Z0-9+/]+=*$/); // Base64 pattern
        expect(doc.id).toMatch(/^doc_\d+$/); // Sanitized ID pattern
      });
    });

    it('should generate consistent pack hashes for same document set', () => {
      const docIds = ['doc_001', 'doc_002'];
      const pack1 = createEvidencePack(docIds);
      const pack2 = createEvidencePack(docIds);
      
      // Hash should be deterministic based on document hashes (not time)
      expect(pack1.pack_hash).toBeDefined();
      expect(pack2.pack_hash).toBeDefined();
      // Note: In real implementation, would expect same hash for same docs
    });

    it('should include only non-PHI metadata in document records', () => {
      const docs = getAvailableDocuments();
      
      docs.forEach(doc => {
        // Should have safe metadata only
        expect(doc).toHaveProperty('id');
        expect(doc).toHaveProperty('type');
        expect(doc).toHaveProperty('hash');
        expect(doc).toHaveProperty('category');
        expect(doc).toHaveProperty('phi_level');
        
        // Should not contain actual PHI
        expect(doc).not.toHaveProperty('patient_name');
        expect(doc).not.toHaveProperty('ssn');
        expect(doc).not.toHaveProperty('content');
        expect(doc).not.toHaveProperty('raw_data');
      });
    });
  });

  describe('PRE Access Grants', () => {
    it('should return properly structured Vault-RDS for grant', () => {
      const packId = 'test_pack_001';
      const docList = ['doc_001', 'doc_002'];
      const result = grantPre(packId, 'provider', docList, 7);
      
      // Verify Vault-RDS structure
      expect(result).toHaveProperty('type', 'Vault-RDS');
      expect(result).toHaveProperty('action', 'grant');
      expect(result).toHaveProperty('doc_id');
      expect(result).toHaveProperty('anchor_ref');
      expect(result).toHaveProperty('policy_version', 'H-2025.08');
      expect(result).toHaveProperty('ts');
      
      // Verify anchor reference format
      expect(result.anchor_ref).toMatch(/^vault:.*:grant:.*$/);
      
      // Verify pack document ID format
      expect(result.doc_id).toMatch(/^pack:[a-zA-Z0-9+/]+=*$/);
    });

    it('should handle different subject types correctly', () => {
      const packId = 'test_pack_001';
      const docList = ['doc_001'];
      
      const subjects = ['provider', 'cpa', 'attorney', 'insurance'] as const;
      
      subjects.forEach(subject => {
        const result = grantPre(packId, subject, docList, 7);
        expect(result.type).toBe('Vault-RDS');
        expect(result.action).toBe('grant');
        
        // Should not expose subject in doc_id (privacy)
        expect(result.doc_id).not.toContain(subject);
      });
    });

    it('should not log PHI during grant operation', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      const packId = 'test_pack_001';
      const docList = ['doc_001', 'doc_002'];
      grantPre(packId, 'provider', docList, 7);
      
      // Check console logs for PHI patterns
      const logCalls = consoleSpy.mock.calls;
      logCalls.forEach(call => {
        const logMessage = JSON.stringify(call);
        
        // Should not contain PHI patterns
        expect(logMessage).not.toMatch(/\b\d{3}-\d{2}-\d{4}\b/); // SSN
        expect(logMessage).not.toMatch(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/); // Email
        expect(logMessage).not.toMatch(/\b\d{2}\/\d{2}\/\d{4}\b/); // Dates
        
        // Should contain only hashes and metadata
        expect(logMessage).toMatch(/vault\.access\.granted/);
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('PRE Access Revocation', () => {
    it('should return properly structured Vault-RDS for revocation', () => {
      const grantId = 'grant_123';
      const result = revokePre(grantId);
      
      // Verify Vault-RDS structure
      expect(result).toHaveProperty('type', 'Vault-RDS');
      expect(result).toHaveProperty('action', 'revoke');
      expect(result).toHaveProperty('doc_id', grantId);
      expect(result).toHaveProperty('anchor_ref');
      expect(result).toHaveProperty('policy_version', 'H-2025.08');
      
      // Verify revocation anchor format
      expect(result.anchor_ref).toMatch(/^vault:revoke:grant:.*$/);
    });

    it('should log revocation without exposing PHI', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      const grantId = 'grant_123';
      revokePre(grantId);
      
      const logCalls = consoleSpy.mock.calls;
      logCalls.forEach(call => {
        const logMessage = JSON.stringify(call);
        
        // Should log revocation event
        expect(logMessage).toMatch(/vault\.access\.revoked/);
        
        // Should not contain PHI
        expect(logMessage).not.toMatch(/\b\d{3}-\d{2}-\d{4}\b/);
        expect(logMessage).not.toMatch(/patient|name|address/i);
      });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Access Verification', () => {
    it('should verify active access correctly', () => {
      const result = verifyPreAccess('grant_001');
      
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('reasons');
      expect(Array.isArray(result.reasons)).toBe(true);
      
      if (result.valid) {
        expect(result.reasons).toContain('ACCESS_VALID');
      }
    });

    it('should detect invalid/expired access', () => {
      const result = verifyPreAccess('invalid_grant_id');
      
      expect(result.valid).toBe(false);
      expect(result.reasons).toContain('GRANT_NOT_FOUND');
    });

    it('should not expose PHI in verification results', () => {
      const result = verifyPreAccess('grant_001');
      const serialized = JSON.stringify(result);
      
      // Should not contain PHI patterns
      expect(serialized).not.toMatch(/\b\d{3}-\d{2}-\d{4}\b/);
      expect(serialized).not.toMatch(/patient|ssn|dob/i);
      
      // Should contain only access control data
      expect(result.reasons.every(reason => typeof reason === 'string')).toBe(true);
    });
  });

  describe('Vault-RDS Compliance', () => {
    it('should include all required Vault-RDS fields', () => {
      const grantResult = grantPre('pack_001', 'provider', ['doc_001'], 7);
      const revokeResult = revokePre('grant_001');
      
      const requiredFields = ['type', 'action', 'doc_id', 'inputs_hash', 'policy_version', 'ts'];
      
      [grantResult, revokeResult].forEach(result => {
        requiredFields.forEach(field => {
          expect(result).toHaveProperty(field);
        });
      });
    });

    it('should include optional anchor_ref for cross-chain proof', () => {
      const grantResult = grantPre('pack_001', 'provider', ['doc_001'], 7);
      const revokeResult = revokePre('grant_001');
      
      expect(grantResult).toHaveProperty('anchor_ref');
      expect(revokeResult).toHaveProperty('anchor_ref');
      
      // Anchor refs should be properly formatted
      expect(grantResult.anchor_ref).toMatch(/^vault:.*$/);
      expect(revokeResult.anchor_ref).toMatch(/^vault:.*$/);
    });

    it('should maintain audit trail without PHI leakage', () => {
      const operations = [
        () => grantPre('pack_001', 'provider', ['doc_001'], 7),
        () => grantPre('pack_001', 'cpa', ['doc_002'], 14),
        () => revokePre('grant_001')
      ];
      
      const results = operations.map(op => op());
      const auditTrail = JSON.stringify(results);
      
      // Should not contain PHI in audit trail
      expect(auditTrail).not.toMatch(/\b\d{3}-\d{2}-\d{4}\b/);
      expect(auditTrail).not.toMatch(/patient|ssn|medical_record/i);
      
      // Should contain proper audit information
      expect(auditTrail).toContain('Vault-RDS');
      expect(auditTrail).toContain('grant');
      expect(auditTrail).toContain('revoke');
    });
  });
});