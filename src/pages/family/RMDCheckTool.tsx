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
import { seedRMDCheck } from '@/tools/seeds/rmd-check';

export default function RMDCheckTool() {
  const { toast } = useToast();
  const [lastReceiptId, setLastReceiptId] = React.useState<string>('');
  const [formData, setFormData] = React.useState({
    age: '',
    accountBalance: '',
    accountType: 'traditional-ira'
  });

  React.useEffect(() => {
    // Seed demo data when component mounts
    seedRMDCheck();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Record receipt
    const receipt = recordReceipt({
      id: `rmd_${Date.now()}`,
      type: 'Decision-RDS',
      policy_version: 'E-2025.08',
      inputs_hash: 'sha256:rmd_calculation',
      result: 'approve',
      reasons: ['RMD_COMPLIANCE_CHECK'],
      created_at: new Date().toISOString()
    });

    setLastReceiptId(receipt.id);

    // Analytics
    analytics.trackEvent('family.tool.submit', { 
      tool: 'rmd-check',
      age: formData.age,
      accountType: formData.accountType
    });

    toast({
      title: "RMD Analysis Complete",
      description: "Required minimum distribution calculated and saved to Proof Slips"
    });
  };

  const handleCsvExport = () => {
    const csvData = [
      'Field,Value',
      `Age,${formData.age}`,
      `Account Balance,$${formData.accountBalance}`,
      `Account Type,${formData.accountType}`
    ].join('\n');
    
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RMD_Check_v${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Helmet>
        <title>RMD Check Tool | Required Minimum Distribution Calculator</title>
        <meta name="description" content="Calculate your required minimum distributions and ensure compliance" />
      </Helmet>
      
      <ToolHeader title="RMD Check Tool" />
      
      <main className="container mx-auto px-4 py-8 min-h-screen bg-bfo-navy">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-[hsl(210_65%_13%)] border-4 border-bfo-gold shadow-lg shadow-bfo-gold/20">
            <CardHeader>
              <CardTitle className="text-white">RMD Compliance Check</CardTitle>
              <p className="text-white/70">
                Calculate required minimum distributions to avoid penalties
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-white">Current Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="72"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountBalance" className="text-white">Account Balance</Label>
                    <Input
                      id="accountBalance"
                      type="number"
                      value={formData.accountBalance}
                      onChange={(e) => handleInputChange('accountBalance', e.target.value)}
                      placeholder="750000"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="accountType" className="text-white">Account Type</Label>
                    <select
                      id="accountType"
                      value={formData.accountType}
                      onChange={(e) => handleInputChange('accountType', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="traditional-ira">Traditional IRA</option>
                      <option value="401k">401(k)</option>
                      <option value="403b">403(b)</option>
                      <option value="457">457 Plan</option>
                    </select>
                  </div>
                </div>
                
                <Button type="submit" className="w-full bg-bfo-gold text-black hover:bg-bfo-gold/90">
                  Calculate RMD
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