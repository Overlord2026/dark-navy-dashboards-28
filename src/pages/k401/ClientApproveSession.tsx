import React from 'react';
import { getSession, upsertSession } from '@/features/k401/delegated/store';
import { recordReceipt } from '@/features/receipts/record';
import { maybeAnchor, generateHash } from '@/features/anchors/hooks';
import SessionBar from '@/features/k401/delegated/SessionBar';

export default function ClientApproveSession() {
  const [sessionId, setSessionId] = React.useState('');
  const [session, setSession] = React.useState<any>(null);
  
  async function load() { 
    setSession(await getSession(sessionId)); 
  }
  
  async function approve() {
    if (!session) return;
    
    const updatedSession = {
      ...session,
      status: 'active' as const,
      approvedAt: new Date().toISOString()
    };
    
    await upsertSession(updatedSession);
    
    // Content-free receipt with anchoring
    const approvalHash = await generateHash(JSON.stringify(updatedSession));
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'k401.delegated.session.approve', 
      reasons: [sessionId, approvalHash.slice(0, 16)], 
      created_at: new Date().toISOString() 
    } as any);
    
    // Optional anchoring
    await maybeAnchor('k401.session.approve', approvalHash);
    
    setSession(updatedSession);
    alert('Approved. Advisor now has time-boxed access.');
  }

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Approve Advisor Session</h1>
      
      <label className="text-sm">
        Session ID
        <input 
          className="w-full rounded-xl border px-3 py-2" 
          value={sessionId} 
          onChange={e => setSessionId(e.target.value)}
          placeholder="Enter session ID"
        />
      </label>
      
      <button 
        className="rounded-xl border px-3 py-2 hover:bg-gray-50" 
        onClick={load}
      >
        Load session
      </button>
      
      {session && (
        <div className="text-xs text-gray-700 p-3 bg-gray-50 rounded-xl">
          <div>Status: {session.status}</div>
          <div>Starts: {new Date(session.startedAt).toLocaleString()}</div>
          <div>Ends: {new Date(session.endsAt).toLocaleString()}</div>
          <div>Scopes: {session.scope.join(', ')}</div>
          <div>Advisor: {session.advisorUserId}</div>
        </div>
      )}
      
      <button 
        className="rounded-xl border px-3 py-2 hover:bg-gray-50 disabled:opacity-50" 
        onClick={approve} 
        disabled={!session || session.status !== 'pending'}
      >
        Approve Session
      </button>

      {session?.status === 'active' && (
        <SessionBar endsAt={session.endsAt} />
      )}
    </div>
  );
}