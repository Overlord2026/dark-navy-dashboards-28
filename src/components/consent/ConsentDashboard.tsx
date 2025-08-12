// @ts-nocheck
import { useState, useEffect } from 'react';
import { Shield, Clock, AlertCircle, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePersonaAuth } from '@/hooks/usePersonaAuth';
import PersonaSwitcher from './PersonaSwitcher';
import XRAttestationModal from './XRAttestationModal';
import { toast } from 'sonner';

export default function ConsentDashboard() {
  const { 
    currentPersona, 
    consentTokens, 
    revokeConsentToken,
    createConsentToken 
  } = usePersonaAuth();
  const [recentReceipts, setRecentReceipts] = useState<any[]>([]);

  useEffect(() => {
    // Load recent reason receipts
    const loadReceipts = async () => {
      if (!currentPersona) return;
      
      // This would typically load from the database
      // For now, we'll use mock data
      setRecentReceipts([
        {
          id: '1',
          action_key: 'persona_switch',
          reason_code: 'PERSONA_SWITCH_OK',
          explanation: 'Switched to advisor persona',
          created_at: new Date().toISOString(),
          hash: 'sha256_abc123'
        },
        {
          id: '2',
          action_key: 'view_portfolio',
          reason_code: 'OK_POLICY',
          explanation: 'Portfolio access authorized',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          hash: 'sha256_def456'
        }
      ]);
    };

    loadReceipts();
  }, [currentPersona]);

  const handleRevokeConsent = async (tokenId: string) => {
    const success = await revokeConsentToken(tokenId, 'User requested revocation');
    if (success) {
      toast.success('Consent token revoked successfully');
    } else {
      toast.error('Failed to revoke consent token');
    }
  };

  const handleCreateConsent = async () => {
    const token = await createConsentToken(
      {
        jurisdiction: ['US', 'EU'],
        media: ['photo', 'video', 'audio'],
        likeness: true,
        time: { 
          start: new Date().toISOString(), 
          end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() 
        },
        audience: ['training', 'research']
      },
      {
        training: true,
        disclosures: ['AI training usage', 'Research participation'],
        conflicts: []
      },
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    );

    if (token) {
      toast.success('Consent token created successfully');
    } else {
      toast.error('Failed to create consent token');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Consent & Authorization Dashboard</h1>
        <PersonaSwitcher />
      </div>

      {/* Current Persona Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Current Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentPersona ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Active Persona:</span>
                <Badge variant="default">{currentPersona.kind}</Badge>
              </div>
              <div className="flex items-center space-x-4">
                <XRAttestationModal />
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Audit Trail
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>No active persona session</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consent Tokens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Consent Tokens</span>
            </span>
            <Button onClick={handleCreateConsent} size="sm">
              Create Token
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {consentTokens.length === 0 ? (
              <p className="text-muted-foreground text-sm">No active consent tokens</p>
            ) : (
              consentTokens.map((token) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={token.status === 'active' ? 'default' : 'secondary'}
                      >
                        {token.status}
                      </Badge>
                      <span className="text-sm font-medium">
                        {token.scopes.media?.join(', ') || 'General consent'}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Valid until: {token.valid_to ? new Date(token.valid_to).toLocaleDateString() : 'No expiry'}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevokeConsent(token.id)}
                    disabled={token.status !== 'active'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Reason Receipts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReceipts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent activity</p>
            ) : (
              recentReceipts.map((receipt) => (
                <div
                  key={receipt.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{receipt.reason_code}</Badge>
                      <span className="text-sm font-medium">{receipt.action_key}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {receipt.explanation}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {new Date(receipt.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    {receipt.hash?.slice(0, 12)}...
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}