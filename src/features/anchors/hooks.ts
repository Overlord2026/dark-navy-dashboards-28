export async function maybeAnchor(tag: string, hash: string) {
  const on = (import.meta.env.VITE_ANCHORS_ENABLED === 'true');
  if (!on) return;
  
  // TODO: call anchorBatch(hash) when anchor service is available
  console.log(`[Anchor] ${tag}: ${hash.slice(0, 16)}...`);
  
  return { 
    tag, 
    merkle_root: hash, 
    ts: new Date().toISOString() 
  };
}

export async function generateHash(data: Uint8Array | string): Promise<string> {
  const encoder = new TextEncoder();
  const dataArray = typeof data === 'string' ? encoder.encode(data) : data;
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataArray);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');
}