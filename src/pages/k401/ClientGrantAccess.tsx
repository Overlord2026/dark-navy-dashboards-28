import React from 'react';
import { upsertGrant } from '@/features/k401/delegated/store';
import { recordReceipt } from '@/features/receipts/record';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ClientGrantAccess() {
  const [accountId, setAccountId] = React.useState('');          // pick from client's 401k accounts
  const [advisorUserId, setAdvisorUserId] = React.useState('ADV1');
  const [scopes, setScopes] = React.useState<string[]>(['read']);
  const [maxUsd, setMaxUsd] = React.useState(25000);
  const [whitelist, setWhitelist] = React.useState('VTI,AGG,FXAIX'); // comma list
  const [dual, setDual] = React.useState(true);
  const [duration, setDuration] = React.useState(30);

  async function grant() {
    const g = await upsertGrant({
      grantId: crypto.randomUUID(),
      accountId,
      clientUserId: 'ME', 
      advisorUserId,
      scopes: (scopes.includes('trade') ? ['read', 'trade'] : ['read']) as any,
      policy: { 
        maxUsdPerDay: maxUsd, 
        assetWhitelist: whitelist.split(',').map(s => s.trim()).filter(Boolean), 
        dualApproval: dual, 
        durationMinutes: duration 
      },
      status: 'granted',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString()       // grant valid 7 days, each session time-boxed shorter
    });
    
    await recordReceipt({ 
      type: 'Consent-RDS', 
      scope: { 'k401.delegated': [g.accountId, g.advisorUserId, g.scopes.join('|')] }, 
      result: 'approve', 
      created_at: new Date().toISOString() 
    } as any);
    
    alert('Delegated access granted.');
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Grant Advisor Access</h1>
        <p className="text-muted-foreground">
          Allow your advisor time-boxed, scope-limited access to your 401(k) account
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="accountId">401(k) Account ID</Label>
              <Input
                id="accountId"
                value={accountId}
                onChange={e => setAccountId(e.target.value)}
                placeholder="Enter your 401(k) account ID"
              />
            </div>
            
            <div>
              <Label htmlFor="advisorUserId">Advisor User ID</Label>
              <Input
                id="advisorUserId"
                value={advisorUserId}
                onChange={e => setAdvisorUserId(e.target.value)}
                placeholder="Enter advisor's user ID"
              />
            </div>
            
            <div>
              <Label>Access Scopes</Label>
              <div className="flex gap-2 mt-2">
                <Badge 
                  variant={scopes.includes('read') ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    if (!scopes.includes('read')) {
                      setScopes([...scopes, 'read']);
                    }
                  }}
                >
                  Read Access
                </Badge>
                <Badge 
                  variant={scopes.includes('trade') ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    if (scopes.includes('trade')) {
                      setScopes(scopes.filter(s => s !== 'trade'));
                    } else {
                      setScopes([...scopes, 'trade']);
                    }
                  }}
                >
                  Trade Access
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxUsd">Max USD/day</Label>
              <Input
                id="maxUsd"
                type="number"
                value={maxUsd}
                onChange={e => setMaxUsd(Number(e.target.value || 0))}
              />
            </div>
            
            <div>
              <Label htmlFor="duration">Trade window (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={e => setDuration(Number(e.target.value || 0))}
              />
            </div>
            
            <div className="flex items-center space-x-2 mt-6">
              <input
                type="checkbox"
                id="dual"
                checked={dual}
                onChange={e => setDual(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="dual">Require my approval per trade</Label>
            </div>
          </div>
          
          <div>
            <Label htmlFor="whitelist">Asset whitelist (tickers)</Label>
            <Input
              id="whitelist"
              value={whitelist}
              onChange={e => setWhitelist(e.target.value)}
              placeholder="VTI,AGG,FXAIX"
            />
          </div>
          
          <Button onClick={grant} className="w-full">
            Grant Access
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}