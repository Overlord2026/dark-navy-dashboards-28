import type { SupabaseClient } from "@supabase/supabase-js";
import * as Canonical from "@/lib/canonical"; // Force cache refresh
import { emitReceipt, type RDS } from "./dataAdapter";

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
  recordAnchorLocalMock(receipt_id: string): Promise<void>;
}

export function initReceiptsEmitterAuto(supabase: SupabaseClient): ReceiptsEmitter {
  let tenantCache: string | null = null;

  async function tenantId(): Promise<string> {
    if (tenantCache) return tenantCache;
    const { data, error } = await supabase.rpc("ensure_user_tenant");
    if (error) throw error;
    tenantCache = data as string;
    return tenantCache!;
  }
  async function userId(): Promise<string> {
    const { data } = await supabase.auth.getUser();
    const uid = data?.user?.id;
    if (!uid) throw new Error("Missing auth user id");
    return uid;
  }
  async function insertReceipt(stage: ReceiptStage, input: Omit<ReceiptInput, "stage">) {
    const t = await tenantId(); const u = await userId();
    const payload = { ...input, stage, tenant_id: t, created_by: u, anchor_status: "pending" };
    const { data, error } = await supabase.from("receipts").insert(payload).select("*").single();
    if (error) throw error;
    return data!;
  }
  async function emitPre(input: Omit<ReceiptInput, "stage">) {
    return insertReceipt("pre", input);
  }
  async function emitPost(input: Omit<ReceiptInput, "stage"> & { linked_receipt_id: string }) {
    return insertReceipt("post", input);
  }
  async function recordAnchorLocalMock(receipt_id: string) {
    const t = await tenantId(); const u = await userId();
    const now = new Date().toISOString();
    const txid = `ctlog:mock:${now}`;
    const { error: e1 } = await supabase.from("anchors").insert({
      tenant_id: t, receipt_id, substrate: "ctlog", txid, inclusion_proof: { note: "mock" },
      anchored_at: now, created_by: u,
    });
    if (e1) throw e1;
    const { error: e2 } = await supabase.from("receipts").update({ anchor_status: "anchored" }).eq("id", receipt_id);
    if (e2) throw e2;
  }
  return { emitPre, emitPost, recordAnchorLocalMock };
}

export async function hashActionRequest(action: unknown): Promise<string> {
  return Canonical.inputsHash(action);
}

// Mock-compatible emitter
export function initEmitter(adapter?: { emitReceipt: typeof emitReceipt; inputsHash: typeof Canonical.inputsHash }) {
  const emit = adapter?.emitReceipt || emitReceipt;
  const hash = adapter?.inputsHash || Canonical.inputsHash;
  
  return {
    async emit(type: string, value: any, family?: string): Promise<RDS> {
      const receipt: RDS = {
        id: crypto.randomUUID(),
        type,
        created_at: new Date().toISOString(),
        value,
        family
      };
      return emit(receipt);
    },
    hash
  };
}