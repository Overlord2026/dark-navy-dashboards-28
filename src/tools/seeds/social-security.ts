/**
 * Seeder for social-security tool
 * Creates sample proof slips when tool is installed with seed=true
 */

export async function seedSocialSecurity() {
  // minimal demo slip (no PII)
  const now = new Date().toISOString();
  const { recordReceipt } = await import('@/features/receipts/record');
  recordReceipt({
    id: `ss_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['SS_TIMING_PREVIEW'],
    created_at: now
  } as any);
  return true;
}

// Keep default export for backward compatibility
export default seedSocialSecurity;
