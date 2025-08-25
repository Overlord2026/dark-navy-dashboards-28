import React from 'react';
import { upsertGrant } from '@/features/k401/delegated/store';
import { recordReceipt } from '@/features/receipts/record';
import { maybeAnchor, generateHash } from '@/features/anchors/hooks';
import type { DelegatedScope } from '@/features/k401/delegated/types';

export default function ClientGrantAccess() {
  const [accountId, setAccountId] = React.useState('');          // pick from client's 401k accounts
  const [advisorUserId, setAdvisorUserId] = React.useState('ADV1');
  const [scopes, setScopes] = React.useState<string[]>(['read']);
  const [maxUsd, setMaxUsd] = React.useState(25000);
  const [whitelist, setWhitelist] = React.useState('VTI,AGG,FXAIX'); // comma list
  const [dual, setDual] = React.useState(true);
  const [duration, setDuration] = React.useState(30);

  async function grant() {
    const grantData = {
      grantId: crypto.randomUUID(),
      accountId,
      clientUserId: 'ME', 
      advisorUserId,
      scopes: (scopes.includes('trade') ? ['read', 'trade'] : ['read']) as DelegatedScope[],
      policy: { 
        maxUsdPerDay: maxUsd, 
        assetWhitelist: whitelist.split(',').map(s => s.trim()).filter(Boolean), 
        dualApproval: dual, 
        durationMinutes: duration 
      },
      status: 'granted' as const,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()       // grant valid 7 days, each session time-boxed shorter
    };

    const g = await upsertGrant(grantData);
    
    // Content-free receipt with anchoring
    const grantHash = await generateHash(JSON.stringify(grantData));
    await recordReceipt({ 
      type: 'Consent-RDS', 
      scope: { 'k401.delegated': [g.accountId, g.advisorUserId, g.scopes.join('|')] }, 
      result: 'approve', 
      created_at: new Date().toISOString() 
    } as any);
    
    // Optional anchoring
    await maybeAnchor('k401.delegated.grant', grantHash);
    
    alert('Delegated access granted.');
  }

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Grant Advisor Access</h1>
      
      <label className="text-sm">
        401(k) Account ID
        <input 
          className="w-full rounded-xl border px-3 py-2" 
          value={accountId} 
          onChange={e => setAccountId(e.target.value)}
          placeholder="Enter account ID"
        />
      </label>
      
      <label className="text-sm">
        Advisor User ID
        <input 
          className="w-full rounded-xl border px-3 py-2" 
          value={advisorUserId} 
          onChange={e => setAdvisorUserId(e.target.value)}
          placeholder="Enter advisor ID"
        />
      </label>
      
      <label className="text-sm">
        Scopes
        <select 
          className="w-full rounded-xl border px-2 py-1" 
          multiple 
          value={scopes} 
          onChange={e => setScopes(Array.from(e.target.selectedOptions).map(o => o.value))}
        >
          <option value="read">Read</option>
          <option value="trade">Trade</option>
        </select>
      </label>
      
      <div className="grid md:grid-cols-3 gap-2">
        <label className="text-sm">
          Max USD/day
          <input 
            type="number" 
            className="w-full rounded-xl border px-3 py-2" 
            value={maxUsd} 
            onChange={e => setMaxUsd(Number(e.target.value || 0))}
          />
        </label>
        
        <label className="text-sm">
          Trade window (min)
          <input 
            type="number" 
            className="w-full rounded-xl border px-3 py-2" 
            value={duration} 
            onChange={e => setDuration(Number(e.target.value || 0))}
          />
        </label>
        
        <label className="text-sm mt-6">
          <input 
            type="checkbox" 
            checked={dual} 
            onChange={e => setDual(e.target.checked)} 
            className="mr-2"
          /> 
          Require my approval per trade
        </label>
      </div>
      
      <label className="text-sm">
        Asset whitelist (tickers)
        <input 
          className="w-full rounded-xl border px-3 py-2" 
          value={whitelist} 
          onChange={e => setWhitelist(e.target.value)}
          placeholder="VTI,AGG,FXAIX"
        />
      </label>
      
      <button 
        className="rounded-xl border px-3 py-2 hover:bg-gray-50" 
        onClick={grant}
      >
        Grant access
      </button>
    </div>
  );
}