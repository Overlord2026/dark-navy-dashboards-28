interface VaultGrant {
  resource_id: string;
  granted_at: string;
  expires_at: string;
  access_type: 'read' | 'write' | 'admin';
  grant_hash: string;
}

const VAULT_STORAGE_KEY = 'vault_grants';

export async function grantVaultAccess(resourceIds: string[], durationDays = 90): Promise<string[]> {
  const grants: VaultGrant[] = [];
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (durationDays * 24 * 60 * 60 * 1000));
  
  for (const resourceId of resourceIds) {
    const grant: VaultGrant = {
      resource_id: resourceId,
      granted_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      access_type: 'read',
      grant_hash: generateGrantHash(resourceId, now.toISOString())
    };
    
    grants.push(grant);
  }
  
  storeVaultGrants(grants);
  
  console.log(`[VaultManager] Granted access to ${grants.length} resources`, grants);
  
  return grants.map(g => g.grant_hash);
}

export function checkVaultAccess(resourceId: string): boolean {
  try {
    const stored = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!stored) return false;
    
    const grants: VaultGrant[] = JSON.parse(stored);
    const grant = grants.find(g => g.resource_id === resourceId);
    
    if (!grant) return false;
    
    // Check if grant is still valid
    return new Date(grant.expires_at) > new Date();
  } catch {
    return false;
  }
}

export function getVaultGrants(): VaultGrant[] {
  try {
    const stored = localStorage.getItem(VAULT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function revokeVaultAccess(resourceId: string): boolean {
  try {
    const grants = getVaultGrants();
    const filtered = grants.filter(g => g.resource_id !== resourceId);
    
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function cleanupExpiredGrants(): number {
  try {
    const grants = getVaultGrants();
    const now = new Date();
    const valid = grants.filter(g => new Date(g.expires_at) > now);
    
    const removedCount = grants.length - valid.length;
    
    if (removedCount > 0) {
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(valid));
      console.log(`[VaultManager] Cleaned up ${removedCount} expired grants`);
    }
    
    return removedCount;
  } catch {
    return 0;
  }
}

export function getVaultMetrics() {
  const grants = getVaultGrants();
  const now = new Date();
  
  return {
    total_grants: grants.length,
    active_grants: grants.filter(g => new Date(g.expires_at) > now).length,
    expired_grants: grants.filter(g => new Date(g.expires_at) <= now).length,
    resources_protected: new Set(grants.map(g => g.resource_id)).size
  };
}

function generateGrantHash(resourceId: string, timestamp: string): string {
  return btoa(`${resourceId}:${timestamp}:${Math.random()}`).slice(0, 24);
}

function storeVaultGrants(newGrants: VaultGrant[]) {
  try {
    const existing = getVaultGrants();
    const combined = [...existing, ...newGrants];
    
    // Keep only last 1000 grants to prevent storage bloat
    const trimmed = combined.slice(0, 1000);
    
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to store vault grants:', error);
  }
}

// PRE (Privacy-Respecting Evidence) vault utilities
export function createPREVault(evidenceHashes: string[]): string {
  const vaultId = `pre_vault_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const vaultManifest = {
    vault_id: vaultId,
    evidence_hashes: evidenceHashes,
    created_at: new Date().toISOString(),
    access_policy: 'secure_hash_verification',
    retention_policy: '7_years'
  };
  
  const manifestHash = generateGrantHash(JSON.stringify(vaultManifest), vaultManifest.created_at);
  
  console.log(`[PRE Vault] Created vault ${vaultId} with ${evidenceHashes.length} evidence hashes`);
  
  return manifestHash;
}
