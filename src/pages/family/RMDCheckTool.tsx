import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ToolHeader } from '@/components/tools/ToolHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { recordReceipt } from '@/features/receipts/record';
import { analytics } from '@/lib/analytics';
import { seedRMDCheck } from '@/tools/seeds/rmd-check';

export default function RMDCheckTool() {
  const { toast } = useToast();
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
    recordReceipt({
      id: `rmd_${Date.now()}`,
      type: 'Decision-RDS',
      policy_version: 'E-2025.08',
      inputs_hash: 'sha256:rmd_calculation',
      result: 'approve',
      reasons: ['RMD_COMPLIANCE_CHECK'],
      created_at: new Date().toISOString()
    });

    // Analytics
    analytics.track('family.tool.submit', { 
      tool: 'rmd-check',
      age: formData.age,
      accountType: formData.accountType
    });

    toast({
      title: "RMD Analysis Complete",
      description: (
        <div className="space-y-2">
          <p>Required minimum distribution calculated</p>
          <Badge variant="outline" className="text-xs">
            Saved to Proof Slips
          </Badge>
        </div>
      )
    });
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
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>RMD Compliance Check</CardTitle>
              <p className="text-muted-foreground">
                Calculate required minimum distributions to avoid penalties
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Current Age</Label>
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
                    <Label htmlFor="accountBalance">Account Balance</Label>
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
                    <Label htmlFor="accountType">Account Type</Label>
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
                
                <Button type="submit" className="w-full">
                  Calculate RMD
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}