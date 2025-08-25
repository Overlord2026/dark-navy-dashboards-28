import React from 'react';
import { getSession } from '@/features/k401/delegated/store';
import { mintReadToken, mintTradeToken } from '@/features/k401/delegated/tokenBroker';
import { checkTradePolicy } from '@/features/k401/delegated/policy';
import { recordReceipt } from '@/features/receipts/record';
import { maybeAnchor, generateHash } from '@/features/anchors/hooks';
import SessionBar from '@/features/k401/delegated/SessionBar';

export default function AdvisorAssistConsole() {
  const [sessionId, setSessionId] = React.useState('');
  const [session, setSession] = React.useState<any>(null);
  const [asset, setAsset] = React.useState('VTI');
  const [qty, setQty] = React.useState(10);
  const [price, setPrice] = React.useState(250);

  async function load() { 
    const s = await getSession(sessionId); 
    setSession(s); 
    if (s) {
      await recordReceipt({ 
        type: 'Decision-RDS', 
        action: 'k401.delegated.session.open', 
        reasons: [s.sessionId], 
        created_at: new Date().toISOString() 
      } as any);
    }
  }

  async function view() {
    if (!session || session.status !== 'active') {
      return alert('Session not active');
    }
    
    const tok = await mintReadToken(session.sessionId);
    
    // Content-free receipt
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'k401.delegated.view', 
      reasons: [session.sessionId], 
      created_at: new Date().toISOString() 
    } as any);
    
    alert(`View token ${tok.token} minted (stub).`);
  }

  async function trade() {
    if (!session || session.status !== 'active' || !session.scope.includes('trade')) {
      return alert('Trade scope not active');
    }
    
    const usd = qty * price;
    const policy = { 
      maxUsdPerDay: 25000, 
      assetWhitelist: ['VTI', 'AGG', 'FXAIX'], 
      dualApproval: true 
    };
    
    // Log trade signal with content-free receipt
    const tradeData = { sessionId: session.sessionId, asset, qty, price, usd };
    const tradeHash = await generateHash(JSON.stringify(tradeData));
    
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'k401.trade.signal', 
      reasons: [session.sessionId, asset, String(qty), String(price), tradeHash.slice(0, 16)], 
      created_at: new Date().toISOString() 
    } as any);
    
    const gate = checkTradePolicy(policy as any, { asset, usd });
    
    if (!gate.ok) { 
      await recordReceipt({ 
        type: 'Decision-RDS', 
        action: 'k401.trade.blocked', 
        reasons: [gate.reason || '', tradeHash.slice(0, 16)], 
        created_at: new Date().toISOString() 
      } as any);
      return alert(`Trade blocked: ${gate.reason}`); 
    }
    
    // Dual approval: require client to click approve (in real app, push notification)
    alert('Waiting for client approval (stub)…');
    
    const tok = await mintTradeToken(session.sessionId);
    
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'k401.trade.order', 
      reasons: [session.sessionId, asset, tradeHash.slice(0, 16)], 
      created_at: new Date().toISOString() 
    } as any);
    
    // Optional anchoring
    await maybeAnchor('k401.trade', tradeHash);
    
    alert(`Trade token ${tok.token} minted (stub). Place order via provider adapter.`);
  }

  return (
    <div className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Advisor Assist (Delegated)</h1>
      
      <label className="text-sm">
        Session ID
        <input 
          className="w-full rounded-xl border px-3 py-2" 
          value={sessionId} 
          onChange={e => setSessionId(e.target.value)}
          placeholder="Enter session ID"
        />
      </label>
      
      <div className="flex gap-2">
        <button 
          className="rounded-xl border px-3 py-2 hover:bg-gray-50" 
          onClick={load}
        >
          Load
        </button>
        <button 
          className="rounded-xl border px-3 py-2 hover:bg-gray-50 disabled:opacity-50" 
          onClick={view} 
          disabled={!session || session.status !== 'active'}
        >
          View holdings
        </button>
        <button 
          className="rounded-xl border px-3 py-2 hover:bg-gray-50 disabled:opacity-50" 
          onClick={() => location.assign(`/k401/rollover?accountId=${session?.accountId}`)} 
          disabled={!session}
        >
          Start rollover
        </button>
      </div>

      {session && (
        <div className="text-xs text-gray-700 p-3 bg-gray-50 rounded-xl">
          <div>Status: {session.status}</div>
          <div>Account: {session.accountId}</div>
          <div>Scopes: {session.scope.join(', ')}</div>
          <div>Ends: {new Date(session.endsAt).toLocaleString()}</div>
        </div>
      )}
      
      <div className="rounded-xl border p-3">
        <div className="text-sm font-medium mb-2">Place order (stub)</div>
        <div className="grid md:grid-cols-3 gap-2">
          <label className="text-sm">
            Asset
            <input 
              className="w-full rounded-xl border px-3 py-2" 
              value={asset} 
              onChange={e => setAsset(e.target.value)}
            />
          </label>
          <label className="text-sm">
            Qty
            <input 
              type="number" 
              className="w-full rounded-xl border px-3 py-2" 
              value={qty} 
              onChange={e => setQty(Number(e.target.value || 0))}
            />
          </label>
          <label className="text-sm">
            Price
            <input 
              type="number" 
              className="w-full rounded-xl border px-3 py-2" 
              value={price} 
              onChange={e => setPrice(Number(e.target.value || 0))}
            />
          </label>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          Total: ${(qty * price).toLocaleString()}
        </div>
        <button 
          className="rounded-xl border px-3 py-2 mt-2 hover:bg-gray-50 disabled:opacity-50" 
          onClick={trade} 
          disabled={!session || session.status !== 'active' || !session.scope.includes('trade')}
        >
          Submit order
        </button>
      </div>

      {session?.status === 'active' && (
        <SessionBar endsAt={session.endsAt} />
      )}
    </div>
  );
}