import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Gift, 
  Send,
  Receipt,
  TrendingUp,
  DollarSign,
  Banknote
} from 'lucide-react';
import { recordReceipt } from '@/features/receipts/record';
import { toast } from 'sonner';
import analytics from '@/lib/analytics';

const CPAEstatePage = () => {
  const [activeTab, setActiveTab] = useState('snapshot');
  const [loading, setLoading] = useState(false);
  const [snapshotData, setSnapshotData] = useState({
    federalExemption: 14060000, // 2025 exemption (updated)
    stateExemption: 0, // Varies by state
    currentEstate: 2500000,
    portabilityAvailable: true
  });

  const handleTaxSnapshot = async () => {
    setLoading(true);
    try {
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'estate.run',
        reasons: ['TAX_SNAPSHOT'],
        inputs_hash: `sha256:tax_snapshot_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      analytics.track('cpa.estate.tax.snapshot');
      toast.success('Estate tax snapshot generated');
    } catch (error) {
      toast.error('Failed to generate tax snapshot');
    } finally {
      setLoading(false);
    }
  };

  const handleGiftingShell = async (strategy: string) => {
    setLoading(true);
    try {
      await recordReceipt({
        type: 'Decision-RDS',
        action: 'estate.run',
        reasons: ['GIFTING_SHELL', strategy],
        inputs_hash: `sha256:gift_${strategy}_${Date.now()}`,
        created_at: new Date().toISOString()
      } as any);
      
      analytics.track('cpa.estate.gifting.shell', { strategy });
      toast.success(`${strategy} shell generated`);
    } catch (error) {
      toast.error(`Failed to generate ${strategy} shell`);
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
      
      analytics.track('cpa.estate.attorney.referral');
      toast.success('Attorney referral sent');
    } catch (error) {
      toast.error('Failed to send attorney referral');
    } finally {
      setLoading(false);
    }
  };

  const federalTax = Math.max(0, snapshotData.currentEstate - snapshotData.federalExemption) * 0.40;
  const stateTax = Math.max(0, snapshotData.currentEstate - snapshotData.stateExemption) * 0.12; // Example rate

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">CPA Estate Planning Tools</h1>
          <p className="text-muted-foreground">
            Tax-focused estate planning analysis and strategy shells
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="snapshot">Tax Snapshot</TabsTrigger>
            <TabsTrigger value="gifting">Gifting Shells</TabsTrigger>
            <TabsTrigger value="referral">Attorney Referral</TabsTrigger>
            <TabsTrigger value="proof">Proof</TabsTrigger>
          </TabsList>

          <TabsContent value="snapshot" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Estate Tax Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Federal & State Estate Tax Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      Current projections with portability considerations
                    </p>
                  </div>
                  <Button onClick={handleTaxSnapshot} disabled={loading}>
                    Generate Snapshot
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Estate Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Estate Value:</span>
                        <span className="font-medium">${snapshotData.currentEstate.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Federal Exemption (2024):</span>
                        <span className="font-medium">${snapshotData.federalExemption.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Portability Available:</span>
                        <span className="font-medium">{snapshotData.portabilityAvailable ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">Tax Projections</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Federal Estate Tax:</span>
                        <span className={`font-medium ${federalTax === 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${federalTax.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">State Estate Tax:</span>
                        <span className={`font-medium ${stateTax === 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${stateTax.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Total Tax Liability:</span>
                        <span className={`font-bold ${(federalTax + stateTax) === 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${(federalTax + stateTax).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {snapshotData.portabilityAvailable && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">Portability Election Available</h3>
                    <p className="text-sm text-blue-700">
                      Surviving spouse can elect to use deceased spouse's unused federal exemption. 
                      Form 706 must be filed within 9 months (plus extensions) of death.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gifting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Gifting Strategy Shells
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-6">
                  Planning shells for estate and gift tax reduction strategies. These are planning tools only.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Banknote className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Annual Exclusion</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      $18,000 per recipient (2024). No gift tax or reporting required.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleGiftingShell('annual_exclusion')}
                      disabled={loading}
                    >
                      Generate Shell
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Donor Advised Fund</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Charitable deduction with flexible timing of grants.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleGiftingShell('daf')}
                      disabled={loading}
                    >
                      Generate Shell
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Charitable Remainder Trust</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Income stream with charitable deduction and estate reduction.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleGiftingShell('crt')}
                      disabled={loading}
                    >
                      Generate Shell
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Gift className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Charitable Lead Trust</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Transfer to heirs with reduced gift/estate tax.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleGiftingShell('clt')}
                      disabled={loading}
                    >
                      Generate Shell
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-2">Planning Tools Only</h3>
                  <p className="text-sm text-yellow-700">
                    These shells provide planning frameworks and tax implications. 
                    Attorney consultation required for implementation and documentation.
                  </p>
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
                    <p className="font-medium">Estate Planning Attorney Referral</p>
                    <p className="text-sm text-muted-foreground">
                      Connect client with qualified estate planning counsel
                    </p>
                  </div>
                  <Button onClick={handleAttorneyReferral} disabled={loading}>
                    Send Referral
                  </Button>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Attorney Services</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Complex trust and estate documentation</li>
                    <li>• Advanced gifting strategy implementation</li>
                    <li>• Business succession planning</li>
                    <li>• Charitable planning structures</li>
                    <li>• Tax-efficient estate plan execution</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">CPA Collaboration</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Ongoing tax compliance coordination</li>
                    <li>• Annual gift tax return preparation</li>
                    <li>• Estate tax return (Form 706) services</li>
                    <li>• Trust tax return preparation</li>
                    <li>• Portability election assistance</li>
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
                  CPA Estate Planning Receipts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium mb-2">Tax Planning Receipts</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    All tax analysis and planning activities generate content-free receipts
                  </p>
                  <Badge variant="outline">Persona-Scoped: CPA</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-3 border rounded-lg text-center">
                    <h3 className="font-medium">Tax Snapshots</h3>
                    <p className="text-sm text-muted-foreground">Estate tax projections</p>
                  </div>
                  <div className="p-3 border rounded-lg text-center">
                    <h3 className="font-medium">Gifting Shells</h3>
                    <p className="text-sm text-muted-foreground">Strategy frameworks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CPAEstatePage;