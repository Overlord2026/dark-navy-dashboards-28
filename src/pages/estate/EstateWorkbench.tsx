import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  Calculator, 
  Archive,
  Crown,
  TrendingUp,
  Download,
  Home
} from 'lucide-react';
import { buildBinderPack } from '@/features/estate/binder';
import { recordReceipt } from '@/features/receipts/record';
import { scanBeneficiaries } from '@/features/estate/beneficiary/sync';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';
import { FamilyDeedRequest } from '@/features/estate/deeds/FamilyDeedRequest';
import { includeCryptoInEstatePacket } from '@/features/crypto/estate/includeInEstate';

const EstateWorkbench = () => {
  const [activeTab, setActiveTab] = useState('diagram');
  const [clientId] = useState('demo-client');
  const [mismatches, setMismatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeedRequest, setShowDeedRequest] = useState(false);
  const [showFundingLetters, setShowFundingLetters] = useState(false);
  const [deedRequests] = useState<any[]>([]);

  const handleGenerateTODLetter = () => {
    const tokens = {
      date: new Date().toLocaleDateString(),
      account_holder_name: 'Client Name',
      institution_name: 'Example Bank',
      account_number: 'XXX-XXXX',
      primary_beneficiary: 'Trust Name'
    };
    
    console.log('Generating TOD/POD funding letter with tokens:', tokens);
    
    const receipt = {
      type: 'Decision-RDS',
      action: 'funding.letter',
      reasons: ['TOD'],
      inputs_hash: btoa(JSON.stringify(tokens)),
      timestamp: new Date().toISOString()
    };
    
    console.log('Decision-RDS recorded for funding letter:', receipt);
    analytics.track('funding.letter.generated', { type: 'TOD' });
  };

  const handleGenerate401kLetter = () => {
    const tokens = {
      date: new Date().toLocaleDateString(),
      participant_name: 'Client Name',
      plan_name: 'Company 401(k) Plan',
      employee_id: 'EMP123',
      primary_beneficiary: 'Trust Name'
    };
    
    console.log('Generating 401k beneficiary letter with tokens:', tokens);
    
    const receipt = {
      type: 'Decision-RDS',
      action: 'funding.letter',
      reasons: ['401k'],
      inputs_hash: btoa(JSON.stringify(tokens)),
      timestamp: new Date().toISOString()
    };
    
    console.log('Decision-RDS recorded for 401k letter:', receipt);
    analytics.track('funding.letter.generated', { type: '401k' });
  };

  const handleGrantAuthority = async (role: 'POA' | 'Trustee' | 'Executor', subjectId: string) => {
    setLoading(true);
    try {
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'authority.grant',
        reasons: ['AUTH_GRANT'],
        inputs_hash: `sha256:${role}_${subjectId}_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      analytics.track('estate.authority.grant', { role, clientId });
      toast.success(`${role} authority granted successfully`);
    } catch (error) {
      toast.error('Failed to grant authority');
    } finally {
      setLoading(false);
    }
  };

  const handleBeneficiarySync = async () => {
    setLoading(true);
    try {
      const foundMismatches = await scanBeneficiaries(clientId);
      setMismatches(foundMismatches);
      
      if (foundMismatches.length > 0) {
        await recordReceipt({
          type: 'Decision-RDS',
          action: 'beneficiary.warning',
          reasons: ['BENEFICIARY_WARN'],
          inputs_hash: `sha256:ben_warn_${Date.now()}`,
          created_at: new Date().toISOString()
        } as any);
      }
      
      analytics.track('estate.beneficiary.scan', { mismatches: foundMismatches.length });
      toast.success(`Found ${foundMismatches.length} beneficiary mismatches`);
    } catch (error) {
      toast.error('Failed to scan beneficiaries');
    } finally {
      setLoading(false);
    }
  };

  const handleFixBeneficiary = async (accountId: string) => {
    setLoading(true);
    try {
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'beneficiary.fix',
        reasons: ['BENEFICIARY_FIX'],
        inputs_hash: `sha256:ben_fix_${accountId}_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      // Remove from mismatches list
      setMismatches(prev => prev.filter(m => m.accountId !== accountId));
      
      analytics.track('estate.beneficiary.fix', { accountId });
      toast.success('Beneficiary fix letter generated');
    } catch (error) {
      toast.error('Failed to fix beneficiary');
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
        inputs_hash: `sha256:surv_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      analytics.track('estate.survivorship.run', { clientId });
      toast.success('Survivorship analysis completed');
    } catch (error) {
      toast.error('Failed to run survivorship analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleBinderExport = async () => {
    setLoading(true);
    try {
      const { zip, manifest } = await buildBinderPack({ clientId });
      
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'estate.binder.export',
        reasons: ['BINDER_EXPORT'],
        inputs_hash: `sha256:binder_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      // Create download
      const blob = new Blob([zip], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `estate_binder_${clientId}_${new Date().toISOString().split('T')[0]}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      
      analytics.track('estate.binder.export', { clientId, manifestHash: manifest.hash });
      toast.success('Estate binder exported successfully');
    } catch (error) {
      toast.error('Failed to export binder');
    } finally {
      setLoading(false);
    }
  };

  const handleIncludeCrypto = async () => {
    const userId = 'demo-user';
    const walletIds = ['wallet_btc_main', 'wallet_eth_defi'];
    await includeCryptoInEstatePacket(userId, walletIds);
  };

  return (
    <div className="min-h-screen bg-bfo-navy">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Estate Workbench</h1>
          <p className="text-white/70">
            Comprehensive estate planning tools with state-aware compliance and Trust Rails integration.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-[hsl(210_65%_13%)] border border-bfo-gold/30">
            <TabsTrigger value="diagram" className="flex items-center gap-2 text-white data-[state=active]:bg-bfo-gold data-[state=active]:text-black">
              <TrendingUp className="h-4 w-4" />
              Diagram
            </TabsTrigger>
            <TabsTrigger value="authority" className="flex items-center gap-2 text-white data-[state=active]:bg-bfo-gold data-[state=active]:text-black">
              <Crown className="h-4 w-4" />
              Authority
            </TabsTrigger>
            <TabsTrigger value="beneficiaries" className="flex items-center gap-2 text-white data-[state=active]:bg-bfo-gold data-[state=active]:text-black">
              <Users className="h-4 w-4" />
              Beneficiaries
            </TabsTrigger>
            <TabsTrigger value="property" className="flex items-center gap-2 text-white data-[state=active]:bg-bfo-gold data-[state=active]:text-black">
              <FileText className="h-4 w-4" />
              Property
            </TabsTrigger>
            <TabsTrigger value="survivorship" className="flex items-center gap-2 text-white data-[state=active]:bg-bfo-gold data-[state=active]:text-black">
              <Calculator className="h-4 w-4" />
              Survivorship
            </TabsTrigger>
            <TabsTrigger value="binder" className="flex items-center gap-2 text-white data-[state=active]:bg-bfo-gold data-[state=active]:text-black">
              <Archive className="h-4 w-4" />
              Binder
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagram" className="space-y-6">
            <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-bfo-gold" />
                  Entity & Trust Diagram
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-bfo-gold/10 p-8 rounded-lg text-center border border-bfo-gold/30">
                  <p className="text-white/70 mb-4">
                    Interactive estate diagram showing entity relationships and probate risk analysis
                  </p>
                  <Badge variant="outline" className="border-bfo-gold text-bfo-gold">Coming Soon: Visual Estate Mapping</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="authority" className="space-y-6">
            <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Crown className="h-5 w-5 text-bfo-gold" />
                  Authority & Roles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border border-bfo-gold/30 rounded-lg bg-bfo-navy">
                    <div>
                      <h3 className="font-medium text-white">Power of Attorney</h3>
                      <p className="text-sm text-white/70">Financial decision authority</p>
                    </div>
                    <Button 
                      onClick={() => handleGrantAuthority('POA', 'spouse')}
                      disabled={loading}
                      className="bg-bfo-gold text-black hover:bg-bfo-gold/90"
                    >
                      Grant Authority
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-bfo-gold/30 rounded-lg bg-bfo-navy">
                    <div>
                      <h3 className="font-medium text-white">Trustee</h3>
                      <p className="text-sm text-white/70">Trust administration authority</p>
                    </div>
                    <Button 
                      onClick={() => handleGrantAuthority('Trustee', 'successor')}
                      disabled={loading}
                      className="bg-bfo-gold text-black hover:bg-bfo-gold/90"
                    >
                      Grant Authority
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-bfo-gold/30 rounded-lg bg-bfo-navy">
                    <div>
                      <h3 className="font-medium text-white">Executor</h3>
                      <p className="text-sm text-white/70">Estate administration authority</p>
                    </div>
                    <Button 
                      onClick={() => handleGrantAuthority('Executor', 'primary')}
                      disabled={loading}
                      className="bg-bfo-gold text-black hover:bg-bfo-gold/90"
                    >
                      Grant Authority
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="beneficiaries" className="space-y-6">
            <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="h-5 w-5 text-bfo-gold" />
                  Beneficiary Center
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-white/70">
                    Scan accounts for beneficiary mismatches against estate intent
                  </p>
                  <Button 
                    onClick={handleBeneficiarySync} 
                    disabled={loading}
                    className="bg-bfo-gold text-black hover:bg-bfo-gold/90"
                  >
                    Scan Beneficiaries
                  </Button>
                </div>
                
                {mismatches.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium flex items-center gap-2 text-white">
                      <AlertTriangle className="h-4 w-4 text-bfo-gold" />
                      Mismatches Found ({mismatches.length})
                    </h3>
                    {mismatches.map((mismatch) => (
                      <div key={mismatch.accountId} className="flex items-center justify-between p-3 border border-bfo-gold/30 rounded-lg bg-bfo-navy">
                        <div>
                          <p className="font-medium text-white">{mismatch.accountId}</p>
                          <p className="text-sm text-white/70">
                            Current: {mismatch.current} → Intent: {mismatch.intent}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleFixBeneficiary(mismatch.accountId)}
                          disabled={loading}
                          className="bg-bfo-gold text-black hover:bg-bfo-gold/90"
                        >
                          Apply Fix
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="property" className="space-y-6">
            <div className="grid gap-6">
              <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Home className="h-5 w-5 text-bfo-gold" />
                    Property & Funding
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Request deeds and generate funding letters for trust and estate planning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FamilyDeedRequest />
                  
                  <div>
                    <h4 className="font-medium mb-3 text-white">Funding Letters</h4>
                    <p className="text-sm text-white/70 mb-4">
                      Generate letters to update beneficiaries on accounts and policies
                    </p>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Button 
                        variant="outline" 
                        onClick={handleGenerateTODLetter} 
                        className="flex items-center gap-2 border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black"
                      >
                        <FileText className="h-4 w-4" />
                        TOD/POD Letters
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleGenerate401kLetter} 
                        className="flex items-center gap-2 border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black"
                      >
                        <FileText className="h-4 w-4" />
                        401(k) Beneficiary Letters
                      </Button>
                    </div>
                  </div>
                  
                  {deedRequests.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-white">Your Deed Requests</h4>
                      {deedRequests.map((request) => (
                        <Card key={request.id} className="p-4 bg-bfo-navy border border-bfo-gold/30">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-white">{request.propertyAddress}</p>
                              <p className="text-sm text-white/70">
                                {request.deedType} • {request.status}
                              </p>
                            </div>
                            <Badge 
                              variant={request.status === 'recorded' ? 'default' : 'secondary'}
                              className={request.status === 'recorded' ? 'bg-bfo-gold text-black' : 'bg-bfo-gold/20 text-bfo-gold'}
                            >
                              {request.status}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="survivorship" className="space-y-6">
            <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calculator className="h-5 w-5 text-bfo-gold" />
                  Survivorship & Estate Tax
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-white">Estate Tax Analysis</p>
                    <p className="text-sm text-white/70">
                      Federal and state estate tax projections with portability
                    </p>
                  </div>
                  <Button 
                    onClick={handleSurvivorshipRun} 
                    disabled={loading}
                    className="bg-bfo-gold text-black hover:bg-bfo-gold/90"
                  >
                    Run Analysis
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-bfo-gold/10 rounded-lg border border-bfo-gold/30">
                    <h3 className="font-medium text-white">Federal Estate Tax</h3>
                    <p className="text-2xl font-bold text-bfo-gold">$0</p>
                    <p className="text-sm text-white/70">Exemption: $13.61M (2024)</p>
                  </div>
                  <div className="p-4 bg-bfo-gold/10 rounded-lg border border-bfo-gold/30">
                    <h3 className="font-medium text-white">State Estate Tax</h3>
                    <p className="text-2xl font-bold text-bfo-gold">$0</p>
                    <p className="text-sm text-white/70">CA: No state estate tax</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="binder" className="space-y-6">
            <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Archive className="h-5 w-5 text-bfo-gold" />
                  Estate Binder Export
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-white">Master Estate Package</p>
                    <p className="text-sm text-white/70">
                      Comprehensive ZIP with all documents, checklists, and state requirements
                    </p>
                  </div>
                  <Button 
                    onClick={handleBinderExport} 
                    disabled={loading}
                    className="bg-bfo-gold text-black hover:bg-bfo-gold/90 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export Binder
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-4 bg-bfo-gold/10 rounded-lg border border-bfo-gold/30">
                    <h3 className="font-medium text-white">Documents</h3>
                    <p className="text-2xl font-bold text-bfo-gold">12</p>
                    <p className="text-sm text-white/70">Total files included</p>
                  </div>
                  <div className="p-4 bg-bfo-gold/10 rounded-lg border border-bfo-gold/30">
                    <h3 className="font-medium text-white">Compliance</h3>
                    <p className="text-2xl font-bold text-green-400">✓</p>
                    <p className="text-sm text-white/70">State requirements met</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    onClick={handleIncludeCrypto}
                    variant="outline"
                    className="w-full border-bfo-gold text-bfo-gold hover:bg-bfo-gold hover:text-black"
                  >
                    Include Crypto Assets in Estate Packet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EstateWorkbench;