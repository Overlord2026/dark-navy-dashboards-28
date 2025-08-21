import { recordVaultRDS, VaultRDS } from '@/features/healthcare/receipts';

export interface EvidenceDocument {
  id: string;
  type: 'lab_result' | 'clinical_note' | 'imaging' | 'prescription' | 'insurance_claim';
  hash: string;
  category: string;
  created_at: string;
  phi_level: 'high' | 'medium' | 'low';
}

export interface EvidencePack {
  id: string;
  pack_hash: string;
  documents: EvidenceDocument[];
  created_at: string;
  created_by: string;
}

export interface GrantAccess {
  id: string;
  pack_id: string;
  subject: 'provider' | 'cpa' | 'attorney' | 'insurance';
  granted_at: string;
  expires_at?: string;
  status: 'active' | 'revoked' | 'expired';
  pre_key_hash: string; // PRE public key hash for recipient
}

/**
 * Generate a cryptographic hash for document without exposing content
 */
function generateDocumentHash(docId: string, type: string): string {
  // Simulate cryptographic hash generation
  const input = `${docId}:${type}:${Date.now()}`;
  return btoa(input).substring(0, 16);
}

/**
 * Generate pack hash from document hashes (no PHI)
 */
function generatePackHash(docHashes: string[]): string {
  const combined = docHashes.sort().join(':');
  return btoa(combined).substring(0, 20);
}

/**
 * Get mock evidence documents (no PHI in logs)
 */
export function getAvailableDocuments(): EvidenceDocument[] {
  return [
    {
      id: 'doc_001',
      type: 'lab_result',
      hash: generateDocumentHash('doc_001', 'lab_result'),
      category: 'Blood Work',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      phi_level: 'high'
    },
    {
      id: 'doc_002',
      type: 'clinical_note',
      hash: generateDocumentHash('doc_002', 'clinical_note'),
      category: 'Physician Notes',
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      phi_level: 'high'
    },
    {
      id: 'doc_003',
      type: 'imaging',
      hash: generateDocumentHash('doc_003', 'imaging'),
      category: 'X-Ray Results',
      created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      phi_level: 'medium'
    },
    {
      id: 'doc_004',
      type: 'prescription',
      hash: generateDocumentHash('doc_004', 'prescription'),
      category: 'Medication List',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      phi_level: 'medium'
    },
    {
      id: 'doc_005',
      type: 'insurance_claim',
      hash: generateDocumentHash('doc_005', 'insurance_claim'),
      category: 'Insurance Claims',
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      phi_level: 'low'
    }
  ];
}

/**
 * Create evidence pack from selected documents
 */
export function createEvidencePack(docIds: string[], packName?: string): EvidencePack {
  const availableDocs = getAvailableDocuments();
  const selectedDocs = availableDocs.filter(doc => docIds.includes(doc.id));
  
  const docHashes = selectedDocs.map(doc => doc.hash);
  const packHash = generatePackHash(docHashes);
  
  const pack: EvidencePack = {
    id: `pack_${Date.now()}`,
    pack_hash: packHash,
    documents: selectedDocs,
    created_at: new Date().toISOString(),
    created_by: 'current_user'
  };

  // Log pack creation (no PHI)
  console.info('evidence.pack.created', {
    pack_id: pack.id,
    pack_hash: packHash,
    document_count: selectedDocs.length,
    doc_hashes: docHashes,
    categories: selectedDocs.map(d => d.category),
    pack_name: packName || 'Unnamed Pack'
  });

  return pack;
}

/**
 * Grant PRE-based read access to evidence pack
 */
export function grantPre(
  packId: string, 
  subject: 'provider' | 'cpa' | 'attorney' | 'insurance',
  docList: string[], 
  ttlDays: number = 7
): VaultRDS {
  const docHashes = docList.map(docId => {
    const doc = getAvailableDocuments().find(d => d.id === docId);
    return doc ? doc.hash : generateDocumentHash(docId, 'unknown');
  });
  
  const packHash = generatePackHash(docHashes);
  const packDocId = `pack:${packHash}`;
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  
  // Generate PRE key hash (simulated)
  const preKeyHash = btoa(`pre_key:${subject}:${packId}:${Date.now()}`).substring(0, 16);
  
  // Create grant record (no PHI logged)
  const grant: GrantAccess = {
    id: `grant_${Date.now()}`,
    pack_id: packId,
    subject,
    granted_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
    status: 'active',
    pre_key_hash: preKeyHash
  };

  // Log grant creation (no PHI)
  console.info('vault.access.granted', {
    grant_id: grant.id,
    pack_id: packId,
    subject,
    doc_count: docList.length,
    doc_hashes: docHashes,
    expires_at: expiresAt.toISOString(),
    pre_key_hash: preKeyHash
  });

  // Generate anchor reference for cross-chain proof
  const anchorRef = `vault:${packHash}:grant:${grant.id}`;

  // Record Vault-RDS
  return recordVaultRDS(
    'grant',
    packDocId,
    anchorRef
  );
}

/**
 * Revoke PRE-based access to evidence pack
 */
export function revokePre(grantId: string): VaultRDS {
  // In real implementation, would fetch grant from secure storage
  const mockGrant: GrantAccess = {
    id: grantId,
    pack_id: 'pack_example',
    subject: 'provider',
    granted_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    pre_key_hash: 'mock_pre_key_hash'
  };

  // Log revocation (no PHI)
  console.info('vault.access.revoked', {
    grant_id: grantId,
    pack_id: mockGrant.pack_id,
    subject: mockGrant.subject,
    revoked_at: new Date().toISOString(),
    original_grant_time: mockGrant.granted_at
  });

  // Generate anchor reference for revocation proof
  const anchorRef = `vault:revoke:grant:${grantId}`;

  // Record Vault-RDS
  return recordVaultRDS(
    'revoke',
    grantId,
    anchorRef
  );
}

/**
 * Get active grants for a pack (mock implementation)
 */
export function getActiveGrants(packId: string): GrantAccess[] {
  // Mock data - in real implementation, fetch from secure storage
  return [
    {
      id: 'grant_001',
      pack_id: packId,
      subject: 'provider',
      granted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      pre_key_hash: 'pre_abc123'
    },
    {
      id: 'grant_002', 
      pack_id: packId,
      subject: 'cpa',
      granted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      pre_key_hash: 'pre_def456'
    }
  ];
}

/**
 * Verify PRE access is still valid
 */
export function verifyPreAccess(grantId: string): { valid: boolean; reasons: string[] } {
  const grant = getActiveGrants('mock_pack').find(g => g.id === grantId);
  const reasons: string[] = [];
  
  if (!grant) {
    reasons.push('GRANT_NOT_FOUND');
    return { valid: false, reasons };
  }
  
  if (grant.status === 'revoked') {
    reasons.push('ACCESS_REVOKED');
    return { valid: false, reasons };
  }
  
  if (grant.expires_at && new Date(grant.expires_at) < new Date()) {
    reasons.push('ACCESS_EXPIRED');
    return { valid: false, reasons };
  }
  
  reasons.push('ACCESS_VALID');
  return { valid: true, reasons };
}