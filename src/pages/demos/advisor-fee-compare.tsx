import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { RotateCcw, Calculator, Vault, TrendingUp, AlertTriangle } from 'lucide-react';
import { recordProfessionalRDS } from '@/lib/rds';

interface FeeComparison {
  provider: string;
  annualFee: number;
  expenseRatio: number;
  totalAnnualCost: number;
  projectedCost10Year: number;
}

const SAMPLE_PROVIDERS = [
  { name: 'Current Provider A', baseFee: 0.75, expenseRatio: 0.65 },
  { name: 'Vanguard Target Date', baseFee: 0.00, expenseRatio: 0.13 },
  { name: 'Fidelity Freedom', baseFee: 0.00, expenseRatio: 0.12 },
  { name: 'Provider B Premium', baseFee: 1.25, expenseRatio: 0.85 }
];

export default function AdvisorFeeCompareDemo() {
  const [portfolioValue, setPortfolioValue] = useState('500000');
  const [showComparison, setShowComparison] = useState(false);
  const [showVaultLink, setShowVaultLink] = useState(false);

  const calculateComparison = useCallback(() => {
    const value = parseFloat(portfolioValue);
    if (!value || value <= 0) {
      toast.error("Please enter a valid portfolio value");
      return;
    }

    setShowComparison(true);
  }, [portfolioValue]);

  const saveToVault = useCallback(() => {
    // Emit demo receipt
    const demoReceipt = {
      flow_name: 'advisor_fee_comparison',
      timestamp: new Date().toISOString(),
      demo_id: `demo_${Date.now()}`,
      portfolio_value: parseFloat(portfolioValue),
      providers_compared: SAMPLE_PROVIDERS.length
    };

    // Record RDS (content-free)
    recordProfessionalRDS(demoReceipt);

    setShowVaultLink(true);
    toast.success("Comparison saved (demo)");
  }, [portfolioValue]);

  const resetDemo = useCallback(() => {
    setPortfolioValue('500000');
    setShowComparison(false);
    setShowVaultLink(false);
    toast.info("Demo reset");
  }, []);

  const getComparisons = (): FeeComparison[] => {
    const value = parseFloat(portfolioValue) || 0;
    
    return SAMPLE_PROVIDERS.map(provider => {
      const annualFee = (value * provider.baseFee) / 100;
      const expenseRatio = (value * provider.expenseRatio) / 100;
      const totalAnnualCost = annualFee + expenseRatio;
      const projectedCost10Year = totalAnnualCost * 10 * 1.07; // Assume 7% growth compound effect
      
      return {
        provider: provider.name,
        annualFee,
        expenseRatio,
        totalAnnualCost,
        projectedCost10Year
      };
    });
  };

  const comparisons = getComparisons();
  const bestOption = comparisons.reduce((prev, current) => 
    prev.totalAnnualCost < current.totalAnnualCost ? prev : current
  );
  const currentProvider = comparisons[0];
  const potentialSavings = currentProvider.projectedCost10Year - bestOption.projectedCost10Year;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            401(k) Fee Comparison Tool
          </h1>
          <p className="text-lg text-muted-foreground">
            Compare provider fees and help clients optimize their retirement savings
          </p>
          <Button onClick={resetDemo} variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Demo
          </Button>
        </div>

        {/* Input Section */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Portfolio Details
            </CardTitle>
            <CardDescription>
              Enter your client's current 401(k) portfolio value
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="portfolio">Current Portfolio Value</Label>
                <Input
                  id="portfolio"
                  type="number"
                  placeholder="500000"
                  value={portfolioValue}
                  onChange={(e) => setPortfolioValue(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={calculateComparison} className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Compare Providers
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {showComparison && (
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Fee Comparison Results</CardTitle>
              <CardDescription>
                Annual costs and 10-year projections for different providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cost Savings Alert */}
              {potentialSavings > 0 && (
                <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                        Potential Savings Identified
                      </h3>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Your client could save approximately <strong>${potentialSavings.toLocaleString()}</strong> 
                        over 10 years by switching to the lowest-cost provider.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-muted">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border border-muted p-3 text-left">Provider</th>
                      <th className="border border-muted p-3 text-right">Annual Admin Fee</th>
                      <th className="border border-muted p-3 text-right">Expense Ratio</th>
                      <th className="border border-muted p-3 text-right">Total Annual Cost</th>
                      <th className="border border-muted p-3 text-right">10-Year Projection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((comparison, index) => (
                      <tr 
                        key={comparison.provider} 
                        className={`hover:bg-muted/25 ${comparison.provider === bestOption.provider ? 'bg-green-50 dark:bg-green-950/20' : ''}`}
                      >
                        <td className="border border-muted p-3">
                          <div className="flex items-center gap-2">
                            {comparison.provider}
                            {comparison.provider === bestOption.provider && (
                              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                Best Value
                              </span>
                            )}
                            {index === 0 && (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                Current
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="border border-muted p-3 text-right">${comparison.annualFee.toLocaleString()}</td>
                        <td className="border border-muted p-3 text-right">${comparison.expenseRatio.toLocaleString()}</td>
                        <td className="border border-muted p-3 text-right font-semibold">
                          ${comparison.totalAnnualCost.toLocaleString()}
                        </td>
                        <td className="border border-muted p-3 text-right font-semibold">
                          ${comparison.projectedCost10Year.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={saveToVault} className="flex-1">
                  <Vault className="h-4 w-4 mr-2" />
                  Save to Client Vault
                </Button>
                <Button variant="outline" className="flex-1">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vault Link Display */}
        {showVaultLink && (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Vault className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    Comparison Saved to Vault
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your fee comparison has been securely saved to your client's vault. 
                    You can access it anytime to review or share with your client.
                  </p>
                  <Button variant="link" className="p-0 h-auto text-green-600 hover:text-green-700">
                    View in Vault →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}