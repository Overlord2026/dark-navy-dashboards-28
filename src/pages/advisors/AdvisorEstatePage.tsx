import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Users, 
  Calculator, 
  Download,
  Send,
  Receipt,
  TrendingUp
} from 'lucide-react';
import { recordReceipt } from '@/features/receipts/record';
import { renderEstatePdf } from '@/lib/report/estatePdf';
import { scanBeneficiaries } from '@/features/estate/beneficiary/sync';
import { toast } from 'sonner';
import analytics from '@/lib/analytics';

const AdvisorEstatePage = () => {
  const [activeTab, setActiveTab] = useState('intake');
  const [clientData, setClientData] = useState({
    name: '',
    state: 'CA',
    assets: '',
    concerns: '',
    spouse: '',
    children: ''
  });
  const [loading, setLoading] = useState(false);
  const [mismatches, setMismatches] = useState<any[]>([]);

  const handleIntakeSubmit = async () => {
    setLoading(true);
    try {
      await recordReceipt({
        type: 'Consent-RDS',
        action: 'estate.intake',
        reasons: ['MINIMUM_NECESSARY'],
        inputs_hash: `sha256:intake_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      analytics.trackEvent('advisor.estate.intake', { clientState: clientData.state });
      toast.success('Client intake completed');
    } catch (error) {
      toast.error('Failed to save intake data');
    } finally {
      setLoading(false);
    }
  };

  const handleBeneficiarySync = async () => {
    setLoading(true);
    try {
      const foundMismatches = await scanBeneficiaries('advisor-client');
      setMismatches(foundMismatches);
      
      if (foundMismatches.length > 0) {
        await recordReceipt({
          type: 'Decision-RDS',
          action: 'beneficiary.fix',
          reasons: ['BENEFICIARY_FIX'],
          inputs_hash: `sha256:ben_sync_${Date.now()}`,
          created_at: new Date().toISOString()
        } as any);
      }
      
      analytics.trackEvent('advisor.estate.beneficiary.sync', { mismatches: foundMismatches.length });
      toast.success('Beneficiary analysis completed');
    } catch (error) {
      toast.error('Failed to sync beneficiaries');
    } finally {
      setLoading(false);
    }
  };

  const handleSurvivorshipRun = async () => {
    setLoading(true);
    try {
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'estate.run',
        reasons: ['ESTATE_RUN'],
        inputs_hash: `sha256:surv_advisor_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      analytics.trackEvent('advisor.estate.survivorship', { state: clientData.state });
      toast.success('Survivorship analysis completed');
    } catch (error) {
      toast.error('Failed to run survivorship analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateFundingLetters = async () => {
    setLoading(true);
    try {
      // Generate funding letters (mock)
      const letters = ['TOD Letter', 'POD Letter', 'Trust Funding Letter'];
      
      await recordReceipt({
        type: 'Vault-RDS',
        action: 'FUNDING_LETTERS_STORE',
        reasons: ['FUNDING_LETTERS'],
        inputs_hash: `sha256:funding_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      analytics.trackEvent('export.click', { kind: 'pdf', type: 'funding_letters' });
      toast.success('Funding letters generated and stored');
    } catch (error) {
      toast.error('Failed to generate funding letters');
    } finally {
      setLoading(false);
    }
  };

  const handleAttorneyReferral = async () => {
    setLoading(true);
    try {
      await recordReceipt({
        type: 'Comms-RDS',
        template_id: 'attorney.review.request',
        result: 'sent',
        created_at: new Date().toISOString()
      } as any);
      
      analytics.trackEvent('advisor.estate.referral', { state: clientData.state });
      toast.success('Attorney referral request sent');
    } catch (error) {
      toast.error('Failed to send attorney referral');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Estate Planning Services</h1>
          <p className="text-muted-foreground">
            Comprehensive estate planning support for your clients
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="intake">Intake</TabsTrigger>
            <TabsTrigger value="sync">Beneficiaries</TabsTrigger>
            <TabsTrigger value="survivorship">Survivorship</TabsTrigger>
            <TabsTrigger value="funding">Funding</TabsTrigger>
            <TabsTrigger value="referral">Referral</TabsTrigger>
            <TabsTrigger value="proof">Proof</TabsTrigger>
          </TabsList>

          <TabsContent value="intake" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Client Estate Planning Intake
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
                    <Label htmlFor="clientState">State</Label>
                    <Input
                      id="clientState"
                      value={clientData.state}
                      onChange={(e) => setClientData(prev => ({...prev, state: e.target.value}))}
                      placeholder="CA"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="assets">Estimated Assets</Label>
                  <Input
                    id="assets"
                    value={clientData.assets}
                    onChange={(e) => setClientData(prev => ({...prev, assets: e.target.value}))}
                    placeholder="$1,000,000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="concerns">Primary Estate Planning Concerns</Label>
                  <Textarea
                    id="concerns"
                    value={clientData.concerns}
                    onChange={(e) => setClientData(prev => ({...prev, concerns: e.target.value}))}
                    placeholder="Tax minimization, asset protection, succession planning..."
                  />
                </div>
                
                <Button onClick={handleIntakeSubmit} disabled={loading}>
                  Save Intake (Minimum Necessary)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Titling & Beneficiary Sync
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Account Beneficiary Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      Compare current beneficiaries against estate planning intent
                    </p>
                  </div>
                  <Button onClick={handleBeneficiarySync} disabled={loading}>
                    Run Analysis
                  </Button>
                </div>
                
                {mismatches.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Mismatches Found ({mismatches.length})</h3>
                    {mismatches.map((mismatch, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <p className="font-medium">{mismatch.accountId}</p>
                        <p className="text-sm text-muted-foreground">
                          Current: {mismatch.current} → Recommended: {mismatch.intent}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">{mismatch.fixSuggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="survivorship" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Survivorship Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Quick Estate Tax Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      Federal and state estate tax projections
                    </p>
                  </div>
                  <Button onClick={handleSurvivorshipRun} disabled={loading}>
                    Run Snapshot
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <h3 className="font-medium">Federal Tax</h3>
                    <p className="text-2xl font-bold text-green-600">$0</p>
                    <p className="text-xs text-muted-foreground">Under exemption</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <h3 className="font-medium">State Tax</h3>
                    <p className="text-2xl font-bold text-green-600">$0</p>
                    <p className="text-xs text-muted-foreground">{clientData.state} analysis</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg text-center">
                    <h3 className="font-medium">Portability</h3>
                    <p className="text-lg font-bold">Available</p>
                    <p className="text-xs text-muted-foreground">Spouse election</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Funding Letters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Trust Funding Documentation</p>
                    <p className="text-sm text-muted-foreground">
                      Generate TOD/POD and trust funding request letters
                    </p>
                  </div>
                  <Button onClick={handleGenerateFundingLetters} disabled={loading}>
                    Generate Letters
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">TOD Letter</p>
                    <p className="text-xs text-muted-foreground">Transfer on death accounts</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">POD Letter</p>
                    <p className="text-xs text-muted-foreground">Payable on death accounts</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-medium">Funding Letter</p>
                    <p className="text-xs text-muted-foreground">Trust funding requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referral" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Attorney Referral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Request Attorney Review</p>
                    <p className="text-sm text-muted-foreground">
                      Connect client with estate planning attorney
                    </p>
                  </div>
                  <Button onClick={handleAttorneyReferral} disabled={loading}>
                    Send Referral
                  </Button>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Attorney Services</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Document drafting and review</li>
                    <li>• State-specific compliance</li>
                    <li>• Execution coordination</li>
                    <li>• Ongoing estate plan maintenance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proof" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Proof & Receipts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium mb-2">Estate Planning Receipts</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    All estate planning activities generate content-free receipts
                  </p>
                  <Badge variant="outline">Persona-Scoped: Advisor</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvisorEstatePage;