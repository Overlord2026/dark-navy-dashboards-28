import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { initReceiptsEmitterAuto, hashActionRequest } from "@/lib/receiptsEmitter";
import { evaluateAction } from "@/lib/policy/policyEvaluator";
import { collectApprovals } from "@/lib/policy/hitlGate";

export default function EmitReceiptTest({ tenantId, userId }: { tenantId: string; userId?: string }) {
  const onRun = async () => {
    const emitter = initReceiptsEmitterAuto(supabase);
    const action = { type: "TEST_TRANSFER", amount: 5000, currency: "USD" };
    const request_hash = await hashActionRequest(action);
    const evalRes = await evaluateAction(action, { domain: "general" });
    const approvals = await collectApprovals({ approvers: [{id: (userId||"me")}], threshold: 1 });
    const pre = await emitter.emitPre({
      request_hash,
      decision: (evalRes.decision as any),
      policies: evalRes.bundles.map(b=>({bundle_id:b.id})),
      approvals: approvals.approvals,
    });
    // simulate effect:
    await emitter.emitPost({
      request_hash,
      decision: (evalRes.decision as any),
      policies: evalRes.bundles.map(b=>({bundle_id:b.id})),
      approvals: approvals.approvals,
      effects: [{ type: "TEST_EFFECT", value: "ok" }],
      linked_receipt_id: pre.id,
    });
    alert(`Emitted pre+post for request ${request_hash.slice(0,8)}…`);
  };
  return <button className="px-3 py-2 rounded bg-black text-white" onClick={onRun}>Emit Test Receipt</button>;
}