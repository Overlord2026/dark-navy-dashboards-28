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
  Heart
} from 'lucide-react';
import { recordReceipt } from '@/features/receipts/record';
import { renderHealthcarePdf } from '@/lib/report/healthPdf';
import { buildBinderPack } from '@/features/estate/binder';
import { useHealthcareRules } from '@/features/estate/states/estateRules';
import { toast } from 'sonner';
import analytics from '@/lib/analytics';

const HealthcareProWorkbench = () => {
  const [activeTab, setActiveTab] = useState('conflict');
  const [clientData, setClientData] = useState({
    name: '',
    state: 'CA',
    matterType: 'healthcare_planning',
    conflictChecked: false,
    documentsGenerated: false
  });
  const [loading, setLoading] = useState(false);
  const [conflictResult, setConflictResult] = useState<'pass' | 'hit' | null>(null);
  const [selectedForms, setSelectedForms] = useState<string[]>([]);

  const healthRules = useHealthcareRules(clientData.state);

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
        inputs_hash: `sha256:conflict_healthcare_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      setClientData(prev => ({...prev, conflictChecked: true}));
      analytics.track('attorney.healthcare.conflict.check', { result, client: clientData.name });
      toast.success(`Conflict check completed: ${result.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to run conflict check');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAuthority = async (role: string) => {
    setLoading(true);
    try {
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'authority.grant',
        reasons: ['AUTH_GRANT', role],
        inputs_hash: `sha256:auth_healthcare_${role}_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      analytics.track('attorney.healthcare.authority.grant', { role });
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
        witness_count: String(healthRules.witnesses),
        notary_required: String(healthRules.notaryRequired),
        terminology: healthRules.surrogateTerminology || 'Health Care Agent',
        jurat_block: healthRules.notarizationText || '',
        witness_eligibility: healthRules.witnessEligibility || '',
        special_notes: healthRules.specialNotes || '',
        date: new Date().toLocaleDateString(),
        agent_name: 'To be determined',
        agent_address: 'To be provided',
        agent_phone: 'To be provided'
      };

      // Generate documents based on state requirements
      const formsToGenerate = selectedForms.length > 0 ? selectedForms : healthRules.healthcareForms;
      
      for (const formType of formsToGenerate) {
        const pdfBytes = await renderHealthcarePdf(
          formType as 'AdvanceDirective' | 'LivingWill' | 'HealthcarePOA' | 'HIPAA' | 'Surrogate',
          tokens,
          healthRules
        );
        
        // Save to Vault
        await recordReceipt({
          type: 'Vault-RDS',
          action: 'HEALTHCARE_PDF_STORE',
          reasons: [formType],
          inputs_hash: `sha256:${formType}_attorney_${Date.now()}`,
          created_at: new Date().toISOString()
        } as any);
        
        console.log(`Generated ${formType}:`, pdfBytes.length, 'bytes');
      }

      await recordReceipt({
        type: 'Decision-RDS',
        action: 'healthcare.doc.assemble',
        reasons: ['EXEC_RULE_APPLY'],
        inputs_hash: `sha256:healthcare_draft_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);

      setClientData(prev => ({...prev, documentsGenerated: true}));
      analytics.track('attorney.healthcare.assemble', { state: clientData.state, forms: formsToGenerate });
      toast.success('Healthcare documents drafted with state compliance');
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
        reasons: ['HEALTHCARE_EXEC_PACKAGE'],
        inputs_hash: `sha256:healthcare_exec_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      toast.success('Healthcare execution package prepared');
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
        reasons: ['HEALTHCARE_BINDER_EXPORT'],
        inputs_hash: `sha256:healthcare_binder_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      // Create download
      const blob = new Blob([zip], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `healthcare_binder_${clientData.name}_${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      
      analytics.track('attorney.healthcare.binder.export', { manifestHash: manifest.hash });
      toast.success('Healthcare binder exported successfully');
    } catch (error) {
      toast.error('Failed to export binder');
    } finally {
      setLoading(false);
    }
  };

  const handleFormToggle = (formType: string) => {
    setSelectedForms(prev => 
      prev.includes(formType) 
        ? prev.filter(f => f !== formType)
        : [...prev, formType]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Healthcare Professional Workbench</h1>
          <p className="text-muted-foreground">
            Professional healthcare document drafting with state compliance
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="conflict">Conflict Check</TabsTrigger>
            <TabsTrigger value="authority">Authority</TabsTrigger>
            <TabsTrigger value="drafting">Drafting</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
            <TabsTrigger value="binder">Binder</TabsTrigger>
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
                      placeholder="Healthcare planning"
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
                      <h3 className="font-medium">{healthRules.surrogateTerminology || 'Health Care Agent'}</h3>
                      <p className="text-sm text-muted-foreground">
                        Healthcare decision authority - {healthRules.notaryRequired ? 'Notarization required' : `${healthRules.witnesses} witnesses required`}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleGrantAuthority('Healthcare Agent')}
                      disabled={loading}
                    >
                      Record Grant
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">HIPAA Representative</h3>
                      <p className="text-sm text-muted-foreground">
                        Medical records access authority
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleGrantAuthority('HIPAA Representative')}
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
                  Healthcare Document Drafting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">{clientData.state} Requirements</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Witnesses: {healthRules.witnesses} required</li>
                    <li>• Notarization: {healthRules.notaryRequired ? 'Required' : 'Not required'}</li>
                    <li>• Terminology: {healthRules.surrogateTerminology || 'Health Care Agent'}</li>
                    {healthRules.remoteNotaryAllowed && <li>• Remote Online Notary: Available</li>}
                    {healthRules.specialNotes && <li>• {healthRules.specialNotes}</li>}
                    {healthRules.witnessEligibility && <li>• Witness restrictions: {healthRules.witnessEligibility}</li>}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Available Forms for {clientData.state}</h3>
                  <div className="grid gap-3">
                    {healthRules.healthcareForms.map(form => {
                      const formNames = {
                        AdvanceDirective: 'Advance Directive',
                        LivingWill: 'Living Will',
                        HealthcarePOA: 'Healthcare Power of Attorney',
                        HIPAA: 'HIPAA Authorization',
                        Surrogate: `${healthRules.surrogateTerminology} Designation`
                      };
                      
                      return (
                        <div key={form} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <input
                            type="checkbox"
                            checked={selectedForms.includes(form)}
                            onChange={() => handleFormToggle(form)}
                            className="h-4 w-4"
                          />
                          <label className="font-medium">
                            {formNames[form as keyof typeof formNames]}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Generate Healthcare Documents</p>
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
                      {(selectedForms.length > 0 ? selectedForms : healthRules.healthcareForms).map(form => (
                        <li key={form}>• {form} ({clientData.state} compliant)</li>
                      ))}
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
                    <p className="font-medium">Build Healthcare Execution Package</p>
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
                      <li>• Witness coordination ({healthRules.witnesses} required)</li>
                      {healthRules.notaryRequired && <li>• Notary scheduling</li>}
                      {healthRules.remoteNotaryAllowed && <li>• Remote Online Notary available</li>}
                      <li>• Agent acceptance signatures</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Distribution</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Provide copies to healthcare agents</li>
                      <li>• Notify primary care physician</li>
                      <li>• Hospital and healthcare facility filing</li>
                      <li>• Personal emergency card preparation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="binder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5" />
                  Healthcare Binder Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Complete Healthcare Binder</p>
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
                    <li>• All executed healthcare planning documents</li>
                    <li>• Authority grants and agent designations</li>
                    <li>• State execution compliance certificates</li>
                    <li>• HIPAA authorizations and medical records access</li>
                    <li>• Trust Rails receipt history (content-free)</li>
                    <li>• Manifest with cryptographic hash</li>
                    <li>• Optional: Blockchain anchor proof</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthcareProWorkbench;