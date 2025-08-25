import React from 'react';
import { recordReceipt } from '@/features/receipts/record';
import { getPartner } from '@/features/k401/partners';
import { Badge } from '@/components/ui/badge';
import { canWrite, getCurrentUserRole } from '@/features/auth/roles';

type Row = { 
  clientId: string; 
  name?: string; 
  state?: string; 
  underMatch?: boolean; 
  feeDrag?: boolean; 
  sdbaInactive?: boolean; 
  rolloverCandidate?: boolean 
};

export default function AdvisorBook() {
  const [rows, setRows] = React.useState<Row[]>([
    { clientId: 'C1', name: 'Client Alpha', underMatch: true, feeDrag: false, sdbaInactive: true, rolloverCandidate: false },
    { clientId: 'C2', name: 'Client Beta', underMatch: false, feeDrag: true, sdbaInactive: false, rolloverCandidate: true },
    { clientId: 'C3', name: 'Client Gamma', underMatch: true, feeDrag: true, sdbaInactive: false, rolloverCandidate: false },
    { clientId: 'C4', name: 'Client Delta', underMatch: false, feeDrag: false, sdbaInactive: true, rolloverCandidate: true }
  ]);
  const [sel, setSel] = React.useState<Record<string, boolean>>({});

  async function bulk(kind: 'nudges.match' | 'nudges.rollover') {
    const ids = Object.keys(sel).filter(k => sel[k]);
    if (ids.length === 0) {
      alert('Please select clients first');
      return;
    }
    
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: `k401.book.bulk.${kind}`, 
      reasons: [`count:${ids.length}`], 
      created_at: new Date().toISOString() 
    } as any);
    alert(`Sent ${kind} to ${ids.length} clients`);
  }

  const selectedCount = Object.values(sel).filter(Boolean).length;
  const userRole = getCurrentUserRole();
  const writable = canWrite(userRole);

  const currentPartner = getPartner();

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">401(k) Book</h1>
        <div className="flex items-center gap-3">
          <Badge variant={currentPartner === 'None' ? 'secondary' : 'default'}>
            Partner: {currentPartner}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {rows.length} clients • {selectedCount} selected
            {!writable && <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs">Read-only</span>}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button 
          className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 px-3 py-2 text-sm font-medium hover:bg-amber-100 disabled:opacity-50"
          onClick={() => bulk('nudges.match')}
          disabled={selectedCount === 0 || !writable}
          title={!writable ? "Read-only access" : ""}
        >
          Nudge: Full Match ({selectedCount})
        </button>
        <button 
          className="rounded-xl border border-green-200 bg-green-50 text-green-800 px-3 py-2 text-sm font-medium hover:bg-green-100 disabled:opacity-50"
          onClick={() => bulk('nudges.rollover')}
          disabled={selectedCount === 0 || !writable}
          title={!writable ? "Read-only access" : ""}
        >
          Nudge: Rollover ({selectedCount})
        </button>
        {!writable && (
          <div className="text-xs text-muted-foreground flex items-center ml-2">
            Actions disabled in read-only mode
          </div>
        )}
      </div>

      <div className="rounded-xl border overflow-auto bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">
                <input 
                  type="checkbox" 
                  onChange={e => setSel(Object.fromEntries(rows.map(r => [r.clientId, e.target.checked])))}
                  checked={selectedCount === rows.length && rows.length > 0}
                  className="rounded"
                />
              </th>
              <th className="text-left p-3 font-medium">Client</th>
              <th className="text-left p-3 font-medium">Risk Flags</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.clientId} className="border-t hover:bg-muted/25">
                <td className="p-3">
                  <input 
                    type="checkbox" 
                    checked={!!sel[r.clientId]} 
                    onChange={e => setSel({...sel, [r.clientId]: e.target.checked})}
                    className="rounded"
                  />
                </td>
                <td className="p-3">
                  <div className="font-medium">{r.name || r.clientId}</div>
                  <div className="font-mono text-xs text-muted-foreground">{r.clientId}</div>
                </td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {r.underMatch && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                        under-match
                      </span>
                    )}
                    {r.feeDrag && (
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                        fee-drag
                      </span>
                    )}
                    {r.sdbaInactive && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                        sdba-inactive
                      </span>
                    )}
                    {r.rolloverCandidate && (
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                        rollover
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}