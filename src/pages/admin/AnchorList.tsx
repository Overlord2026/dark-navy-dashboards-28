import React from "react";
import { listAuditRDS } from "@/features/receipts/audit";
import { ReceiptViewerModal } from "@/components/admin/ReceiptViewerModal";

type Row = ReturnType<typeof listAuditRDS>[number];

function toCSV(rows: Row[]) {
  const head = [
    "ts", "receipt_id", "policy_version", "merkle_root",
    "accepted", "threshold", "batch_size", "locators"
  ];
  const lines = [head.join(",")];
  rows.forEach(r => {
    const accepted = r.accept_n_of_m?.accepted ? "yes" : "no";
    const threshold = `${r.accept_n_of_m?.n || ""}-of-${r.accept_n_of_m?.m || ""}`;
    const locators = (r.cross_chain_locator || []).map(x => `${x.chain}:${x.txid}`).join("|");
    lines.push([
      r.ts,
      r.receipt_id,
      r.policy_version || "",
      r.merkle_root,
      accepted,
      threshold,
      String(r.included_receipts?.length || 0),
      `"${locators}"`
    ].join(","));
  });
  return lines.join("\n");
}

function toViewerQuery(from: string, to: string, onlyAccepted: boolean, q: string) {
  const sp = new URLSearchParams();
  if (from) sp.set("from", from);
  if (to) sp.set("to", to);
  if (onlyAccepted) sp.set("anchored", "true");
  if (q) sp.set("q", q);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export default function AnchorList() {
  const [all, setAll] = React.useState<Row[]>([]);
  const [q, setQ] = React.useState("");
  const [onlyAccepted, setOnlyAccepted] = React.useState(false);
  const [from, setFrom] = React.useState<string>("");
  const [to, setTo] = React.useState<string>("");
  const [modalId, setModalId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setAll(listAuditRDS());
  }, []);

  const filtered = all.filter(r => {
    if (onlyAccepted && !r.accept_n_of_m?.accepted) return false;
    if (from && Date.parse(r.ts) < Date.parse(from)) return false;
    if (to && Date.parse(r.ts) > Date.parse(to)) return false;
    if (q) {
      const text = [
        r.ts, r.receipt_id, r.policy_version, r.merkle_root,
        ...(r.cross_chain_locator || []).map(x => `${x.chain}:${x.txid}`)
      ].join(" ").toLowerCase();
      if (!text.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  const [open, setOpen] = React.useState<string | null>(null);

  function downloadCSV() {
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "anchor_batches.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Anchors</h1>

      <div className="flex flex-wrap gap-3 items-center text-sm">
        <input 
          className="border border-border rounded-lg px-3 py-2 bg-background text-foreground" 
          placeholder="Search merkle root / locator…" 
          value={q} 
          onChange={e => setQ(e.target.value)}
        />
        <label className="inline-flex items-center gap-2 text-foreground">
          <input 
            type="checkbox" 
            checked={onlyAccepted} 
            onChange={e => setOnlyAccepted(e.target.checked)}
            className="rounded border-border"
          />
          Accepted only
        </label>
        <label className="inline-flex items-center gap-2 text-foreground">
          From
          <input 
            type="datetime-local" 
            className="border border-border rounded-lg px-3 py-2 bg-background text-foreground" 
            value={from} 
            onChange={e => setFrom(e.target.value)}
          />
        </label>
        <label className="inline-flex items-center gap-2 text-foreground">
          To
          <input 
            type="datetime-local" 
            className="border border-border rounded-lg px-3 py-2 bg-background text-foreground" 
            value={to} 
            onChange={e => setTo(e.target.value)}
          />
        </label>
        <button 
          onClick={downloadCSV} 
          className="border border-border rounded-lg px-4 py-2 hover:bg-muted transition-colors text-foreground"
        >
          Export CSV
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 gap-4 p-4 text-sm font-semibold border-b border-border bg-muted text-foreground">
          <div>Timestamp</div>
          <div>Merkle Root</div>
          <div>Accepted</div>
          <div>Threshold</div>
          <div>Batch Size</div>
          <div>Locators</div>
          <div>Details</div>
        </div>
        {filtered.map(r => {
          const accepted = r.accept_n_of_m?.accepted ? "YES" : "NO";
          const threshold = `${r.accept_n_of_m?.n || ""}-of-${r.accept_n_of_m?.m || ""}`;
          const locators = (r.cross_chain_locator || []).map(x => `${x.chain}:${x.txid}`).join(" | ");
          const isOpen = open === r.receipt_id;
          return (
            <div key={r.receipt_id} className="border-b border-border">
              <div className="grid grid-cols-7 gap-4 p-4 text-sm text-foreground">
                <div><code className="text-xs">{r.ts}</code></div>
                <div><code className="text-xs break-all">{r.merkle_root}</code></div>
                <div className={accepted === "YES" ? "text-green-600" : "text-red-600"}>{accepted}</div>
                <div>{threshold}</div>
                <div>{r.included_receipts?.length || 0}</div>
                <div className="break-all text-xs">{locators || "-"}</div>
                <div>
                  <button 
                    onClick={() => setOpen(isOpen ? null : r.receipt_id)} 
                    className="border border-border rounded-lg px-3 py-1 text-xs hover:bg-muted transition-colors"
                  >
                    {isOpen ? "Hide" : "View"}
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="p-4 bg-muted/50 border-t border-border">
                  <div className="text-xs font-semibold mb-2 text-foreground">Receipt IDs in batch:</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(r.included_receipts || []).map(id => {
                      const query = toViewerQuery(from, to, onlyAccepted, q);
                      return (
                        <div key={id} className="flex gap-1">
                          <button 
                            className="border border-border rounded px-2 py-1 text-xs hover:bg-muted transition-colors" 
                            onClick={() => setModalId(id)}
                            title="View in modal"
                          >
                            {id}
                          </button>
                          <a
                            className="border border-border rounded px-2 py-1 text-xs hover:bg-muted transition-colors text-blue-600 hover:text-blue-800"
                            href={`/admin/receipt/${encodeURIComponent(id)}${query}`}
                            title="Open in full viewer (filters preserved)"
                          >
                            →
                          </a>
                        </div>
                      );
                    })}
                    {(!r.included_receipts || r.included_receipts.length === 0) && (
                      <span className="text-xs text-muted-foreground">(none)</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Policy version: <code>{r.policy_version || "-"}</code></div>
                    <div>Prev audit hash: <code className="break-all">{r.prev_audit_hash || "-"}</code></div>
                    <div>Reasons: <code>{(r.reasons || []).join(", ") || "-"}</code></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground text-center">
            No anchor batches match your filter.
          </div>
        )}
      </div>
      
      {modalId && <ReceiptViewerModal id={modalId} onClose={() => setModalId(null)} />}
    </div>
  );
}