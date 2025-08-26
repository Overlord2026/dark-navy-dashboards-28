import React from 'react';
import CountyRuleViewer from "@/components/estate/CountyRuleViewer";
import { batchReportAndAnchorAll, exportCountyMetaCSV, exportLastBatchCSV } from "@/features/estate/demo/estateDemo";

export default function EstateRonDemoPage(){
  const pv = "E-2025.08";
  const [log, setLog] = React.useState<string[]>([]);
  const [busy, setBusy] = React.useState(false);

  function push(msg:string){ setLog(l => [`${new Date().toLocaleTimeString()} — ${msg}`, ...l]); }

  return (
    <div className="p-4 space-y-3">
      <div className="text-lg font-semibold">Estate RON Demo</div>
      
      {/* Demo stepper buttons */}
      <div className="flex gap-2 flex-wrap">
        <button className="border rounded px-3 py-1">Cover Sheet</button>
        <button className="border rounded px-3 py-1">RON Session</button>
        <button className="border rounded px-3 py-1">PRE Grant</button>
        <button className="border rounded px-3 py-1">Recording</button>
        <button className="border rounded px-3 py-1">Anchor</button>
        
        {/* NEW: Batch Report + Anchor (all counties) */}
        <button className="border rounded px-3 py-1" disabled={busy} onClick={async()=>{
          setBusy(true);
          try{
            // Optionally limit batch size via prompt
            const limitStr = prompt("Limit to first N counties? (blank = all)","");
            const limit = limitStr ? Math.max(1, parseInt(limitStr,10)||0) : undefined;
            const env = (import.meta.env.MODE==="production") ? "prod" : "dev";
            const res = await batchReportAndAnchorAll(pv, env, { limit, threshold: { n:1, m:1 } });
            push(`Batch Report+Anchor: ${res.ok?"OK":"FAIL"} reports=${res.reports_emitted} root=${res.merkle_root} audit=${res.audit_receipt_id}`);
            alert(res.ok
              ? `Batch OK\nReports: ${res.reports_emitted}\nMerkle: ${res.merkle_root}\nAudit: ${res.audit_receipt_id}`
              : `Batch emitted ${res.reports_emitted} reports but anchoring failed.`);
          } finally { setBusy(false); }
        }}>
          Batch Report + Anchor (all counties)
        </button>
        
        {/* NEW: CSV exports */}
        <button className="border rounded px-3 py-1" disabled={busy} onClick={()=>exportCountyMetaCSV()}>
          Export County Meta CSV
        </button>
        <button className="border rounded px-3 py-1" disabled={busy} onClick={()=>exportLastBatchCSV()}>
          Export Last Batch CSV
        </button>
        
        <button className="border rounded px-3 py-1" onClick={()=>setLog([])} title="Clear log">Reset Demo</button>
      </div>

      {/* County Rule Viewer */}
      <CountyRuleViewer policyVersion={pv} />

      <div className="border rounded p-2">
        <div className="text-sm font-semibold mb-1">Demo log</div>
        <pre className="whitespace-pre-wrap text-xs">{log.join("\n") || "(no events yet)"}</pre>
      </div>

      <div className="text-xs text-gray-600">
        All receipts are content-free (bands/tokens + hashes). No PII/PHI is stored. CSV exports are content-free: county inches/tokens for metadata; batch summary with receipt IDs and hashes.
      </div>
    </div>
  );
}