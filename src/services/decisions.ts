import { callEdgeJSON } from "@/services/aiEdge";

export interface DecisionInput {
  subject: string;
  action: string;
  reasons: string[];
  meta?: any;
}

export interface DecisionRDS {
  id: string;
  type: 'Decision-RDS';
  subject_id: string;
  action: string;
  reasons: string[];
  result: string;
  inputs_hash: string;
  policy_hash: string;
  model_id?: string;
  receipt_hash: string;
  policy_version: string;
  anchor_ref?: {
    type: string;
    proof_ok: boolean;
    timestamp: string;
    merkle_leaf?: string;
    merkle_root?: string;
  };
  created_at: string;
  metadata?: Record<string, any>;
}

export async function saveDecisionRDS(input: DecisionInput) {
  return callEdgeJSON("policy-eval", input);
}

export async function getLatestDecisionRDS(subjectId: string, action?: string): Promise<DecisionRDS | null> {
  return callEdgeJSON("get-latest-decision", { subjectId, action });
}

export async function getDecisionRDSHistory(subjectId: string, limit: number = 10): Promise<DecisionRDS[]> {
  return callEdgeJSON("get-decision-history", { subjectId, limit });
}