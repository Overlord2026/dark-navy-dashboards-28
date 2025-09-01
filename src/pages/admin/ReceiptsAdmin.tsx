import React from 'react';
import { supabase } from '@/integrations/supabase/client';

type R = {
  id: string;
  subject: string;
  action: string;
  reasons: {code:string,msg:string}[];
  receipt_hash: string;
  created_at: string;
  anchored_at: string | null;
  anchor_ref: any | null;
};

function toCsv(rows: R[]) {
  const header = ['Time','Subject','Action','Receipt','Anchor','Reasons'];
  const body = rows.map(r => [
    r.created_at, r.subject, r.action, r.receipt_hash, r.anchored_at ?? '',
    JSON.stringify(r.reasons ?? [])
  ].map(s=>`"${String(s).replace(/"/g,'""')}"`).join(','));
  return [header.join(','), ...body].join('\r\n');
}

export default function ReceiptsAdmin() {
  const [rows,setRows] = React.useState<R[]>([]);
  const [loading,setLoading] = React.useState(false);
  const [q,setQ] = React.useState('');
  const [subject,setSubject] = React.useState('All');
  const [from,setFrom] = React.useState('');
  const [to,setTo] = React.useState('');
  const [onlyUnanchored,setOnlyUnanchored] = React.useState(false);

  const load = React.useCallback(async()=>{
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('v_decision_receipts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error){ console.error(error); setRows([]); setLoading(false); return; }
    let filtered = (data ?? []) as R[];

    if (subject !== 'All') filtered = filtered.filter(r=>r.subject===subject);
    if (from) filtered = filtered.filter(r=>r.created_at >= from);
    if (to)   filtered = filtered.filter(r=>r.created_at <= to);
    if (q.trim()){
      const qq = q.toLowerCase();
      filtered = filtered.filter(r =>
        (r.receipt_hash||'').toLowerCase().includes(qq) ||
        (r.action||'').toLowerCase().includes(qq)  ||
        JSON.stringify(r.reasons||[]).toLowerCase().includes(qq)
      );
    }
    if (onlyUnanchored) filtered = filtered.filter(r => !r.anchored_at);
    setRows(filtered);
    setLoading(false);
  },[q,subject,from,to,onlyUnanchored]);

  React.useEffect(()=>{ void load(); },[load]);

  const exportCsv = () => {
    const blob = new Blob([toCsv(rows)],{type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `decision_receipts_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const subjects = React.useMemo(()=> {
    const s = new Set<string>();
    rows.forEach(r=>s.add(r.subject));
    return ['All', ...Array.from(s).sort()];
  },[rows]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin · Decision Receipts</h1>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <div>
          <label className="block text-sm text-gray-400">Subject</label>
          <select value={subject} onChange={e=>setSubject(e.target.value)} className="w-full border rounded p-2 bg-black text-white">
            {subjects.map(s=> <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400">Search</label>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="receipt hash / reason text"
                 className="w-full border rounded p-2 bg-black text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-400">From</label>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="w-full border rounded p-2 bg-black text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-400">To</label>
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="w-full border rounded p-2 bg-black text-white" />
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={onlyUnanchored} onChange={e=>setOnlyUnanchored(e.target.checked)} />
          <span className="text-sm text-gray-300">Unanchored only</span>
        </label>
        <button onClick={exportCsv} className="px-3 py-2 rounded border border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black">
          Export CSV
        </button>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="text-gray-400">
            <tr>
              <th className="p-2 text-left">Time</th>
              <th className="p-2 text-left">Subject</th>
              <th className="p-2 text-left">Action</th>
              <th className="p-2 text-left">Receipt</th>
              <th className="p-2 text-left">Anchor</th>
              <th className="p-2 text-left">Reasons</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="p-6 text-center text-gray-400">Loading…</td></tr>}
            {!loading && rows.map(r=>(
              <tr key={r.receipt_hash} className="border-t border-gray-700">
                <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-2">{r.subject}</td>
                <td className="p-2">{r.action}</td>
                <td className="p-2 font-mono">{r.receipt_hash.slice(0,10)}…</td>
                <td className="p-2">
                  {r.anchored_at
                    ? <span className="px-2 py-1 rounded bg-emerald-700 text-white">Anchored ✓</span>
                    : <span className="px-2 py-1 rounded bg-yellow-700 text-white">Pending</span>}
                </td>
                <td className="p-2">{(r.reasons||[]).map(x=>x.code).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}