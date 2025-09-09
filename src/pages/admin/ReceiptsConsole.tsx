import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { initReceiptsEmitterAuto, hashActionRequest } from "@/lib/receiptsEmitter";
import { evaluateAction } from "@/lib/policy/policyEvaluator";
import { collectApprovals } from "@/lib/policy/hitlGate";

type Receipt = { id: string; stage: "pre"|"post"; created_at: string; decision: string; request_hash: string; anchor_status: string; };

export default function ReceiptsConsole() {
  const [rows,setRows] = useState<Receipt[]>([]);
  const [err,setErr] = useState<string|null>(null);
  const [busy,setBusy] = useState(false);

  async function refresh() {
    try {
      // Use aies_receipts as the available receipts table
      const { data, error } = await supabase
        .from("aies_receipts")
        .select("id,created_at,inputs,outcomes,reason_codes")
        .order("created_at",{ascending:false})
        .limit(100);
      
      if (error) {
        setErr(error.message);
      } else {
        // Map to expected format
        const mappedRows: Receipt[] = (data || []).map(receipt => ({
          id: receipt.id,
          stage: 'pre' as const,
          created_at: receipt.created_at || new Date().toISOString(),
          decision: 'ALLOW' as const,
          request_hash: receipt.inputs ? JSON.stringify(receipt.inputs).slice(0, 16) + '...' : '',
          anchor_status: 'pending' as const
        }));
        setRows(mappedRows);
      }
    } catch (e: any) {
      setErr(e.message || String(e));
    }
  }
  
  useEffect(() => { refresh(); },[]);

  async function emitTest() {
    try {
      setBusy(true);
      const emitter = initReceiptsEmitterAuto(supabase);
      const action = { type: "TEST_TRANSFER", amount: 5000, currency: "USD" };
      const request_hash = await hashActionRequest(action);
      const evalRes = await evaluateAction(action, { domain: "general" });
      const { data: user } = await supabase.auth.getUser();
      const approvals = await collectApprovals({ approvers: [{ id: user?.user?.id || "me", role: "advisor" }], threshold: 1 });

      const pre = await emitter.emitPre({
        request_hash,
        decision: evalRes.decision as any,
        policies: evalRes.bundles.map(b=>({bundle_id:b.id})),
        approvals: approvals.approvals,
      });

      await emitter.emitPost({
        request_hash,
        decision: evalRes.decision as any,
        policies: evalRes.bundles.map(b=>({bundle_id:b.id})),
        approvals: approvals.approvals,
        effects: [{ type: "TEST_EFFECT", value: "ok" }],
        linked_receipt_id: pre.id,
      });

      await emitter.recordAnchorLocalMock(pre.id);
      await refresh();
      alert("Test receipt emitted and anchored.");
    } catch (e:any) {
      alert(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Receipts Console</h2>
        <button className="px-3 py-2 rounded bg-black text-white disabled:opacity-50" onClick={emitTest} disabled={busy}>
          {busy ? "Working…" : "Emit Test"}
        </button>
      </div>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <table className="min-w-full text-sm">
        <thead><tr className="text-left border-b">
          <th className="py-2 pr-4">ID</th><th className="py-2 pr-4">Stage</th><th className="py-2 pr-4">Decision</th><th className="py-2 pr-4">Anchor</th><th className="py-2 pr-4">Created</th>
        </tr></thead>
        <tbody>{rows.map(r=>(
          <tr key={r.id} className="border-b">
            <td className="py-2 pr-4">{r.id.slice(0,8)}…</td>
            <td className="py-2 pr-4">{r.stage}</td>
            <td className="py-2 pr-4">{r.decision}</td>
            <td className="py-2 pr-4">{r.anchor_status}</td>
            <td className="py-2 pr-4">{new Date(r.created_at).toLocaleString()}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}