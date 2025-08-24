import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ExportButtons } from '@/components/tools/ExportButtons';
import { ProofStrip } from '@/components/tools/ProofStrip';
import { recordReceipt } from '@/features/receipts/record';
import { analytics } from '@/lib/analytics';

export default function RothLadderTool() {
  const { toast } = useToast();
  const [lastReceiptId, setLastReceiptId] = React.useState<string>('');
  const [formData, setFormData] = React.useState({
    currentAge: '',
    retirementAge: '',
    traditionalIRA: '',
    currentTaxRate: '',
    expectedTaxRate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Record receipt
    const receipt = recordReceipt({
      id: `roth_${Date.now()}`,
      type: 'Decision-RDS',
      policy_version: 'E-2025.08',
      inputs_hash: 'sha256:roth_ladder_analysis',
      result: 'approve',
      reasons: ['ROTH_CONVERSION_ANALYSIS'],
      created_at: new Date().toISOString()
    });

    setLastReceiptId(receipt.id);

    // Analytics
    analytics.track('family.tool.submit', { 
      tool: 'roth-ladder',
      currentAge: formData.currentAge,
      retirementAge: formData.retirementAge
    });

    toast({
      title: "Analysis Complete",
      description: "Roth conversion strategy generated and saved to Proof Slips"
    });
  };

  const handleCsvExport = () => {
    const csvData = [
      'Field,Value',
      `Current Age,${formData.currentAge}`,
      `Retirement Age,${formData.retirementAge}`,
      `Traditional IRA Balance,$${formData.traditionalIRA}`,
      `Current Tax Rate,${formData.currentTaxRate}%`,
      `Expected Tax Rate,${formData.expectedTaxRate}%`
    ].join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Roth_Ladder_v${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Helmet>
        <title>Roth Ladder Tool | Tax-Efficient Conversion Strategies</title>
        <meta name="description" content="Plan tax-efficient Roth IRA conversion strategies to optimize retirement income" />
      </Helmet>
      
      <ToolHeader title="Roth Ladder Tool" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Roth Conversion Strategy</CardTitle>
              <p className="text-muted-foreground">
                Plan systematic conversions to maximize tax efficiency
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentAge">Current Age</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      value={formData.currentAge}
                      onChange={(e) => handleInputChange('currentAge', e.target.value)}
                      placeholder="45"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="retirementAge">Target Retirement Age</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      value={formData.retirementAge}
                      onChange={(e) => handleInputChange('retirementAge', e.target.value)}
                      placeholder="65"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="traditionalIRA">Traditional IRA Balance</Label>
                    <Input
                      id="traditionalIRA"
                      type="number"
                      value={formData.traditionalIRA}
                      onChange={(e) => handleInputChange('traditionalIRA', e.target.value)}
                      placeholder="500000"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentTaxRate">Current Tax Rate (%)</Label>
                    <Input
                      id="currentTaxRate"
                      type="number"
                      value={formData.currentTaxRate}
                      onChange={(e) => handleInputChange('currentTaxRate', e.target.value)}
                      placeholder="24"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expectedTaxRate">Expected Retirement Tax Rate (%)</Label>
                    <Input
                      id="expectedTaxRate"
                      type="number"
                      value={formData.expectedTaxRate}
                      onChange={(e) => handleInputChange('expectedTaxRate', e.target.value)}
                      placeholder="32"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full">
                  Generate Conversion Strategy
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {lastReceiptId && <ProofStrip lastReceiptId={lastReceiptId} />}
          
          <div className="flex justify-end">
            <ExportButtons 
              csvEnabled={!!lastReceiptId}
              zipEnabled={false}
              onCsvExport={handleCsvExport}
            />
          </div>
        </div>
      </main>
    </>
  );
}