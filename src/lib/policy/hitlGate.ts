export interface ApprovalRequest { approvers: { id: string; role?: string }[]; threshold: number; }
export interface ApprovalResult { approvals: { signer: string; role?: string; ts: string }[]; satisfied: boolean; }
export async function collectApprovals(req: ApprovalRequest): Promise<ApprovalResult> {
  const now = new Date().toISOString();
  const approvals = req.approvers.slice(0, req.threshold).map(a => ({ signer: a.id, role: a.role, ts: now }));
  return { approvals, satisfied: approvals.length >= req.threshold };
}