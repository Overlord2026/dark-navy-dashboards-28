import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Crown, 
  FileText, 
  Package,
  Archive,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Gavel
} from 'lucide-react';
import { recordReceipt } from '@/features/receipts/record';
import { renderEstatePdf } from '@/lib/report/estatePdf';
import { buildBinderPack } from '@/features/estate/binder';
import { useEstateRules } from '@/features/estate/states/estateRules';
import { RecordingIntakeForm } from '@/features/estate/deeds/RecordingIntakeForm';
import { toast } from 'sonner';
import analytics from '@/lib/analytics';

const AttorneyEstateWorkbench = () => {
  const [activeTab, setActiveTab] = useState('conflict');
  const [clientData, setClientData] = useState({
    name: '',
    state: 'CA',
    matterType: 'estate_planning',
    conflictChecked: false,
    documentsGenerated: false
  });
  const [loading, setLoading] = useState(false);
  const [conflictResult, setConflictResult] = useState<'pass' | 'hit' | null>(null);

  const estateRules = useEstateRules(clientData.state);

  const handleConflictCheck = async () => {
    setLoading(true);
    try {
      // Mock conflict check - randomly pass/hit for demo
      const result = Math.random() > 0.8 ? 'hit' : 'pass';
      setConflictResult(result);
      
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'conflict.check',
        reasons: [result.toUpperCase()],
        inputs_hash: `sha256:conflict_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      setClientData(prev => ({...prev, conflictChecked: true}));
      analytics.track('attorney.estate.conflict.check', { result, client: clientData.name });
      toast.success(`Conflict check completed: ${result.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to run conflict check');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAuthority = async (role: 'POA' | 'Trustee' | 'Executor') => {
    setLoading(true);
    try {
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'authority.grant',
        reasons: ['AUTH_GRANT', role],
        inputs_hash: `sha256:auth_${role}_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      analytics.track('attorney.estate.authority.grant', { role });
      toast.success(`${role} authority granted and recorded`);
    } catch (error) {
      toast.error('Failed to grant authority');
    } finally {
      setLoading(false);
    }
  };

  const handleDraftDocuments = async () => {
    if (!clientData.conflictChecked || conflictResult === 'hit') {
      toast.error('Conflict check must pass before drafting');
      return;
    }
    
    setLoading(true);
    try {
      const tokens = {
        client_full_name: clientData.name,
        state_code: clientData.state,
        witnesses: String(estateRules.will.witnesses),
        notary_required: String(estateRules.will.notary),
        execution_date: new Date().toLocaleDateString()
      };

      // Generate documents with state rules
      const docs = ['Will', 'RLT', 'POA'];
      for (const docType of docs) {
        const pdfBytes = await renderEstatePdf(
          docType as 'Will' | 'RLT' | 'POA',
          tokens,
          estateRules
        );
        console.log(`Generated ${docType}:`, pdfBytes.length, 'bytes');
      }

      await recordReceipt({
        type: 'Decision-RDS',
        action: 'estate.doc.assemble',
        reasons: ['EXEC_RULE_APPLY'],
        inputs_hash: `sha256:draft_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);

      setClientData(prev => ({...prev, documentsGenerated: true}));
      analytics.track('attorney.estate.assemble', { state: clientData.state });
      toast.success('Estate documents drafted with state compliance');
    } catch (error) {
      toast.error('Failed to draft documents');
    } finally {
      setLoading(false);
    }
  };

  const handleExecutionPackage = async () => {
    setLoading(true);
    try {
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'estate.exec.package.build',
        reasons: ['EXEC_PACKAGE'],
        inputs_hash: `sha256:exec_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      analytics.track('attorney.estate.execution.package');
      toast.success('Execution package prepared');
    } catch (error) {
      toast.error('Failed to build execution package');
    } finally {
      setLoading(false);
    }
  };

  const handleBinderExport = async () => {
    setLoading(true);
    try {
      const { zip, manifest } = await buildBinderPack({ clientId: clientData.name });
      
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'estate.binder.export',
        reasons: ['BINDER_EXPORT'],
        inputs_hash: `sha256:binder_attorney_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      // Create download
      const blob = new Blob([zip], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `estate_binder_${clientData.name}_${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      
      analytics.track('attorney.estate.binder.export', { manifestHash: manifest.hash });
      toast.success('Estate binder exported successfully');
    } catch (error) {
      toast.error('Failed to export binder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Attorney Estate Workbench</h1>
          <p className="text-muted-foreground">
            Professional estate planning with state compliance and Trust Rails
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="conflict">Conflict Check</TabsTrigger>
            <TabsTrigger value="authority">Authority</TabsTrigger>
            <TabsTrigger value="drafting">Drafting</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
            <TabsTrigger value="recording">Deed & Recording</TabsTrigger>
            <TabsTrigger value="binder">Binder</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="conflict" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Conflict Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={clientData.name}
                      onChange={(e) => setClientData(prev => ({...prev, name: e.target.value}))}
                      placeholder="Client full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="matterType">Matter Type</Label>
                    <Input
                      id="matterType"
                      value={clientData.matterType}
                      onChange={(e) => setClientData(prev => ({...prev, matterType: e.target.value}))}
                      placeholder="Estate planning"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <div>
                    <p className="font-medium">Run Conflict Check</p>
                    <p className="text-sm text-muted-foreground">
                      Required before beginning any legal work
                    </p>
                  </div>
                  <Button 
                    onClick={handleConflictCheck} 
                    disabled={loading || clientData.conflictChecked}
                  >
                    {clientData.conflictChecked ? 'Check Complete' : 'Run Check'}
                  </Button>
                </div>
                
                {conflictResult && (
                  <div className={`p-4 rounded-lg border ${
                    conflictResult === 'pass' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {conflictResult === 'pass' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        conflictResult === 'pass' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        Conflict Check: {conflictResult.toUpperCase()}
                      </span>
                    </div>
                    {conflictResult === 'hit' && (
                      <p className="text-sm text-red-700 mt-2">
                        Potential conflict detected. Review before proceeding.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authority" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Authority & Roles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Power of Attorney</h3>
                      <p className="text-sm text-muted-foreground">
                        Financial authority - {estateRules.poa.notary ? 'Notarization required' : 'Witnesses required'}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleGrantAuthority('POA')}
                      disabled={loading}
                    >
                      Record Grant
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Trustee Authority</h3>
                      <p className="text-sm text-muted-foreground">
                        Trust administration - {estateRules.rlt.notary ? 'Notarization required' : 'Simple execution'}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleGrantAuthority('Trustee')}
                      disabled={loading}
                    >
                      Record Grant
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Executor</h3>
                      <p className="text-sm text-muted-foreground">
                        Estate administration - {estateRules.will.witnesses} witnesses, {estateRules.will.notary ? 'notarization' : 'no notarization'}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleGrantAuthority('Executor')}
                      disabled={loading}
                    >
                      Record Grant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drafting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  State Module Drafting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">{clientData.state} Requirements</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Will: {estateRules.will.witnesses} witnesses, {estateRules.will.notary ? 'notarization required' : 'no notarization'}</li>
                    <li>• Trust: {estateRules.rlt.notary ? 'notarization required' : 'simple execution'}</li>
                    <li>• POA: {estateRules.poa.notary ? 'notarization required' : 'witnesses required'}</li>
                    {estateRules.communityProperty && <li>• Community property state</li>}
                    {estateRules.probateNotes && <li>• {estateRules.probateNotes}</li>}
                  </ul>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Generate Estate Documents</p>
                    <p className="text-sm text-muted-foreground">
                      State-compliant drafting with execution rules
                    </p>
                  </div>
                  <Button 
                    onClick={handleDraftDocuments} 
                    disabled={loading || !clientData.conflictChecked || conflictResult === 'hit'}
                  >
                    {clientData.documentsGenerated ? 'Documents Ready' : 'Draft Documents'}
                  </Button>
                </div>
                
                {clientData.documentsGenerated && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">Documents Generated</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Last Will and Testament ({clientData.state} compliant)</li>
                      <li>• Revocable Living Trust</li>
                      <li>• Financial Power of Attorney</li>
                      <li>• Execution checklist and state guidance</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="execution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Execution Package
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Build Execution Package</p>
                    <p className="text-sm text-muted-foreground">
                      State-specific signing instructions and coordination
                    </p>
                  </div>
                  <Button 
                    onClick={handleExecutionPackage} 
                    disabled={loading || !clientData.documentsGenerated}
                  >
                    Build Package
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Signing Requirements</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Client signature on all documents</li>
                      <li>• Witness coordination ({estateRules.will.witnesses} required)</li>
                      {estateRules.will.notary && <li>• Notary scheduling</li>}
                      {estateRules.rlt.spousalConsents && <li>• Spousal consents</li>}
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Post-Execution</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Trust funding coordination</li>
                      <li>• Beneficiary designation updates</li>
                      <li>• Document distribution</li>
                      <li>• Annual review scheduling</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recording" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5" />
                  Deed & Recording
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecordingIntakeForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="binder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  Binder Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Complete Estate Binder</p>
                    <p className="text-sm text-muted-foreground">
                      ZIP package with manifest hash and receipt trail
                    </p>
                  </div>
                  <Button onClick={handleBinderExport} disabled={loading}>
                    Export Binder
                  </Button>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Binder Contents</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• All executed estate planning documents</li>
                    <li>• Authority grants and role assignments</li>
                    <li>• State execution compliance certificates</li>
                    <li>• Trust Rails receipt history (content-free)</li>
                    <li>• Manifest with cryptographic hash</li>
                    <li>• Optional: Blockchain anchor proof</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Billing & Settlement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium mb-2">Settlement-RDS Integration</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Future: Attach Settlement-RDS for paid legal invoices
                  </p>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AttorneyEstateWorkbench;