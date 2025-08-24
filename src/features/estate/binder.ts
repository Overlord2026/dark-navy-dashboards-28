import type { BinderManifest } from './types';

export async function buildBinderPack(args: {
  clientId: string;
  start?: string;
  end?: string;
}): Promise<{ zip: Uint8Array; manifest: BinderManifest }> {
  // Collect receipts subset + vault index
  const receipts = JSON.parse(localStorage.getItem('family_receipts') || '[]')
    .filter((r: any) => r.client_id === args.clientId)
    .map((r: any) => ({
      id: r.id,
      type: r.type,
      ts: r.created_at,
      anchor_ref: r.anchor_ref,
    }));

  // Create demo files
  const files = [
    { sha256: 'sha256:abc123...', filename: 'estate_summary.pdf' },
    { sha256: 'sha256:def456...', filename: 'authority_grants.pdf' },
    { sha256: 'sha256:ghi789...', filename: 'beneficiary_forms.pdf' },
  ];

  // Generate manifest hash
  const manifestContent = JSON.stringify({ receipts, files });
  const encoder = new TextEncoder();
  const data = encoder.encode(manifestContent);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = 'sha256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const manifest: BinderManifest = {
    clientId: args.clientId,
    builtAt: new Date().toISOString(),
    files,
    receipts,
    hash,
  };

  // Create minimal ZIP structure
  const zipContent = new TextEncoder().encode(JSON.stringify(manifest));
  
  return {
    zip: zipContent,
    manifest,
  };
}