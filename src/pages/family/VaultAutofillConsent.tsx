import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, FileCheck, Settings, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  DEFAULT_SCOPES, 
  SCOPE_DESCRIPTIONS, 
  grantConsent, 
  revokeConsent, 
  getConsent,
  type AutofillScope,
  type AutofillConsent 
} from '@/features/vault/autofill/scopes';
import { recordReceipt } from '@/features/receipts/record';

export default function VaultAutofillConsent() {
  const { toast } = useToast();
  const [clientId] = useState('demo-client-123'); // TODO: Get from auth context
  const [consent, setConsent] = useState<AutofillConsent | null>(null);
  const [enabledScopes, setEnabledScopes] = useState<AutofillScope[]>([]);
  const [ttlDays, setTtlDays] = useState<number>(365);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing consent
    const existingConsent = getConsent(clientId);
    if (existingConsent) {
      setConsent(existingConsent);
      setEnabledScopes(existingConsent.scopes);
      setTtlDays(existingConsent.ttlDays || 365);
    } else {
      // Default to recommended scopes
      setEnabledScopes(DEFAULT_SCOPES);
    }
  }, [clientId]);

  const toggleScope = (scope: AutofillScope) => {
    setEnabledScopes(prev => 
      prev.includes(scope) 
        ? prev.filter(s => s !== scope)
        : [...prev, scope]
    );
  };

  const handleGrantConsent = async () => {
    if (enabledScopes.length === 0) {
      toast({
        title: 'No Scopes Selected',
        description: 'Please select at least one auto-populate scope.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const newConsent: AutofillConsent = {
        clientId,
        grantedBy: 'current-user-id', // TODO: Get from auth
        grantedAt: new Date().toISOString(),
        scopes: enabledScopes,
        ttlDays
      };

      grantConsent(newConsent);
      setConsent(newConsent);

      // Log Consent-RDS
      await recordReceipt({
        type: 'Consent-RDS',
        scope: { 'vault.autopopulate': enabledScopes },
        result: 'approve',
        expiry: ttlDays ? new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString() : undefined,
        purpose_of_use: 'estate_document_auto_population',
        minimum_necessary: true,
        created_at: new Date().toISOString()
      } as any);

      toast({
        title: 'Consent Granted',
        description: `Auto-populate enabled for ${enabledScopes.length} scope(s).`,
      });

    } catch (error) {
      console.error('Failed to grant consent:', error);
      toast({
        title: 'Error',
        description: 'Failed to grant consent. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeConsent = async () => {
    setLoading(true);
    try {
      revokeConsent(clientId);
      setConsent(null);

      // Log Consent-RDS revocation
      await recordReceipt({
        type: 'Consent-RDS',
        scope: { 'vault.autopopulate': consent?.scopes || [] },
        result: 'revoke',
        purpose_of_use: 'estate_document_auto_population',
        created_at: new Date().toISOString()
      } as any);

      toast({
        title: 'Consent Revoked',
        description: 'Auto-populate has been disabled for all document sources.',
      });

    } catch (error) {
      console.error('Failed to revoke consent:', error);
      toast({
        title: 'Error',
        description: 'Failed to revoke consent. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-surface min-h-screen">
      <div className="container mx-auto py-6 max-w-4xl pt-[var(--header-stack)]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 text-white">Vault Auto-Populate Settings</h1>
          <p className="text-white/80">
            Control how estate planning documents are automatically added to your secure vault.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Current Status */}
          <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5 text-bfo-gold" />
                Current Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {consent ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="mb-2 bg-bfo-gold text-black">Active</Badge>
                      <p className="text-sm text-white/80">
                        Auto-populate enabled for {consent.scopes.length} source(s)
                      </p>
                    </div>
                    <Button variant="outline" onClick={handleRevokeConsent} disabled={loading} className="border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black">
                      Revoke All Permissions
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-bfo-gold" />
                      Granted: {new Date(consent.grantedAt).toLocaleDateString()}
                    </span>
                    {consent.ttlDays && (
                      <span>
                        Expires: {new Date(new Date(consent.grantedAt).getTime() + consent.ttlDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Badge variant="secondary" className="mb-2 bg-white/20 text-white">Inactive</Badge>
                  <p className="text-sm text-white/80">
                    Auto-populate is currently disabled. Grant permission below to enable automatic document ingestion.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scope Configuration */}
          <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="h-5 w-5 text-bfo-gold" />
                Document Sources
              </CardTitle>
              <CardDescription className="text-white/80">
                Choose which types of documents can be automatically added to your vault.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {Object.entries(SCOPE_DESCRIPTIONS).map(([scope, description]) => (
                  <div key={scope} className="flex items-center justify-between space-x-4 p-4 border border-bfo-gold/30 rounded-lg bg-black/20">
                    <div className="flex-1">
                      <Label htmlFor={scope} className="font-medium text-white">
                        {scope.replace('estate.', '').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </Label>
                      <p className="text-sm text-white/80 mt-1">
                        {description}
                      </p>
                    </div>
                    <Switch
                      id={scope}
                      checked={enabledScopes.includes(scope as AutofillScope)}
                      onCheckedChange={() => toggleScope(scope as AutofillScope)}
                      disabled={!!consent} // Disable if already granted
                    />
                  </div>
                ))}
              </div>

              <Separator className="bg-bfo-gold/30" />

              {/* TTL Configuration */}
              <div className="space-y-4">
                <Label className="text-base font-medium text-white">Permission Duration</Label>
                <div className="flex items-center gap-4">
                  <Label htmlFor="ttl-365" className="flex items-center gap-2 text-white">
                    <input 
                      type="radio" 
                      id="ttl-365"
                      name="ttl"
                      checked={ttlDays === 365}
                      onChange={() => setTtlDays(365)}
                      disabled={!!consent}
                    />
                    1 Year (Recommended)
                  </Label>
                  <Label htmlFor="ttl-permanent" className="flex items-center gap-2 text-white">
                    <input 
                      type="radio" 
                      id="ttl-permanent"
                      name="ttl"
                      checked={ttlDays === 0}
                      onChange={() => setTtlDays(0)}
                      disabled={!!consent}
                    />
                    Permanent
                  </Label>
                </div>
              </div>

              {!consent && (
                <div className="pt-4">
                  <Button 
                    onClick={handleGrantConsent} 
                    disabled={loading || enabledScopes.length === 0}
                    className="w-full bg-bfo-gold text-black hover:bg-bfo-gold/90"
                  >
                    {loading ? 'Granting Permission...' : 'Grant Auto-Populate Permission'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Information */}
          <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileCheck className="h-5 w-5 text-bfo-gold" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 text-sm">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5 border-bfo-gold text-bfo-gold">1</Badge>
                  <div>
                    <p className="font-medium text-white">Automatic Detection</p>
                    <p className="text-white/80">
                      When estate documents are completed (notarized, attorney-reviewed, etc.), they're automatically detected.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5 border-bfo-gold text-bfo-gold">2</Badge>
                  <div>
                    <p className="font-medium text-white">Classification & Organization</p>
                    <p className="text-white/80">
                      Documents are classified by type, normalized with consistent naming, and organized into appropriate folders.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5 border-bfo-gold text-bfo-gold">3</Badge>
                  <div>
                    <p className="font-medium text-white">Secure Storage</p>
                    <p className="text-white/80">
                      Files are stored in your WORM (Write-Once, Read-Many) vault with optional blockchain anchoring for integrity.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5 border-bfo-gold text-bfo-gold">4</Badge>
                  <div>
                    <p className="font-medium text-white">Audit Trail</p>
                    <p className="text-white/80">
                      All actions are logged with content-free receipts for compliance and transparency.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}