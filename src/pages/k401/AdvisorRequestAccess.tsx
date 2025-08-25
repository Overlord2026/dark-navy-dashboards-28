import React from 'react';
import { getGrant, upsertSession } from '@/features/k401/delegated/store';
import { recordReceipt } from '@/features/receipts/record';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    
    const s = await upsertSession({ 
      sessionId: crypto.randomUUID(), 
      grantId, 
      accountId: grant.accountId, 
      advisorUserId: grant.advisorUserId, 
      startedAt: new Date(now).toISOString(), 
      endsAt: new Date(ends).toISOString(), 
      scope: grant.scopes, 
      status: 'pending' 
    });
    
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'k401.delegated.session.start', 
      reasons: [s.sessionId, grantId], 
      created_at: new Date().toISOString() 
    } as any);
    
    alert(`Session requested. Ask client to approve in-app. Session ID: ${s.sessionId}`);
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Request Delegated Session</h1>
        <p className="text-muted-foreground">
          Request access to client's 401(k) account with pre-approved permissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="grantId">Grant ID</Label>
            <Input
              id="grantId"
              value={grantId}
              onChange={e => setGrantId(e.target.value)}
              placeholder="Enter the grant ID from client"
            />
          </div>
          
          <Button onClick={load} variant="outline">
            Load Grant
          </Button>
          
          {grant && (
            <div className="p-4 border rounded-lg bg-muted">
              <h3 className="font-medium mb-2">Grant Details</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Scopes: {grant.scopes.join(', ')}</div>
                <div>Window: {grant.policy.durationMinutes} minutes</div>
                <div>Dual approval: {String(grant.policy.dualApproval)}</div>
                <div>Max USD/day: ${grant.policy.maxUsdPerDay?.toLocaleString()}</div>
                <div>Asset whitelist: {grant.policy.assetWhitelist?.join(', ') || 'None'}</div>
              </div>
            </div>
          )}
          
          <Button onClick={start} disabled={!grant} className="w-full">
            Start Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}