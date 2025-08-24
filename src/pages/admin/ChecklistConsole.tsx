import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { riskScore, riskBand } from '@/features/estate/console/risk';
import { loadViews, addView, removeView, exportViews, importViews, SavedView } from '@/features/estate/console/views';
import { recordReceipt } from '@/features/receipts/record';
import type { PortfolioRow } from '@/features/estate/console/data';

export default function ChecklistConsole() {
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [sort, setSort] = React.useState<'risk_desc' | 'client_asc' | 'state_asc' | 'none'>('risk_desc');
  const [views, setViews] = React.useState<SavedView[]>(loadViews());
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [msg, setMsg] = React.useState('');

  // Mock data for demonstration
  const mockData: PortfolioRow[] = [
    {
      clientId: 'CLIENT_001',
      state: 'CA',
      checklist: {
        items: {
          will: { key: 'will', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'autofill', originCount: { autofill: 1 } },
          rlt: { key: 'rlt', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'manual', originCount: { manual: 1 } },
          pour_over: { key: 'pour_over', status: 'PENDING', updatedAt: '2024-01-01' },
          poa_financial: { key: 'poa_financial', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'notary', originCount: { notary: 1 } },
          hc_poa: { key: 'hc_poa', status: 'NEEDS_ATTENTION', updatedAt: '2024-01-01' },
          advance_directive: { key: 'advance_directive', status: 'PENDING', updatedAt: '2024-01-01' },
          hipaa: { key: 'hipaa', status: 'PENDING', updatedAt: '2024-01-01' },
          deed_recorded: { key: 'deed_recorded', status: 'NEEDS_ATTENTION', updatedAt: '2024-01-01' },
          beneficiary_sync: { key: 'beneficiary_sync', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'review', originCount: { review: 1 } },
          funding_letters: { key: 'funding_letters', status: 'PENDING', updatedAt: '2024-01-01' },
          attorney_review_final: { key: 'attorney_review_final', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'review', originCount: { review: 1 } },
          notary_final: { key: 'notary_final', status: 'PENDING', updatedAt: '2024-01-01' }
        } as any,
        hash: 'hash123'
      },
      flags: {
        trustWithoutDeed: true,
        healthIncomplete: true,
        noReviewFinal: false,
        signedNoFinal: false,
        deliveredNotLatest: false,
        consentMissing: false,
        autofillOff: false
      }
    },
    {
      clientId: 'CLIENT_002',
      state: 'TX',
      checklist: {
        items: {
          will: { key: 'will', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'autofill', originCount: { autofill: 2 } },
          rlt: { key: 'rlt', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'autofill', originCount: { autofill: 1 } },
          pour_over: { key: 'pour_over', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'autofill', originCount: { autofill: 1 } },
          poa_financial: { key: 'poa_financial', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'autofill', originCount: { autofill: 1 } },
          hc_poa: { key: 'hc_poa', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'autofill', originCount: { autofill: 1 } },
          advance_directive: { key: 'advance_directive', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'autofill', originCount: { autofill: 1 } },
          hipaa: { key: 'hipaa', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'autofill', originCount: { autofill: 1 } },
          deed_recorded: { key: 'deed_recorded', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'erecord', originCount: { erecord: 1 } },
          beneficiary_sync: { key: 'beneficiary_sync', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'autofill', originCount: { autofill: 1 } },
          funding_letters: { key: 'funding_letters', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'manual', originCount: { manual: 1 } },
          attorney_review_final: { key: 'attorney_review_final', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'review', originCount: { review: 1 } },
          notary_final: { key: 'notary_final', status: 'COMPLETE', updatedAt: '2024-01-01', origin: 'notary', originCount: { notary: 1 } }
        } as any,
        hash: 'hash456'
      },
      flags: {
        trustWithoutDeed: false,
        healthIncomplete: false,
        noReviewFinal: false,
        signedNoFinal: false,
        deliveredNotLatest: false,
        consentMissing: false,
        autofillOff: false
      }
    }
  ];

  // Apply filters
  const filtered = mockData.filter(row => {
    if (filter !== 'all') {
      // Apply specific filters based on status
      if (filter === 'needs_attention' && !Object.values(row.checklist?.items || {}).some(item => item.status === 'NEEDS_ATTENTION')) {
        return false;
      }
    }
    
    if (search && !row.clientId.toLowerCase().includes(search.toLowerCase()) && !row.state?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Apply sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'risk_desc') return riskScore(b) - riskScore(a);
    if (sort === 'client_asc') return a.clientId.localeCompare(b.clientId);
    if (sort === 'state_asc') return (a.state || '').localeCompare(b.state || '');
    return 0;
  });

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(sorted.map(r => r.clientId)));
    } else {
      setSelected(new Set());
    }
  };

  const saveView = () => {
    const name = prompt('Save view as…');
    if (!name) return;
    
    const view: SavedView = {
      id: crypto.randomUUID(),
      name,
      filter,
      search,
      sort,
      visible: [],
      createdAt: new Date().toISOString()
    };
    
    const arr = addView(view);
    setViews(arr);
    
    recordReceipt({
      type: 'Decision-RDS',
      action: 'console.views.save',
      reasons: [`views:${loadViews().length}`],
      created_at: new Date().toISOString()
    } as any);
    
    setMsg('View saved');
  };

  const deleteView = () => {
    const id = prompt('Delete view id…');
    if (!id) return;
    
    const arr = removeView(id);
    setViews(arr);
    
    recordReceipt({
      type: 'Decision-RDS',
      action: 'console.views.delete',
      reasons: [`views:${loadViews().length}`],
      created_at: new Date().toISOString()
    } as any);
    
    setMsg('View deleted');
  };

  const exportViewsToClipboard = () => {
    const json = exportViews();
    navigator.clipboard.writeText(json);
    
    recordReceipt({
      type: 'Decision-RDS',
      action: 'console.views.export',
      reasons: [`views:${loadViews().length}`],
      created_at: new Date().toISOString()
    } as any);
    
    setMsg('Views copied to clipboard');
  };

  const importViewsFromClipboard = () => {
    const json = prompt('Paste saved views JSON');
    if (!json) return;
    
    try {
      importViews(json);
      setViews(loadViews());
      
      recordReceipt({
        type: 'Decision-RDS',
        action: 'console.views.import',
        reasons: [`views:${loadViews().length}`],
        created_at: new Date().toISOString()
      } as any);
      
      setMsg('Views imported');
    } catch {
      setMsg('Import failed');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Estate Checklist Console
          {msg && <Badge variant="outline">{msg}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          <select 
            className="rounded-xl border px-2 py-1 text-sm" 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All clients</option>
            <option value="needs_attention">Needs attention</option>
            <option value="complete">Complete</option>
            <option value="pending">Pending</option>
          </select>
          
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-48"
          />
          
          <select 
            className="rounded-xl border px-2 py-1 text-sm" 
            value={sort} 
            onChange={e => setSort(e.target.value as any)}
          >
            <option value="risk_desc">Sort: Risk (high→low)</option>
            <option value="client_asc">Sort: Client</option>
            <option value="state_asc">Sort: State</option>
            <option value="none">Sort: None</option>
          </select>

          {/* Saved Views */}
          <div className="flex items-center gap-2">
            <select 
              className="rounded-xl border px-2 py-1 text-sm" 
              onChange={e => {
                const v = views.find(x => x.id === e.target.value);
                if (!v) return;
                setFilter(v.filter);
                setSearch(v.search || '');
                setSort((v.sort as any) || 'risk_desc');
              }}
            >
              <option value="">Saved Views…</option>
              {views.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <Button variant="ghost" size="sm" onClick={saveView}>Save</Button>
            <Button variant="ghost" size="sm" onClick={deleteView}>Delete</Button>
            <Button variant="ghost" size="sm" onClick={exportViewsToClipboard}>Export</Button>
            <Button variant="ghost" size="sm" onClick={importViewsFromClipboard}>Import</Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="text-left p-2 border">
                  <input 
                    type="checkbox" 
                    onChange={e => toggleAll(e.target.checked)} 
                  />
                </th>
                <th className="text-left p-2 border">Client</th>
                <th className="text-left p-2 border">State</th>
                <th className="text-left p-2 border">Risk</th>
                <th className="text-left p-2 border">Checklist</th>
                <th className="text-left p-2 border">Flags</th>
                <th className="text-left p-2 border">Guardian</th>
                <th className="text-left p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(r => {
                const score = riskScore(r);
                const band = riskBand(score);
                const color = band === 'HIGH' ? 'bg-red-50 text-red-800' : 
                             band === 'MED' ? 'bg-amber-50 text-amber-900' : 
                             'bg-green-50 text-green-800';

                // Guardian View calculations
                const items = r.checklist?.items || ({} as any);
                const keys = ['will','rlt','pour_over','poa_financial','hc_poa','advance_directive','hipaa','deed_recorded','beneficiary_sync','funding_letters','attorney_review_final','notary_final'];
                const counts = keys.reduce((acc: any, k) => {
                  const it = items[k] || {};
                  const oc = it.originCount || {};
                  (['autofill','manual','notary','erecord','review','esign'] as const).forEach(o => {
                    acc[o] = (acc[o] || 0) + (oc[o] || 0);
                  });
                  return acc;
                }, {});
                
                const total = keys.reduce((n, k) => 
                  n + (items[k]?.originCount ? 
                    Object.values(items[k].originCount!).reduce((a: number, b: any) => a + Number(b), 0) : 0
                  ), 0) || 0;
                
                const autoPercent = total ? Math.round(((counts.autofill || 0) / total) * 100) : 0;

                return (
                  <tr key={r.clientId} className="border-t">
                    <td className="p-2 border">
                      <input
                        type="checkbox"
                        checked={selected.has(r.clientId)}
                        onChange={e => {
                          const newSelected = new Set(selected);
                          if (e.target.checked) {
                            newSelected.add(r.clientId);
                          } else {
                            newSelected.delete(r.clientId);
                          }
                          setSelected(newSelected);
                        }}
                      />
                    </td>
                    <td className="p-2 border font-medium">{r.clientId}</td>
                    <td className="p-2 border">{r.state}</td>
                    
                    {/* Risk */}
                    <td className="p-2 border">
                      <span 
                        className={`px-2 py-0.5 rounded-xl text-xs ${color}`} 
                        title={`${score}`}
                      >
                        {band}
                      </span>
                    </td>
                    
                    {/* Checklist Status */}
                    <td className="p-2 border text-xs">
                      <div className="grid grid-cols-3 gap-1">
                        {Object.entries(items).slice(0, 12).map(([key, item]: [string, any]) => (
                          <span 
                            key={key} 
                            className={`inline-block w-3 h-3 rounded ${
                              item.status === 'COMPLETE' ? 'bg-green-500' :
                              item.status === 'NEEDS_ATTENTION' ? 'bg-amber-500' :
                              item.status === 'EXPIRED' ? 'bg-red-500' :
                              'bg-gray-300'
                            }`}
                            title={`${key}: ${item.status}`}
                          />
                        ))}
                      </div>
                    </td>
                    
                    {/* Flags */}
                    <td className="p-2 border text-xs">
                      {r.flags?.trustWithoutDeed && <Badge variant="destructive" className="mr-1 text-xs">Trust-Deed</Badge>}
                      {r.flags?.healthIncomplete && <Badge variant="secondary" className="mr-1 text-xs">Health</Badge>}
                      {r.flags?.noReviewFinal && <Badge variant="outline" className="mr-1 text-xs">Review</Badge>}
                    </td>
                    
                    {/* Guardian */}
                    <td className="p-2 border text-xs">
                      <div>
                        <span className="inline-block mr-2">🤖 {autoPercent}% auto</span>
                        <span 
                          className="inline-block mr-2" 
                          title="autofill/manual/notary/record/review/esign"
                        >
                          ({counts.autofill||0}/{counts.manual||0}/{counts.notary||0}/{counts.erecord||0}/{counts.review||0}/{counts.esign||0})
                        </span>
                      </div>
                    </td>
                    
                    {/* Actions */}
                    <td className="p-2 border">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-sm text-gray-600">
          Showing {sorted.length} of {mockData.length} clients
        </div>
      </CardContent>
    </Card>
  );
}