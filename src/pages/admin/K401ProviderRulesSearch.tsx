import React from 'react';
import { listProviderRules } from '@/features/k401/store';

export default function K401ProviderRulesSearch() {
  const [q, setQ] = React.useState('');
  const [rows, setRows] = React.useState<any[]>([]);

  React.useEffect(() => { 
    (async () => setRows(await listProviderRules()))(); 
  }, []);

  const filtered = rows.filter((r: any) => 
    r.provider.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-2xl font-semibold">Provider Rules — Search</h1>
      
      <input 
        className="rounded-xl border px-3 py-2" 
        placeholder="Search provider…" 
        value={q} 
        onChange={e => setQ(e.target.value)}
      />
      
      <div className="rounded-xl border overflow-auto mt-2">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Provider</th>
              <th className="text-left p-2">eSign</th>
              <th className="text-left p-2">How</th>
              <th className="text-left p-2">Phone</th>
              <th className="text-left p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r: any) => (
              <tr key={r.provider} className="border-t">
                <td className="p-2 font-medium">{r.provider}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    r.acceptsESign ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {String(r.acceptsESign)}
                  </span>
                </td>
                <td className="p-2 text-xs">
                  {r.paperwork?.map((p: any) => p.how).join(', ')}
                </td>
                <td className="p-2 text-xs">{r.phone || '-'}</td>
                <td className="p-2 text-xs">{r.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-600 mt-4">
        Found {filtered.length} of {rows.length} provider rules
      </div>
    </div>
  );
}