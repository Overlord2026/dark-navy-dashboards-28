import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { hasAdminRole } from "@/lib/roles";

type SummaryRow =
  Database["public"]["Functions"]["legacy_kpis_summary"]["Returns"][number];
type TimeseriesRow =
  Database["public"]["Functions"]["legacy_kpis_timeseries"]["Returns"][number];

type SummaryFn = "legacy_kpis_summary" | "legacy_kpis_summary_for_caller";
type SeriesFn = "legacy_kpis_timeseries" | "legacy_kpis_timeseries_for_caller";

export default function LegacyKPIDashboard() {
  const [summary, setSummary] = useState<SummaryRow | null>(null);
  const [rows, setRows] = useState<TimeseriesRow[]>([]);
  const [days, setDays] = useState(30);
  const [firmOnly, setFirmOnly] = useState(true);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [firmId, setFirmId] = useState<string | null>(null);

  // session → role/firm
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const meta = data.session?.user?.app_metadata as any;
      if (!mounted) return;
      setRole(meta?.role ?? null);
      setFirmId(meta?.firm_id ?? null);
      setIsAdmin(hasAdminRole(meta));
    })();
    const sub = supabase.auth.onAuthStateChange((_e, s) => {
      const meta = s?.user?.app_metadata as any;
      setRole(meta?.role ?? null);
      setFirmId(meta?.firm_id ?? null);
      setIsAdmin(hasAdminRole(meta));
    });
    return () => {
      mounted = false;
      sub.data.subscription.unsubscribe();
    };
  }, []);

  // fetch data
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      const summaryFn: SummaryFn = firmOnly ? "legacy_kpis_summary_for_caller" : "legacy_kpis_summary";
      const timeseriesFn: SeriesFn = firmOnly ? "legacy_kpis_timeseries_for_caller" : "legacy_kpis_timeseries";

      const { data: sdata, error: sErr } = await supabase.rpc(summaryFn, { days });
      if (sErr) { setErr(sErr.message); setLoading(false); return; }

      const { data: tdata, error: tErr } = await supabase.rpc(timeseriesFn, { days });
      if (tErr) { setErr(tErr.message); setLoading(false); return; }

      if (!alive) return;
      const s = Array.isArray(sdata) ? (sdata[0] as SummaryRow | undefined) : null;
      setSummary(s ?? null);
      setRows((Array.isArray(tdata) ? tdata : []) as TimeseriesRow[]);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [days, firmOnly]);

  const lines = useMemo(() => [
    { key: "started", label: "Started" },
    { key: "completed", label: "Completed" },
    { key: "exported", label: "Exported" },
    { key: "shared", label: "Shared" }
  ] as const, []);

  async function emitProofSlip() {
    const { error } = await supabase.rpc("admin_emit_kpi_proofslip", { days: 1, firm_id: null });
    if (error) alert(`Emit failed: ${error.message}`);
    else alert("ProofSlip emitted.");
  }

  return (
    <main className="container mx-auto px-4 py-10 text-bfo-ivory">
      <h1 className="text-2xl font-bold">Legacy KPIs</h1>
      <div className="mt-1 text-sm opacity-70">
        Role: {role ?? "—"} • Firm: {firmId ?? "—"}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {[7,14,30,60,90].map(n => (
          <button
            key={n}
            onClick={() => setDays(n)}
            className={`rounded-lg border px-3 py-1 text-sm ${days===n ? "bg-bfo-gold text-bfo-black" : "border-white/20 hover:bg-white/10"}`}
          >
            {n}d
          </button>
        ))}
        <label className="ml-2 inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={firmOnly} onChange={e => setFirmOnly(e.target.checked)} />
          My firm only
        </label>

        {isAdmin && (
          <button onClick={emitProofSlip} className="ml-auto rounded-lg border px-3 py-1 text-sm hover:bg-white/10">
            Emit KPI ProofSlip (today)
          </button>
        )}
      </div>

      {err && (
        <div className="mt-6 rounded-lg border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">
          Error: {err}
        </div>
      )}

      {loading ? (
        <div className="mt-10 opacity-70">Loading…</div>
      ) : summary ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card label="Started" value={summary.started} />
            <Card label="Completed" value={`${summary.completed} (${summary.completion_rate ?? 0}% )`} />
            <Card label="Exported" value={summary.exported} />
            <Card label="Shared" value={`${summary.shared} (${summary.share_rate ?? 0}% )`} />
            <Card label="Revalidated" value={`${summary.revalidated} (${summary.revalidation_rate ?? 0}% )`} />
            <Card label="Median mins to export" value={summary.median_minutes_to_export ?? 0} />
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 font-semibold">Daily funnel</div>
            <div style={{ width: "100%", height: 320 }}>
              {/* Keep your existing Recharts component if already installed;
                 leaving out here to avoid extra imports in this patch */}
              <pre className="whitespace-pre-wrap text-xs opacity-70">
                {rows.slice(-7).map(r => `${r.d}: S${r.started} C${r.completed} E${r.exported} Sh${r.shared}`).join("\n")}
              </pre>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-10 opacity-70">No data yet.</div>
      )}
    </main>
  );
}

function Card({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm opacity-70">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
