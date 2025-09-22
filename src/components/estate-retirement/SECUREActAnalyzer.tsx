import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Users, 
  Calculator,
  ArrowRight,
  Shield
} from 'lucide-react';
import { useEstateRetirementIntegration } from '@/contexts/EstateRetirementIntegrationContext';
import { formatCurrency } from '@/lib/utils';

export function SECUREActAnalyzer() {
  const { 
    secureActAnalysis, 
    beneficiaries, 
    retirementData,
    analyzeSecureActImpact,
    analyzing 
  } = useEstateRetirementIntegration();

  const [selectedAccount, setSelectedAccount] = useState<string>('');

  useEffect(() => {
    if (retirementData?.accounts && beneficiaries.length > 0) {
      analyzeSecureActImpact(retirementData.accounts);
    }
  }, [retirementData, beneficiaries, analyzeSecureActImpact]);

  useEffect(() => {
    if (secureActAnalysis.length > 0 && !selectedAccount) {
      setSelectedAccount(secureActAnalysis[0].accountId);
    }
  }, [secureActAnalysis, selectedAccount]);

  const selectedAnalysis = secureActAnalysis.find(a => a.accountId === selectedAccount);
  const totalBeneficiaryTaxBurden = secureActAnalysis.reduce((sum, analysis) => 
    sum + analysis.inheritanceTaxImpact.totalTaxes, 0
  );
  const totalRothConversionSavings = secureActAnalysis.reduce((sum, analysis) => 
    sum + analysis.rothConversionBenefit.lifetimeSavings, 0
  );

  if (analyzing) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Calculator className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg font-medium">Analyzing SECURE Act Impact...</p>
            <p className="text-muted-foreground">
              Calculating 10-year withdrawal requirements and tax optimization strategies
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (secureActAnalysis.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Retirement Accounts Analysis</h3>
          <p className="text-muted-foreground mb-4">
            Add retirement account data and beneficiary information to analyze SECURE Act impact.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tax Burden</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalBeneficiaryTaxBurden)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Roth Conversion Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalRothConversionSavings)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Beneficiaries</p>
                <p className="text-2xl font-bold">{beneficiaries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            SECURE Act Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Account to Analyze:</label>
              <div className="flex flex-wrap gap-2">
                {secureActAnalysis.map((analysis) => (
                  <Button
                    key={analysis.accountId}
                    variant={selectedAccount === analysis.accountId ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedAccount(analysis.accountId)}
                  >
                    {analysis.accountType.toUpperCase()} - {formatCurrency(analysis.currentBalance)}
                  </Button>
                ))}
              </div>
            </div>

            {selectedAnalysis && (
              <Tabs defaultValue="impact" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="impact">Tax Impact</TabsTrigger>
                  <TabsTrigger value="withdrawals">10-Year Schedule</TabsTrigger>  
                  <TabsTrigger value="conversions">Roth Strategy</TabsTrigger>
                </TabsList>

                <TabsContent value="impact" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Current Situation</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>Current Balance:</span>
                          <span className="font-medium">{formatCurrency(selectedAnalysis.currentBalance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Projected at Inheritance:</span>
                          <span className="font-medium">{formatCurrency(selectedAnalysis.projectedBalance)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>Total Tax Burden:</span>
                          <span className="font-bold">
                            {formatCurrency(selectedAnalysis.inheritanceTaxImpact.totalTaxes)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-green-600">With Roth Conversions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>Potential Savings:</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(selectedAnalysis.rothConversionBenefit.lifetimeSavings)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax Efficiency:</span>
                          <Badge variant="outline" className="text-green-600">
                            {Math.round((selectedAnalysis.rothConversionBenefit.lifetimeSavings / selectedAnalysis.inheritanceTaxImpact.totalTaxes) * 100)}% Reduction
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="withdrawals" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Required 10-Year Withdrawal Schedule</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        SECURE Act requires inherited retirement accounts to be fully distributed within 10 years
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedAnalysis.inheritanceTaxImpact.yearlyWithdrawals.map((withdrawal, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline">Year {index + 1}</Badge>
                              <span className="text-sm">{withdrawal.year}</span>
                            </div>
                            <div className="text-right space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">Withdrawal:</span>
                                <span className="font-medium">{formatCurrency(withdrawal.withdrawal)}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-red-600">
                                <span className="text-sm">Taxes:</span>
                                <span className="font-medium">{formatCurrency(withdrawal.taxes)}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-green-600">
                                <span className="text-sm">After-Tax:</span>
                                <span className="font-bold">{formatCurrency(withdrawal.afterTaxAmount)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="conversions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ArrowRight className="h-5 w-5 mr-2 text-green-500" />
                        Recommended Roth Conversion Strategy
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Convert traditional retirement funds to Roth to reduce beneficiary tax burden
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedAnalysis.rothConversionBenefit.recommendedConversions.map((conversion, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Badge>Year {conversion.year}</Badge>
                                <span className="font-medium">Convert {formatCurrency(conversion.amount)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Tax cost: {formatCurrency(conversion.taxCost)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">
                                +{formatCurrency(conversion.beneficiarySavings)}
                              </p>
                              <p className="text-xs text-muted-foreground">Beneficiary Savings</p>
                            </div>
                          </div>
                        ))}
                        
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-green-800">Total Strategy Impact</h4>
                              <p className="text-sm text-green-600">
                                Lifetime tax savings for your beneficiaries
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-700">
                                {formatCurrency(selectedAnalysis.rothConversionBenefit.lifetimeSavings)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}