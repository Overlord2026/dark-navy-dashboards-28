import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Download, QrCode, FileText, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import analytics from '@/lib/analytics';
import { recordReceipt } from '@/features/receipts/record';
import { ProofStrip } from '@/components/ui/ProofStrip';
import { BeneficiaryCenter } from '@/components/estate/BeneficiaryCenter';
import { buildBinderPack } from '@/features/estate/binder';
import { makeAuthorityGrantPdf } from '@/lib/report/authorityPdf';
import type { AuthorityGrant, BeneficiaryMismatch } from '@/features/estate/types';

export default function EstateWorkbench() {
  const navigate = useNavigate();
  const [lastReceiptId, setLastReceiptId] = useState<string | null>(null);
  const [authorities] = useState<AuthorityGrant[]>([
    {
      id: 'auth_1',
      clientId: 'demo-client',
      role: 'POA',
      subjectId: 'john-doe',
      createdAt: new Date().toISOString(),
    },
  ]);
  
  const [mismatches] = useState<BeneficiaryMismatch[]>([
    {
      accountId: 'acc_401k',
      intent: 'Spouse (Primary), Children (Contingent)',
      current: 'Mother (Primary)',
      fixSuggestion: 'Update to spouse as primary beneficiary',
    },
  ]);

  const handleAuthorityGrant = async (role: string) => {
    // Record Decision-RDS receipt
    const receipt = await recordReceipt({
      id: `receipt_${Date.now()}`,
      type: 'Decision-RDS',
      action: 'authority.grant',
      policy_version: 'E-2025.08',
      inputs_hash: `sha256:auth_${Date.now()}`,
      reasons: ['AUTH_GRANT'],
      created_at: new Date().toISOString(),
    });

    setLastReceiptId(receipt.id);

    // Generate QR URL and PDF
    const minViewUrl = `${window.location.origin}/estate/verify/${receipt.id}`;
    const pdfBytes = await makeAuthorityGrantPdf({
      role,
      subject: 'John Doe',
      minViewUrl,
    });

    // Download PDF
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `authority-grant-${role.toLowerCase()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);

    analytics.track('estate.authority.grant', { role });
  };

  const handleBeneficiaryFix = async (mismatch: BeneficiaryMismatch) => {
    // Record Decision-RDS receipt
    const receipt = await recordReceipt({
      id: `receipt_${Date.now()}`,
      type: 'Decision-RDS',
      action: 'beneficiary.fix',
      policy_version: 'E-2025.08',
      inputs_hash: `sha256:ben_${Date.now()}`,
      reasons: ['BENEFICIARY_WARN', 'BENEFICIARY_FIX'],
      created_at: new Date().toISOString(),
    });

    setLastReceiptId(receipt.id);

    // Generate form letter
    const letterContent = `Dear Plan Administrator,

Please update the beneficiary designation for account ${mismatch.accountId}:

Current: ${mismatch.current}
Requested: ${mismatch.intent}

Reason: ${mismatch.fixSuggestion}

Thank you.`;

    const blob = new Blob([letterContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beneficiary-fix-${mismatch.accountId}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    analytics.track('estate.beneficiary.fix', { accountId: mismatch.accountId });
  };

  const handleSurvivorshipRun = async () => {
    // Record Decision-RDS receipt
    const receipt = await recordReceipt({
      id: `receipt_${Date.now()}`,
      type: 'Decision-RDS',
      action: 'estate.run',
      policy_version: 'E-2025.08',
      inputs_hash: `sha256:surv_${Date.now()}`,
      reasons: ['ESTATE_RUN'],
      created_at: new Date().toISOString(),
    });

    setLastReceiptId(receipt.id);
    analytics.track('estate.survivorship.run');
  };

  const handleBinderExport = async () => {
    try {
      const { zip, manifest } = await buildBinderPack({
        clientId: 'demo-client',
      });

      // Record Decision-RDS receipt
      const receipt = await recordReceipt({
        id: `receipt_${Date.now()}`,
        type: 'Decision-RDS',
        action: 'estate.binder.export',
        policy_version: 'E-2025.08',
        inputs_hash: `sha256:binder_${Date.now()}`,
        reasons: ['BINDER_EXPORT'],
        created_at: new Date().toISOString(),
      });

      setLastReceiptId(receipt.id);

      // Download binder ZIP
      const blob = new Blob([zip], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `estate-binder-${new Date().toISOString().split('T')[0]}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      analytics.track('export.click', {
        kind: 'zip',
        toolKey: 'estate-binder',
      });
    } catch (error) {
      console.error('Binder export failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/family')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Family Home
            </Button>
            <h1 className="text-xl font-semibold text-foreground">
              Estate Workbench
            </h1>
            <Badge variant="outline" className="text-xs">
              Family Context
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="diagram" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="diagram">Entity Map</TabsTrigger>
            <TabsTrigger value="authority">Authority & Roles</TabsTrigger>
            <TabsTrigger value="beneficiary">Beneficiary Center</TabsTrigger>
            <TabsTrigger value="survivorship">Survivorship & Tax</TabsTrigger>
            <TabsTrigger value="binder">Binder Export</TabsTrigger>
          </TabsList>

          <TabsContent value="diagram" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Entity & Trust Map</h3>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  Interactive entity diagram would be rendered here
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">
                  2 accounts flagged for probate risk
                </span>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="authority" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Authority Grants</h3>
              <div className="space-y-4">
                {authorities.map((auth) => (
                  <div key={auth.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{auth.role}</p>
                      <p className="text-sm text-muted-foreground">Subject: {auth.subjectId}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(auth.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAuthorityGrant(auth.role)}
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        QR Pass
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAuthorityGrant(auth.role)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAuthorityGrant('POA')}
                    variant="outline"
                  >
                    Add POA
                  </Button>
                  <Button
                    onClick={() => handleAuthorityGrant('Trustee')}
                    variant="outline"
                  >
                    Add Trustee
                  </Button>
                  <Button
                    onClick={() => handleAuthorityGrant('Executor')}
                    variant="outline"
                  >
                    Add Executor
                  </Button>
                </div>
              </div>

              {lastReceiptId && (
                <ProofStrip
                  lastReceiptId={lastReceiptId}
                  anchored={false}
                  className="mt-4"
                />
              )}
            </Card>
          </TabsContent>

          <TabsContent value="beneficiary" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Beneficiary Center</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor and fix beneficiary designations across accounts
                </p>
              </div>
            </div>
            
            <BeneficiaryCenter clientId="current-client-id" />
            
            {lastReceiptId && (
              <ProofStrip
                lastReceiptId={lastReceiptId}
                anchored={false}
                className="mt-4"
              />
            )}
          </TabsContent>

          <TabsContent value="survivorship" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Survivorship & Tax Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Federal Estate Tax</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>2024 Exemption</span>
                        <span>$13.61M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Estate</span>
                        <span>$8.2M</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Federal Tax</span>
                        <span className="text-green-600">$0</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">State Estate Tax</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>State</span>
                        <span>New York</span>
                      </div>
                      <div className="flex justify-between">
                        <span>NY Exemption</span>
                        <span>$6.58M</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Estimated NY Tax</span>
                        <span className="text-amber-600">$128,000</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Probate Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Probate Assets</span>
                        <span>$2.1M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Probate Costs</span>
                        <span>$65,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timeline</span>
                        <span>8-12 months</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Portability Election</h4>
                    <div className="text-sm text-muted-foreground">
                      Consider portable exemption for surviving spouse
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSurvivorshipRun} className="mt-6">
                Run Full Analysis
              </Button>

              {lastReceiptId && (
                <ProofStrip
                  lastReceiptId={lastReceiptId}
                  anchored={false}
                  className="mt-4"
                />
              )}
            </Card>
          </TabsContent>

          <TabsContent value="binder" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Estate Binder Export</h3>
              
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Binder Contents</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Estate planning summary</li>
                    <li>• Authority grant documents</li>
                    <li>• Beneficiary forms and analysis</li>
                    <li>• Tax planning worksheets</li>
                    <li>• Trust and entity diagrams</li>
                    <li>• Receipt manifest with verification hashes</li>
                  </ul>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleBinderExport}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Binder ZIP
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Includes manifest and integrity hashes
                  </div>
                </div>
              </div>

              {lastReceiptId && (
                <ProofStrip
                  lastReceiptId={lastReceiptId}
                  anchored={false}
                  className="mt-4"
                />
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}