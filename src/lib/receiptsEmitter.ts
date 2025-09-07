import type { SupabaseClient } from "@supabase/supabase-js";
import { canonicalize } from "./canonical";

export type ReceiptDecision = "ALLOW" | "DENY" | "ALLOW_WITH_CONDITIONS";
export type ReceiptStage = "pre" | "post";

export interface PolicyRef { bundle_id: string; provider_sig?: string; version?: string; [k: string]: any; }
export interface ApprovalRef { signer: string; sig?: string; role?: string; ts?: string; }
export interface AnchorProof { substrate: "ctlog" | "worm" | "btc" | "eth"; txid: string; inclusion_proof?: any; anchored_at?: string; }

export interface ReceiptInput {
  stage: ReceiptStage; request_hash: string; decision: ReceiptDecision;
  policies: PolicyRef[]; approvals: ApprovalRef[]; effects?: any[]; exceptions?: any[];
  redaction_map?: any; linked_receipt_id?: string;
}

export interface ReceiptsEmitter {
  emitPre(input: Omit<ReceiptInput, "stage">): Promise<{ id: string } & any>;
  emitPost(input: Omit<ReceiptInput, "stage"> & { linked_receipt_id: string }): Promise<{ id: string } & any>;
  recordAnchor(receipt_id: string, proof: AnchorProof): Promise<void>;
}

export function initReceiptsEmitter(
  supabase: SupabaseClient,
  getTenantId: () => string | Promise<string>,
  getUserId?: () => string | Promise<string>,
): ReceiptsEmitter {
  async function tenantId(): Promise<string> {
    const t = await getTenantId(); if (!t) throw new Error("Missing tenant_id"); return t;
  }
  async function userId(): Promise<string> {
    if (getUserId) { const u = await getUserId(); if (u) return u; }
    const { data } = await supabase.auth.getUser(); const uid = data?.user?.id;
    if (!uid) throw new Error("Missing auth user id"); return uid;
  }
  async function insertReceipt(stage: ReceiptStage, input: Omit<ReceiptInput, "stage">) {
    const t = await tenantId(); const u = await userId();
    const payload = { ...input, stage, tenant_id: t, created_by: u, anchor_status: "pending" };
    const { data, error } = await supabase.from("receipts").insert(payload).select("*").single();
    if (error) throw error; return data;
  }
  async function emitPre(input: Omit<ReceiptInput, "stage">) { return insertReceipt("pre", input); }
  async function emitPost(input: Omit<ReceiptInput, "stage"> & { linked_receipt_id: string }) { return insertReceipt("post", input); }
  async function recordAnchor(receipt_id: string, proof: AnchorProof) {
    const t = await tenantId(); const u = await userId();
    const { error: e1 } = await supabase.from("anchors").insert({
      tenant_id: t, receipt_id, substrate: proof.substrate, txid: proof.txid,
      inclusion_proof: proof.inclusion_proof ?? null, anchored_at: proof.anchored_at ?? new Date().toISOString(), created_by: u,
    }); if (e1) throw e1;
    const { error: e2 } = await supabase.from("receipts").update({ anchor_status: "anchored" }).eq("id", receipt_id);
    if (e2) throw e2;
  }
  return { emitPre, emitPost, recordAnchor };
}

export async function hashActionRequest(action: unknown): Promise<string> {
  const { hash } = await canonicalize(action); return hash;
}