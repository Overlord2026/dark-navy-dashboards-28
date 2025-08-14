import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AudienceGuard from '@/components/AudienceGuard';
import { runTarget, downloadCSV } from '@/lib/target/engine';
import { TargetParams, TargetResult } from '@/lib/target/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Download, Save, FileText, TrendingUp, AlertTriangle } from 'lucide-react';

const DEFAULTS: TargetParams = {
  currentAge: 52,
  retireAge: 67,
  workRate: 1,
  spendTarget: 160000,
  savingsRate: 0.15,
  inflation: 0.025,
  expGrowth: 0.02,
  ror: 0.06,
  taxRate: 0.22,
  currentIncome: 240000,
  balances: [{ name: "Investment Portfolio", taxType: "taxable", value: 1250000 }],
  horizon: 40
};

export default function TargetAnalyzerPage() {
  const [params, setParams] = useState<TargetParams>(DEFAULTS);
  const [scenarioLabel, setScenarioLabel] = useState('Base Case');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const result = useMemo(() => runTarget(params), [params]);

  const updateParam = <K extends keyof TargetParams>(key: K, value: TargetParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveToClient = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('target_runs').insert({
        tenant_id: 'default-tenant', // TODO: Get from user context
        household_id: 'default-household', // TODO: Get from user context  
        label: scenarioLabel,
        params: params,
        computed: result,
        gap_amount: result.gapAmount
      });

      if (error) throw error;

      toast({
        title: "Saved Successfully",
        description: "Target analysis has been saved to client profile."
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);

  const formatPercent = (decimal: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'percent', 
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(decimal);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Target Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze retirement readiness and identify potential shortfalls in your financial plan.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analysis Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="currentAge">Current Age</Label>
                  <Input
                    id="currentAge"
                    type="number"
                    value={params.currentAge}
                    onChange={(e) => updateParam('currentAge', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="retireAge">Target Retirement Age</Label>
                  <Input
                    id="retireAge"
                    type="number"
                    value={params.retireAge}
                    onChange={(e) => updateParam('retireAge', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="currentIncome">Current Annual Income</Label>
                <Input
                  id="currentIncome"
                  type="number"
                  value={params.currentIncome || ''}
                  onChange={(e) => updateParam('currentIncome', parseFloat(e.target.value) || undefined)}
                  placeholder="Enter current income"
                />
              </div>

              <div>
                <Label htmlFor="spendTarget">Annual Spending Target</Label>
                <Input
                  id="spendTarget"
                  type="number"
                  value={params.spendTarget}
                  onChange={(e) => updateParam('spendTarget', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="savingsRate">Savings Rate (%)</Label>
                  <Input
                    id="savingsRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={params.savingsRate}
                    onChange={(e) => updateParam('savingsRate', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="workRate">Work Rate (0-1)</Label>
                  <Input
                    id="workRate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={params.workRate}
                    onChange={(e) => updateParam('workRate', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="ror">Expected Return (%)</Label>
                  <Input
                    id="ror"
                    type="number"
                    step="0.01"
                    value={params.ror}
                    onChange={(e) => updateParam('ror', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={params.taxRate}
                    onChange={(e) => updateParam('taxRate', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="portfolioValue">Current Portfolio Value</Label>
                <Input
                  id="portfolioValue"
                  type="number"
                  value={params.balances?.[0]?.value || ''}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    updateParam('balances', [{ name: "Investment Portfolio", taxType: "taxable", value }]);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <div className="grid gap-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold">
                        {formatPercent((result.successRate || 0) / 100)}
                      </p>
                    </div>
                    <TrendingUp className={`h-8 w-8 ${result.targetMet ? 'text-green-500' : 'text-yellow-500'}`} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gap Amount</p>
                      <p className={`text-2xl font-bold ${result.gapAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {formatCurrency(result.gapAmount)}
                      </p>
                    </div>
                    <AlertTriangle className={`h-8 w-8 ${result.gapAmount > 0 ? 'text-red-500' : 'text-green-500'}`} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Final Portfolio</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(result.rows[result.rows.length - 1]?.portfolioEnd || 0)}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => downloadCSV(result, scenarioLabel)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>

              <AudienceGuard audience="pro">
                <Input
                  placeholder="Scenario name"
                  value={scenarioLabel}
                  onChange={(e) => setScenarioLabel(e.target.value)}
                  className="w-40"
                />
                <Button
                  onClick={handleSaveToClient}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save to Client'}
                </Button>
                <Button variant="outline">
                  Attach to Proposal
                </Button>
              </AudienceGuard>
            </div>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle>Yearly Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Year</th>
                        <th className="text-left p-2">Age</th>
                        <th className="text-left p-2">Income</th>
                        <th className="text-left p-2">Spending</th>
                        <th className="text-left p-2">Taxes</th>
                        <th className="text-left p-2">Withdrawals</th>
                        <th className="text-left p-2">Portfolio End</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.slice(0, 20).map((row, index) => (
                        <tr key={row.year} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                          <td className="p-2">{row.year}</td>
                          <td className="p-2">{row.age}</td>
                          <td className="p-2">{formatCurrency(row.grossIncome)}</td>
                          <td className="p-2">{formatCurrency(row.spending)}</td>
                          <td className="p-2">{formatCurrency(row.taxes)}</td>
                          <td className="p-2">{formatCurrency(row.withdrawals)}</td>
                          <td className="p-2 font-medium">{formatCurrency(row.portfolioEnd)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {result.rows.length > 20 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Showing first 20 years. Download CSV for complete analysis.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}