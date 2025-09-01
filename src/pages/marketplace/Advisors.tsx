import React from 'react';
import { listAdvisors, type Pro } from '@/services/advisors';

export default function Advisors() {
  const [rows, setRows] = React.useState<Pro[]>([]);
  const [q, setQ] = React.useState('');

  React.useEffect(() => { listAdvisors().then(setRows).catch(console.error); }, []);
  const filtered = rows.filter(r =>
    (r.name?.toLowerCase().includes(q.toLowerCase()) ||
     r.tags?.join(' ').toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-white">Meet Our Expert Advisors</h1>
      <input value={q} onChange={e=>setQ(e.target.value)}
             placeholder="Search by name, tag, location"
             className="w-full max-w-md p-2 rounded bg-black text-white border border-bfo-gold"/>
      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map(r => (
          <a key={r.id} href={`/marketplace/advisors/${r.id}`}
             className="bfo-card hover:shadow-lg transition">
            <div className="flex items-center gap-3">
              <img src={r.avatar_url ?? '/images/avatar-advisor.png'} className="h-12 w-12 rounded-full border border-bfo-gold" />
              <div>
                <div className="text-white font-medium">{r.name}</div>
                <div className="text-sm text-gray-400">{r.title ?? 'Financial Advisor'} · {r.location ?? ''}</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(r.tags ?? []).slice(0,4).map((t:string)=>(
                <span key={t} className="px-2 py-0.5 text-xs border border-bfo-gold text-bfo-gold rounded">{t}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}