import React from 'react';
import { getSession, upsertSession } from '@/features/k401/delegated/store';
import { recordReceipt } from '@/features/receipts/record';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ClientApproveSession() {
  const [sessionId, setSessionId] = React.useState('');
  const [session, setSession] = React.useState<any>(null);
  
  async function load() { 
    setSession(await getSession(sessionId)); 
  }
  
  async function approve() {
    if (!session) return;
    
    session.status = 'active'; 
    session.approvedAt = new Date().toISOString();
    
    await upsertSession(session);
    
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'k401.delegated.session.approve', 
      reasons: [sessionId], 
      created_at: new Date().toISOString() 
    } as any);
    
    alert('Approved. Advisor now has time-boxed access.');
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approve Advisor Session</h1>
        <p className="text-muted-foreground">
          Review and approve your advisor's request for delegated access
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Approval</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sessionId">Session ID</Label>
            <Input
              id="sessionId"
              value={sessionId}
              onChange={e => setSessionId(e.target.value)}
              placeholder="Enter the session ID from advisor"
            />
          </div>
          
          <Button onClick={load} variant="outline">
            Load Session
          </Button>
          
          {session && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted">
                <h3 className="font-medium mb-2">Session Details</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Status: <Badge variant={session.status === 'pending' ? 'secondary' : 'default'}>{session.status}</Badge></div>
                  <div>Advisor: {session.advisorUserId}</div>
                  <div>Account: {session.accountId}</div>
                  <div>Scopes: {session.scope.join(', ')}</div>
                  <div>Ends: {new Date(session.endsAt).toLocaleString()}</div>
                </div>
              </div>
              
              {session.status === 'pending' && (
                <Button onClick={approve} className="w-full">
                  Approve Session
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}