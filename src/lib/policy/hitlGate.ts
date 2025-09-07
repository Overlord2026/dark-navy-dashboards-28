// Simple stub for approval collection
export async function collectApprovals(config: { approvers: Array<{id: string}>; threshold: number }) {
  // Mock approval collection - return mock approvals
  return {
    approvals: config.approvers.map(approver => ({
      signer: approver.id,
      sig: `mock_sig_${Math.random().toString(36).slice(2)}`,
      role: "approver",
      ts: new Date().toISOString()
    }))
  };
}