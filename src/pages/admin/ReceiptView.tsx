import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getReceiptById, searchReceipts } from "@/features/receipts/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Filters = {
  q?: string;
  type_prefix?: string;
  policy_version?: string;
  from_iso?: string;
  to_iso?: string;
  anchored?: "any" | "true" | "false";
};

function parseFilters(sp: URLSearchParams): Filters {
  const anchored = sp.get("anchored");
  return {
    q: sp.get("q") || "",
    type_prefix: sp.get("type") || "",
    policy_version: sp.get("pv") || "",
    from_iso: sp.get("from") || "",
    to_iso: sp.get("to") || "",
    anchored: anchored === "true" ? "true" : anchored === "false" ? "false" : "any",
  };
}

function toSearchParams(f: Filters): string {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.type_prefix) sp.set("type", f.type_prefix);
  if (f.policy_version) sp.set("pv", f.policy_version);
  if (f.from_iso) sp.set("from", f.from_iso);
  if (f.to_iso) sp.set("to", f.to_iso);
  if (f.anchored && f.anchored !== "any") sp.set("anchored", f.anchored);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export default function ReceiptView() {
  const { id } = useParams();             // /admin/receipt/:id
  const nav = useNavigate();
  const [sp, setSp] = useSearchParams();
  const [json, setJson] = React.useState<any | null>(null);
  const [err, setErr] = React.useState<string>("");
  const [busy, setBusy] = React.useState<boolean>(false);

  const [filters, setFilters] = React.useState<Filters>(() => parseFilters(sp));

  React.useEffect(() => {
    (async () => {
      if (!id) return;
      const r = await getReceiptById(id);
      if (!r) { setErr("Receipt not found"); setJson(null); return; }
      setErr(""); setJson(r);
    })();
  }, [id]);

  async function fetchWindow(): Promise<any[]> {
    const anchored =
      filters.anchored === "true" ? true :
      filters.anchored === "false" ? false : undefined;
    return searchReceipts({
      q: filters.q,
      type_prefix: filters.type_prefix || undefined,
      policy_version: filters.policy_version || undefined,
      from_iso: filters.from_iso || undefined,
      to_iso: filters.to_iso || undefined,
      anchored,
      limit: 5000
    });
  }

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
    setBusy(true);
    try {
      const window = await fetchWindow();
      const idx = window.findIndex(r => r.receipt_id === json.receipt_id);
      const nx = window[idx + dir];
      if (nx) {
        nav(`/admin/receipt/${encodeURIComponent(nx.receipt_id)}${toSearchParams(filters)}`);
      }
    } finally {
      setBusy(false);
    }
  }

  function applyFilters() {
    const query = toSearchParams(filters);
    setSp(new URLSearchParams(query.replace(/^\?/, "")));
    // keep same id; Prev/Next uses updated filters
  }

  function clearFilters() {
    const cleared: Filters = { anchored: "any", q: "", type_prefix: "", policy_version: "", from_iso: "", to_iso: "" };
    setFilters(cleared);
    setSp(new URLSearchParams());
  }

  // keep local state in sync if URL query changes externally
  React.useEffect(() => {
    setFilters(parseFilters(sp));
  }, [sp.toString()]);

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

      {/* Filter bar */}
      <div className="border border-border rounded-lg p-4 bg-muted/20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Search</label>
            <Input
              className="text-sm"
              value={filters.q || ""}
              onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
              placeholder="id, type, hash…"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Type prefix</label>
            <Input
              className="text-sm"
              value={filters.type_prefix || ""}
              onChange={e => setFilters(f => ({ ...f, type_prefix: e.target.value }))}
              placeholder="e.g., Trade-"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Policy ver</label>
            <Input
              className="text-sm"
              value={filters.policy_version || ""}
              onChange={e => setFilters(f => ({ ...f, policy_version: e.target.value }))}
              placeholder="T-2025.09"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">From</label>
            <Input
              type="datetime-local"
              className="text-sm"
              value={filters.from_iso || ""}
              onChange={e => setFilters(f => ({ ...f, from_iso: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">To</label>
            <Input
              type="datetime-local"
              className="text-sm"
              value={filters.to_iso || ""}
              onChange={e => setFilters(f => ({ ...f, to_iso: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Anchored</label>
            <select
              className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background"
              value={filters.anchored || "any"}
              onChange={e => setFilters(f => ({ ...f, anchored: e.target.value as any }))}
            >
              <option value="any">Any</option>
              <option value="true">Only anchored</option>
              <option value="false">Only unanchored</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={applyFilters}>
            Apply
          </Button>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        </div>
      </div>

      {json && (
        <>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={copyJSON}>
              Copy JSON
            </Button>
            <Button variant="outline" size="sm" onClick={downloadJSON}>
              Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => goPrevNext(-1)} disabled={busy}>
              Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => goPrevNext(1)} disabled={busy}>
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