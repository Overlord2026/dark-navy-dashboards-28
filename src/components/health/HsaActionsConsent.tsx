import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Download, Share2, FileText, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { recordHealthRDS } from '@/features/healthcare/receipts';
import { useConsentEnforcement, type ConsentEnforcementResult } from '@/features/health/consent/middleware';
import { toast } from 'sonner';

export default function HsaActions() {
  const [lastAction, setLastAction] = useState<string>('');
  const [actionReceipt, setActionReceipt] = useState<any>(null);
  const [consentDenied, setConsentDenied] = useState<ConsentEnforcementResult | null>(null);

  // Consent enforcement for HSA data sharing
  const hsaShareConsent = useConsentEnforcement({
    purpose: 'billing',
    minimumScope: ['hsa_contributions', 'tax_documents'],
    entities: ['cpa', 'tax_preparer']
  });

  // Consent enforcement for export operations  
  const hsaExportConsent = useConsentEnforcement({
    purpose: 'care_coordination',
    minimumScope: ['hsa_records', 'contribution_history']
  });

  const exportHsaReceipts = () => {
    const result = hsaExportConsent.executeWithConsent(
      (disclosures) => {
        // Export with consent-approved disclosures
        const receipt = recordHealthRDS(
          'hsa.export',
          { format: 'pdf', year: 2024 },
          'allow',
          ['HSA records exported with consent', 'HIPAA minimum necessary applied'],
          disclosures, // Include consent disclosures
          { estimated_cost_cents: 0 }
        );
        
        setLastAction('Export HSA Receipts');
        setActionReceipt(receipt);
        setConsentDenied(null);
        
        toast.success('HSA receipts exported successfully with HIPAA compliance');
        return receipt;
      },
      (denialResult) => {
        setConsentDenied(denialResult);
        toast.error(`Export blocked: ${denialResult.blockedReason}`);
      }
    );
  };

  const shareWithCPA = () => {
    const result = hsaShareConsent.executeWithConsent(
      (disclosures) => {
        // Share with consent-approved disclosures
        const receipt = recordHealthRDS(
          'hsa.share.cpa',
          { recipient: 'cpa', data_scope: 'contributions_only' },
          'allow',
          ['HSA data shared with CPA', 'Limited to contribution records only'],
          disclosures, // Include consent disclosures
          { estimated_cost_cents: 0 }
        );
        
        setLastAction('Share with CPA');
        setActionReceipt(receipt);
        setConsentDenied(null);
        
        toast.success('HSA data shared with CPA with proper consent');
        return receipt;
      },
      (denialResult) => {
        setConsentDenied(denialResult);
        toast.error(`Sharing blocked: ${denialResult.blockedReason}`);
      }
    );
  };

  const simulateExpiredConsent = () => {
    // Simulate an expired consent scenario by checking an expired consent
    const expiredConsentResult = hsaExportConsent.checkConsent();
    if (!expiredConsentResult.allowed && expiredConsentResult.consentRDS) {
      setConsentDenied(expiredConsentResult);
      toast.error('Simulated expired consent scenario');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            HSA Actions
          </CardTitle>
          <CardDescription>
            Health Savings Account operations with HIPAA consent enforcement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {consentDenied && (
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Consent Required:</strong> {consentDenied.blockedReason}
                {consentDenied.consentRDS && (
                  <div className="mt-2 text-xs">
                    Consent-RDS recorded: {consentDenied.consentRDS.proof_hash.substring(0, 16)}...
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={exportHsaReceipts}
              className="flex items-center gap-2"
              variant="default"
            >
              <Download className="h-4 w-4" />
              Export HSA Receipts
            </Button>
            
            <Button 
              onClick={shareWithCPA}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Share2 className="h-4 w-4" />
              Share with CPA
            </Button>
          </div>

          <Separator />

          <div>
            <Button 
              onClick={simulateExpiredConsent}
              className="flex items-center gap-2"
              variant="secondary"
              size="sm"
            >
              <AlertTriangle className="h-4 w-4" />
              Test Expired Consent
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Simulate expired consent scenario for testing
            </p>
          </div>
        </CardContent>
      </Card>

      {actionReceipt && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Action Receipt
            </CardTitle>
            <CardDescription>
              Health-RDS for: {lastAction}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Type:</span> {actionReceipt.type}
              </div>
              <div>
                <span className="font-medium">Action:</span> {actionReceipt.action}
              </div>
              <div>
                <span className="font-medium">Result:</span>
                <Badge variant={actionReceipt.result === 'allow' ? 'default' : 'destructive'} className="ml-2">
                  {actionReceipt.result}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Policy:</span> {actionReceipt.policy_version}
              </div>
            </div>

            <Separator />

            <div>
              <div className="font-medium text-sm mb-2">Reasons ({actionReceipt.reasons.length})</div>
              <div className="space-y-1">
                {actionReceipt.reasons.map((reason: string, index: number) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    • {reason}
                  </div>
                ))}
              </div>
            </div>

            {actionReceipt.disclosures && actionReceipt.disclosures.length > 0 && (
              <div>
                <div className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  HIPAA Disclosures ({actionReceipt.disclosures.length})
                </div>
                <div className="space-y-1">
                  {actionReceipt.disclosures.map((disclosure: string, index: number) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {disclosure}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground">
                Receipt Hash: {actionReceipt.inputs_hash}
              </div>
              <div className="text-xs text-muted-foreground">
                Timestamp: {new Date(actionReceipt.ts).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}