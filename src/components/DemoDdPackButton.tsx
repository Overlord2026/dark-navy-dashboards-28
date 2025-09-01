import React from "react";
import { callEdgeJSON } from "@/services/aiEdge";

export default function DemoDdPackButton() {
  const [busy, setBusy] = React.useState(false);
  const [out, setOut] = React.useState<string>("");

  const run = async () => {
    setBusy(true); setOut("");
    try {
      const pack = await callEdgeJSON("pmalpha-ddpack", {
        title: "Demo Pack",
        items: ["A123", { id: "B9", label: "Second" }]
      });
      setOut(JSON.stringify(pack, null, 2));
    } catch (e:any) {
      setOut(`Error: ${e.message || String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={run}
        disabled={busy}
        className="px-3 py-2 rounded border border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black disabled:opacity-50"
      >
        {busy ? "Running…" : "Demo ddPack"}
      </button>
      {out && (
        <pre className="text-xs bg-black/40 border border-gray-700 rounded p-3 overflow-auto max-h-64">
{out}
        </pre>
      )}
    </div>
  );
}