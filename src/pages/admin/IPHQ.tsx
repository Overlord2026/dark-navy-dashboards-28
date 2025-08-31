import React from 'react';
import { supabase } from '@/integrations/supabase/client';

type Filing = {
  id?: string;
  family_code: string;
  filing_kind: 'PROVISIONAL' | 'NONPROVISIONAL' | 'PCT' | 'OTHER';
  filing_title: string;
  filing_date: string | null; // ISO or null
  application_no: string | null;
  artifact_url_1?: string | null;
  artifact_url_2?: string | null;
  artifact_url_3?: string | null;
  artifact_url_4?: string | null;
  artifact_url_5?: string | null;
  notes?: string | null;
  created_at?: string;
};

const families = [
  'P6','AIES','NIL','EstateRON','RuleSync','TradingOS','401k','Healthcare','Explainability','Other'
];

function toCsv(rows: Filing[]) {
  const header = [
    'family_code','filing_kind','filing_title','filing_date','application_no',
    'artifact_url_1','artifact_url_2','artifact_url_3','artifact_url_4','artifact_url_5','notes'
  ];
  const body = rows.map(r => header.map(h => {
    const v = (r as any)[h];
    const s = v == null ? '' : String(v);
    // minimal CSV escaping
    return `"${s.replace(/"/g,'""')}"`;
  }).join(','));
  return [header.join(','), ...body].join('\r\n');
}

export default function IPHQ() {
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<Filing[]>([]);
  const [family, setFamily] = React.useState<string>('All');
  const [kind, setKind] = React.useState<string>('All');
  const [q, setQ] = React.useState('');
  const [dateFrom, setDateFrom] = React.useState<string>('');
  const [dateTo, setDateTo] = React.useState<string>('');
  const [hasArtifactsOnly, setHasArtifactsOnly] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    // Using rpc call since view may not be in types yet
    const { data, error } = await supabase.rpc('get_ip_filings_data');
    if (error) {
      console.error(error);
      setRows([]);
      setLoading(false);
      return;
    }
    let filtered = (data ?? []) as Filing[];

    if (family !== 'All') filtered = filtered.filter(r => r.family_code === family);
    if (kind !== 'All')   filtered = filtered.filter(r => r.filing_kind === kind);
    if (q.trim()) {
      const qq = q.toLowerCase();
      filtered = filtered.filter(r =>
        (r.filing_title || '').toLowerCase().includes(qq) ||
        (r.application_no || '').toLowerCase().includes(qq)
      );
    }
    if (dateFrom) filtered = filtered.filter(r => !r.filing_date || r.filing_date >= dateFrom);
    if (dateTo)   filtered = filtered.filter(r => !r.filing_date || r.filing_date <= dateTo);
    if (hasArtifactsOnly) {
      filtered = filtered.filter(r =>
        !!(r.artifact_url_1 || r.artifact_url_2 || r.artifact_url_3 || r.artifact_url_4 || r.artifact_url_5)
      );
    }

    setRows(filtered);
    setLoading(false);
  }, [family, kind, q, dateFrom, dateTo, hasArtifactsOnly]);

  React.useEffect(() => { void load(); }, [load]);

  const countsByFamily = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(r.family_code, (m.get(r.family_code) || 0) + 1);
    return Array.from(m.entries()).sort((a,b)=>a[0].localeCompare(b[0]));
  }, [rows]);

  const exportCsv = () => {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `ip_filings_export_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const ArtifactLinks = ({ r }: { r: Filing }) => {
    const urls = [r.artifact_url_1, r.artifact_url_2, r.artifact_url_3, r.artifact_url_4, r.artifact_url_5].filter(Boolean) as string[];
    if (urls.length === 0) return <span className="text-muted-foreground">—</span>;
    return (
      <div className="flex gap-2 flex-wrap">
        {urls.map((u,i)=>(<a key={i} href={u} target="_blank" rel="noreferrer" className="text-accent hover:underline">Art{i+1}</a>))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">HQ · IP Filings</h1>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <div className="col-span-1">
          <label className="block text-sm text-muted-foreground">Family</label>
          <select value={family} onChange={e=>setFamily(e.target.value)} className="w-full border rounded p-2 bg-background text-foreground">
            <option>All</option>
            {families.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="col-span-1">
          <label className="block text-sm text-muted-foreground">Kind</label>
          <select value={kind} onChange={e=>setKind(e.target.value)} className="w-full border rounded p-2 bg-background text-foreground">
            <option>All</option>
            <option>PROVISIONAL</option>
            <option>NONPROVISIONAL</option>
            <option>PCT</option>
            <option>OTHER</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-muted-foreground">Search title / app no.</label>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="e.g. wallet consent or 63/862,941"
                 className="w-full border rounded p-2 bg-background text-foreground" />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground">From</label>
          <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className="w-full border rounded p-2 bg-background text-foreground"/>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground">To</label>
          <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className="w-full border rounded p-2 bg-background text-foreground"/>
        </div>
        <div className="flex items-center gap-2">
          <input id="art" type="checkbox" checked={hasArtifactsOnly} onChange={e=>setHasArtifactsOnly(e.target.checked)} />
          <label htmlFor="art" className="text-sm text-muted-foreground">Artifacts only</label>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4 flex-wrap">
          {countsByFamily.map(([f,c]) => (
            <span key={f} className="px-2 py-1 rounded border border-accent text-accent">{f}: {c}</span>
          ))}
          <span className="text-muted-foreground">Total: {rows.length}</span>
        </div>
        <button onClick={exportCsv} className="px-3 py-2 rounded border border-accent text-accent hover:bg-accent hover:text-accent-foreground">Export CSV</button>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-muted-foreground">
            <tr>
              <th className="text-left p-2">Family</th>
              <th className="text-left p-2">Kind</th>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">App #</th>
              <th className="text-left p-2">Artifacts</th>
              <th className="text-left p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
          {loading && (
            <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
          )}
          {!loading && rows.map((r,i)=>(
            <tr key={r.id ?? `${r.family_code}|${r.filing_title}|${r.application_no ?? ''}`} className="border-t border-border">
              <td className="p-2">{r.family_code}</td>
              <td className="p-2">{r.filing_kind}</td>
              <td className="p-2">{r.filing_title}</td>
              <td className="p-2">{r.filing_date ?? '—'}</td>
              <td className="p-2">{r.application_no ?? '—'}</td>
              <td className="p-2"><ArtifactLinks r={r} /></td>
              <td className="p-2">{r.notes ?? '—'}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}