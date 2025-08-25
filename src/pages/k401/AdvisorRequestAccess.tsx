import React from 'react';
import { getGrant, upsertSession } from '@/features/k401/delegated/store';
import { recordReceipt } from '@/features/receipts/record';
import { maybeAnchor, generateHash } from '@/features/anchors/hooks';

export default function AdvisorRequestAccess() {
  const [grantId, setGrantId] = React.useState('');
  const [grant, setGrant] = React.useState<any>(null);
  
  async function load() { 
    setGrant(await getGrant(grantId)); 
  }
  
  async function start() {
    if (!grant) return;
    
    const now = Date.now(); 
    const ends = now + (grant.policy.durationMinutes * 60 * 1000);
    
    const sessionData = { 
      sessionId: crypto.randomUUID(), 
      grantId, 
      accountId: grant.accountId, 
      advisorUserId: grant.advisorUserId, 
      startedAt: new Date(now).toISOString(), 
      endsAt: new Date(ends).toISOString(), 
      scope: grant.scopes, 
      status: 'pending' as const
    };
    
    const s = await upsertSession(sessionData);
    
    // Content-free receipt with anchoring
    const sessionHash = await generateHash(JSON.stringify(sessionData));
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'k401.delegated.session.start', 
      reasons: [s.sessionId, grantId, sessionHash.slice(0, 16)], 
      created_at: new Date().toISOString() 
    } as any);
    
    // Optional anchoring
    await maybeAnchor('k401.session.start', sessionHash);
    
    alert(`Session requested. Ask client to approve in-app.`);
  }

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Request Delegated Session</h1>
      
      <label className="text-sm">
        Grant ID
        <input 
          className="w-full rounded-xl border px-3 py-2" 
          value={grantId} 
          onChange={e => setGrantId(e.target.value)}
          placeholder="Enter grant ID"
        />
      </label>
      
      <button 
        className="rounded-xl border px-3 py-2 hover:bg-gray-50" 
        onClick={load}
      >
        Load grant
      </button>
      
      {grant && (
        <div className="text-xs text-gray-700 p-3 bg-gray-50 rounded-xl">
          <div>Scopes: {grant.scopes.join(', ')}</div>
          <div>Window: {grant.policy.durationMinutes}m</div>
          <div>Dual approval: {String(grant.policy.dualApproval)}</div>
          <div>Max USD/day: ${grant.policy.maxUsdPerDay?.toLocaleString()}</div>
          <div>Asset whitelist: {grant.policy.assetWhitelist?.join(', ') || 'None'}</div>
        </div>
      )}
      
      <button 
        className="rounded-xl border px-3 py-2 hover:bg-gray-50 disabled:opacity-50" 
        onClick={start} 
        disabled={!grant}
      >
        Start session
      </button>
    </div>
  );
}