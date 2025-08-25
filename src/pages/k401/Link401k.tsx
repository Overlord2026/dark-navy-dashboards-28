import React from 'react';
import { upsertPlan, upsertAccount, upsertContrib } from '@/features/k401/store';
import { linkProvider } from '@/features/k401/connectors';
import { recordReceipt } from '@/features/receipts/record';
import { canWrite, getCurrentUserRole, getRoleDisplayName } from '@/features/auth/roles';
import { maybeAnchor, generateHash } from '@/features/anchors/hooks';

export default function Link401k(){
  const [provider,setProvider]=React.useState<'Vanguard'|'Fidelity'|'Schwab'|'Other'>('Fidelity');
  const [method,setMethod]=React.useState<'Manual'|'Aggregator'>('Aggregator');
  const [planId,setPlanId]=React.useState('');
  const [accountId,setAccountId]=React.useState('');
  const [employeePct,setEmployeePct]=React.useState(6);
  const [matchType,setMatchType]=React.useState<'simple'|'tiered'|'none'>('simple');
  const [simplePct,setSimplePct]=React.useState(100);
  const [limitPct,setLimitPct]=React.useState(3);

  const userRole = getCurrentUserRole();
  const writable = canWrite(userRole);

  async function save(){
    const pid = planId||crypto.randomUUID();
    const aid = accountId||crypto.randomUUID();
    const planData = { planId:pid, provider, match: matchType==='simple'
      ? { type:'simple', pctOfComp:simplePct, limitPct }
      : matchType==='tiered'
      ? { type:'tiered', tiers:[{ matchPct:100, compPct:3 },{ matchPct:50, compPct:2 }] }
      : { type:'none' }, updatedAt:new Date().toISOString() };

    await upsertPlan(planData);
    await upsertAccount({ accountId:aid, planId:pid, ownerUserId:'ME', balance:0,
      sources:{preTax:0,roth:0,employer:0,afterTax:0}, updatedAt:new Date().toISOString() });
    await upsertContrib(aid, { employeePct, employerMatch: matchType==='simple'
      ? { type:'simple', pctOfComp:simplePct, limitPct }
      : matchType==='tiered'? { type:'tiered', tiers:[{matchPct:100,compPct:3},{matchPct:50,compPct:2}] }
      : { type:'none' }, frequency:'per_pay' });

    if (method==='Aggregator') await linkProvider(aid, provider, 'Plaid' as any, 'consent-123');
    
    // Content-free receipts with optional anchoring
    const planHash = await generateHash(JSON.stringify(planData));
    await recordReceipt({ type:'Consent-RDS', scope:{ 'k401.data':[aid, provider] }, result:'approve', created_at:new Date().toISOString() } as any);
    await recordReceipt({ type:'Decision-RDS', action:'k401.link', reasons:[provider, method, planHash.slice(0, 16)], created_at:new Date().toISOString() } as any);
    
    // Optional anchoring
    await maybeAnchor('k401.link', planHash);
    
    alert('Linked!');
  }

  return (
    <div className="p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Link 401(k)</h1>
        {!writable && <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs">Read-only ({getRoleDisplayName(userRole)})</span>}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="text-sm">Provider
          <select className="w-full rounded-xl border px-2 py-1" value={provider} onChange={e=>writable && setProvider(e.target.value as any)} disabled={!writable}>
            <option>Fidelity</option><option>Vanguard</option><option>Schwab</option><option>Other</option>
          </select>
        </label>
        <label className="text-sm">Link method
          <select className="w-full rounded-xl border px-2 py-1" value={method} onChange={e=>writable && setMethod(e.target.value as any)} disabled={!writable}>
            <option>Aggregator</option><option>Manual</option>
          </select>
        </label>
        <label className="text-sm">Employee deferral %
          <input type="number" className="w-full rounded-xl border px-3 py-2" value={employeePct} onChange={e=>writable && setEmployeePct(Number(e.target.value||0))} disabled={!writable}/>
        </label>
        <label className="text-sm">Match type
          <select className="w-full rounded-xl border px-2 py-1" value={matchType} onChange={e=>writable && setMatchType(e.target.value as any)} disabled={!writable}>
            <option value="simple">Simple (100% up to X%)</option>
            <option value="tiered">Tiered</option>
            <option value="none">None</option>
          </select>
        </label>
        {matchType==='simple' && (
          <>
            <label className="text-sm">Match % of comp
              <input type="number" className="w-full rounded-xl border px-3 py-2" value={simplePct} onChange={e=>writable && setSimplePct(Number(e.target.value||0))} disabled={!writable}/>
            </label>
            <label className="text-sm">Limit (employee %) 
              <input type="number" className="w-full rounded-xl border px-3 py-2" value={limitPct} onChange={e=>writable && setLimitPct(Number(e.target.value||0))} disabled={!writable}/>
            </label>
          </>
        )}
      </div>
      <button 
        className="rounded-xl border px-3 py-2 disabled:opacity-50" 
        onClick={save} 
        disabled={!writable}
        title={!writable ? "Read-only access" : ""}
      >
        Save & Link
      </button>
      {!writable && (
        <div className="text-xs text-muted-foreground">
          Actions disabled in read-only mode
        </div>
      )}
    </div>
  );
}