import React, { useEffect, useState } from "react";
import { resolveBundle, publishMockUpdate } from "@/lib/rulesync/rulesClient";

type Row = {
  label: string;
  value: string | null | undefined;
};

export default function RuleSyncConsole() {
  const [bundle, setBundle] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const domain = "general";
  const jurisdiction = "*";

  async function load() {
    setErr(null);
    try {
      const b = await resolveBundle(domain, jurisdiction);
      setBundle(b);
    } catch (e:any) {
      setErr(e.message || String(e));
    }
  }

  useEffect(() => { load(); }, []);

  async function onPublish() {
    try {
      setBusy(true);
      await publishMockUpdate(domain, jurisdiction);
      await load();
      alert("Published mock update.");
    } catch (e:any) {
      alert(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  const rows: Row[] = [
    { label: "bundle_id", value: bundle?.bundle_id },
    { label: "domain", value: bundle?.domain },
    { label: "jurisdiction", value: bundle?.jurisdiction },
    { label: "version", value: bundle?.version },
    { label: "effective_at", value: bundle?.effective_at },
    { label: "provider_id", value: bundle?.provider_id },
    { label: "content_hash", value: bundle?.content_hash },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">RuleSync Console</h2>
        <button className="px-3 py-2 rounded bg-black text-white disabled:opacity-50" onClick={onPublish} disabled={busy}>
          {busy ? "Working…" : "Publish Mock Update"}
        </button>
      </div>
      {err && <div className="text-red-600 mb-3">{err}</div>}
      {!bundle ? (
        <div className="text-sm text-muted-foreground">No bundle resolved yet. Press "Publish Mock Update".</div>
      ) : (
        <table className="min-w-full text-sm">
          <thead><tr className="text-left border-b"><th className="py-2 pr-4">Field</th><th className="py-2 pr-4">Value</th></tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.label} className="border-b">
                <td className="py-2 pr-4">{r.label}</td>
                <td className="py-2 pr-4 font-mono break-all">{String(r.value ?? "")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {bundle?.content && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Content</h3>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(bundle.content, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}