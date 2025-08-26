import React from "react";
import { getReceiptById } from "@/features/receipts/store";
import { Button } from "@/components/ui/button";

export function ReceiptViewerModal({ id, onClose }: { id: string; onClose: () => void }) {
  const [json, setJson] = React.useState<any | null>(null);
  
  React.useEffect(() => {
    (async () => setJson(await getReceiptById(id)))();
  }, [id]);

  function copyJSON() {
    try {
      navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    } catch { /* ignore */ }
  }
  
  function exportJSON() {
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${json?.receipt_id || "receipt"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg border border-border max-w-[800px] w-[95vw] max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">
            Receipt: <code className="bg-muted px-2 py-1 rounded text-sm">{id}</code>
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyJSON}>
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={exportJSON}>
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <pre className="whitespace-pre-wrap text-xs text-foreground">
            {json ? JSON.stringify(json, null, 2) : "Loading…"}
          </pre>
        </div>
      </div>
    </div>
  );
}