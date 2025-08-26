import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getReceiptById, searchReceipts } from "@/features/receipts/store";
import { Button } from "@/components/ui/button";

export default function ReceiptView() {
  const { id } = useParams(); // /admin/receipt/:id
  const nav = useNavigate();
  const [json, setJson] = React.useState<any | null>(null);
  const [err, setErr] = React.useState<string>("");

  React.useEffect(() => {
    (async () => {
      const r = id ? await getReceiptById(id) : null;
      if (!r) setErr("Receipt not found");
      setJson(r);
    })();
  }, [id]);

  function copyJSON() {
    try {
      navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    } catch { /* ignore */ }
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${json?.receipt_id || "receipt"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function goPrevNext(dir: -1 | 1) {
    if (!json) return;
    const window = await searchReceipts({ from_iso: "", to_iso: "", limit: 5000 });
    const idx = window.findIndex(r => r.receipt_id === json.receipt_id);
    const nx = window[idx + dir];
    if (nx) nav(`/admin/receipt/${encodeURIComponent(nx.receipt_id)}`);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Receipt</h1>
      <div className="text-sm text-muted-foreground">
        ID: <code className="bg-muted px-2 py-1 rounded">{id}</code>
      </div>
      
      {err && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {err}
        </div>
      )}

      {json && (
        <>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={copyJSON}>
              Copy JSON
            </Button>
            <Button variant="outline" size="sm" onClick={downloadJSON}>
              Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => goPrevNext(-1)}>
              Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => goPrevNext(1)}>
              Next
            </Button>
            <Button variant="outline" size="sm" onClick={() => nav(-1)}>
              Back
            </Button>
          </div>
          
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-2 border-b border-border">
              <h2 className="text-sm font-medium text-foreground">Receipt JSON</h2>
            </div>
            <pre className="whitespace-pre-wrap text-xs p-4 bg-background text-foreground overflow-auto max-h-[70vh]">
              {JSON.stringify(json, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}