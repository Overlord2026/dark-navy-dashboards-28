import React from 'react';
import { getSession } from '@/features/k401/delegated/store';
import { mintReadToken, mintTradeToken } from '@/features/k401/delegated/tokenBroker';
import { checkTradePolicy } from '@/features/k401/delegated/policy';
import { recordReceipt } from '@/features/receipts/record';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    if (!session || session.status !== 'active') return alert('Not active');
    
    const tok = await mintReadToken(session.sessionId);
    
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
    
    const gate = checkTradePolicy(policy as any, { asset, usd });
    
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'k401.trade.signal', 
      reasons: [session.sessionId, asset, String(qty), String(price)], 
      created_at: new Date().toISOString() 
    } as any);
    
    if (!gate.ok) { 
      await recordReceipt({ 
        type: 'Decision-RDS', 
        action: 'k401.trade.blocked', 
        reasons: [gate.reason || ''], 
        created_at: new Date().toISOString() 
      } as any); 
      return alert(`Blocked: ${gate.reason}`); 
    }
    
    // Dual approval: require client to click approve (in real app, push notification)
    alert('Waiting for client approval (stub)…');
    
    const tok = await mintTradeToken(session.sessionId);
    
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'k401.trade.order', 
      reasons: [session.sessionId, asset], 
      created_at: new Date().toISOString() 
    } as any);
    
    alert(`Trade token ${tok.token} minted (stub). Place order via provider adapter.`);
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Advisor Assist (Delegated)</h1>
        <p className="text-muted-foreground">
          Manage client 401(k) accounts with delegated, time-boxed access
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sessionId">Session ID</Label>
            <Input
              id="sessionId"
              value={sessionId}
              onChange={e => setSessionId(e.target.value)}
              placeholder="Enter active session ID"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={load} variant="outline">
              Load
            </Button>
            <Button onClick={view} disabled={!session}>
              View Holdings
            </Button>
            <Button 
              onClick={() => location.assign(`/k401/rollover?accountId=${session?.accountId}`)} 
              disabled={!session}
              variant="outline"
            >
              Start Rollover
            </Button>
          </div>
          
          {session && (
            <div className="p-4 border rounded-lg bg-muted">
              <h3 className="font-medium mb-2">Active Session</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Status: <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>{session.status}</Badge></div>
                <div>Account: {session.accountId}</div>
                <div>Scopes: {session.scope.join(', ')}</div>
                <div>Ends: {new Date(session.endsAt).toLocaleString()}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Place Order (Demo)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="asset">Asset</Label>
              <Input
                id="asset"
                value={asset}
                onChange={e => setAsset(e.target.value)}
                placeholder="VTI"
              />
            </div>
            
            <div>
              <Label htmlFor="qty">Quantity</Label>
              <Input
                id="qty"
                type="number"
                value={qty}
                onChange={e => setQty(Number(e.target.value || 0))}
              />
            </div>
            
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={e => setPrice(Number(e.target.value || 0))}
              />
            </div>
          </div>
          
          <div className="p-3 bg-muted rounded-lg text-sm">
            <div>Total: ${(qty * price).toLocaleString()}</div>
          </div>
          
          <Button onClick={trade} disabled={!session} className="w-full">
            Submit Order
          </Button>
        </CardContent>
      </Card>
      
      {session && session.status === 'active' && (
        <SessionBar endsAt={session.endsAt} />
      )}
    </div>
  );
}