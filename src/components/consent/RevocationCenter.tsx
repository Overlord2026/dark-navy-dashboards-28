// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RefreshCw, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function RevocationCenter() {
  const [consents, setConsents] = useState([]);
  const [revocations, setRevocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch user's consent tokens
      const { data: consentData, error: consentError } = await supabase
        .from('consent_tokens')
        .select('*')
        .order('created_at', { ascending: false });

      if (consentError) throw consentError;

      // Fetch revocation history
      const { data: revocationData, error: revocationError } = await supabase
        .from('revocations')
        .select(`
          *,
          consent_tokens (
            id,
            scopes,
            subject_user,
            issuer_user,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (revocationError) throw revocationError;

      setConsents(consentData || []);
      setRevocations(revocationData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load consent data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRevoke = async (consentId: string, reason: string) => {
    setRevoking(consentId);
    try {
      const { data, error } = await supabase.functions.invoke('propagate-revocation', {
        body: { consent_id: consentId, reason }
      });

      if (error) throw error;

      toast.success(`Consent revoked. ${data.affected_items} items affected.`);
      await fetchData(); // Refresh data
      
    } catch (error) {
      console.error('Error revoking consent:', error);
      toast.error(error.message || 'Failed to revoke consent');
    } finally {
      setRevoking(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'revoked':
        return <Badge variant="destructive">Revoked</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatScopes = (scopes: any) => {
    if (!scopes) return [];
    return [
      `${scopes.jurisdiction || 'Any'} jurisdiction`,
      `${scopes.product || 'Any'} product`,
      `${scopes.time || 'Unlimited'} duration`,
      `${scopes.audience || 'Public'} audience`,
      ...(scopes.exclusivity ? ['Exclusive'] : []),
      ...(scopes.training_data ? ['AI Training'] : [])
    ];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Consent Revocation Center</h2>
        <Button 
          onClick={fetchData} 
          disabled={loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Active Consents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Active Consent Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consents
              .filter(consent => consent.status === 'active')
              .map((consent) => (
                <div key={consent.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(consent.status)}
                        <span className="text-sm text-muted-foreground">
                          Issued {new Date(consent.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {formatScopes(consent.scopes).map((scope, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {scope}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-xs text-muted-foreground font-mono">
                        ID: {consent.id}
                      </div>
                    </div>

                    <RevokeDialog 
                      consentId={consent.id}
                      onRevoke={handleRevoke}
                      isRevoking={revoking === consent.id}
                    >
                      <Button 
                        variant="destructive" 
                        size="sm"
                        disabled={revoking === consent.id}
                      >
                        {revoking === consent.id ? 'Revoking...' : 'Revoke'}
                      </Button>
                    </RevokeDialog>
                  </div>
                </div>
              ))}

            {consents.filter(consent => consent.status === 'active').length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No active consent tokens found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revocation History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            Revocation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revocations.map((revocation) => (
              <div key={revocation.id} className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Revoked</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(revocation.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <Badge variant={revocation.propagated ? "default" : "secondary"}>
                    {revocation.propagated ? 'Propagated' : 'Pending'}
                  </Badge>
                </div>

                {revocation.reason && (
                  <p className="text-sm mb-2">{revocation.reason}</p>
                )}

                <div className="text-xs text-muted-foreground font-mono">
                  Consent ID: {revocation.consent_id}
                </div>
              </div>
            ))}

            {revocations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No revocations found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface RevokeDialogProps {
  consentId: string;
  onRevoke: (consentId: string, reason: string) => void;
  isRevoking: boolean;
  children: React.ReactNode;
}

function RevokeDialog({ consentId, onRevoke, isRevoking, children }: RevokeDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRevoke(consentId, reason);
    setOpen(false);
    setReason('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Revoke Consent Token
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              This action will revoke the consent token and propagate takedown notices 
              to all affected systems. This cannot be undone.
            </p>
          </div>

          <div>
            <Label htmlFor="reason">Reason for Revocation</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for revoking this consent..."
              required
            />
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="destructive" 
              disabled={isRevoking || !reason.trim()}
              className="flex-1"
            >
              {isRevoking ? 'Revoking...' : 'Revoke Consent'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}