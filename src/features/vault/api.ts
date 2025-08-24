// Mock vault API for storing documents
export async function grantPre(
  grantType: string,
  hashes: string[],
  ttlDays: number
): Promise<{ ref: string; url: string }> {
  // Mock PRE grant creation
  const ref = `pre-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const url = `https://vault.example.com/pre/${ref}`;
  
  // Store grant info (using localStorage for demo)
  const grants = JSON.parse(localStorage.getItem('vault_grants') || '[]');
  grants.push({
    ref,
    grantType,
    hashes,
    ttlDays,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString(),
    url
  });
  localStorage.setItem('vault_grants', JSON.stringify(grants));
  
  return { ref, url };
}

export async function storeInVault(
  content: Uint8Array,
  filename: string,
  keepSafe: boolean = true
): Promise<{ hash: string; ref: string }> {
  // Mock vault storage
  const hash = `sha256:${Math.random().toString(36).substr(2, 16)}`;
  const ref = `vault-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Store file info (using localStorage for demo)
  const files = JSON.parse(localStorage.getItem('vault_files') || '[]');
  files.push({
    hash,
    ref,
    filename,
    keepSafe,
    size: content.length,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem('vault_files', JSON.stringify(files));
  
  return { hash, ref };
}