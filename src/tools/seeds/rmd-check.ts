// /src/tools/seeds/rmd-check.ts
export async function seedRMDCheck() {
  const now = new Date().toISOString();
  const { recordReceipt } = await import('@/features/receipts/record');
  recordReceipt({
    id: `rmd_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['RMD_PREVIEW'],
    created_at: now
  } as any);
  return true;
}

// Keep default export for backward compatibility
export default seedRMDCheck;
