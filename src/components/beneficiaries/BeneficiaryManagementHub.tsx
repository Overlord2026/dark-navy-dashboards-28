import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Users, AlertTriangle, TrendingUp, MapPin, DollarSign } from 'lucide-react';
import { BeneficiaryAnalysis, BeneficiaryGap, AdvancedEstateStrategy } from '@/types/beneficiary-management';
import { beneficiaryAnalyzer } from '@/lib/beneficiary/beneficiaryAnalyzer';

interface BeneficiaryManagementHubProps {
  accounts?: Array<{ id: string; name: string; type: string; balance: number }>;
  clientState?: string;
  maritalStatus?: 'single' | 'married';
  hasChildren?: boolean;
}

export const BeneficiaryManagementHub: React.FC<BeneficiaryManagementHubProps> = ({
  accounts = [],
  clientState = 'CA',
  maritalStatus = 'single',
  hasChildren = false
}) => {
  const [analysis, setAnalysis] = useState<BeneficiaryAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock beneficiary data - in real implementation, this would come from Supabase
    const mockBeneficiaries = [
      {
        id: '1',
        account_id: accounts[0]?.id || '1',
        beneficiary_type: 'primary' as const,
        beneficiary_name: 'Spouse Name',
        relationship: 'spouse',
        percentage: 100,
        per_stirpes: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const mockAccounts = accounts.length > 0 ? accounts : [
      { id: '1', name: '401(k) - Main', type: 'retirement', balance: 850000 },
      { id: '2', name: 'Brokerage Account', type: 'investment', balance: 2100000 },
      { id: '3', name: 'Life Insurance', type: 'insurance', balance: 1000000 }
    ];

    const result = beneficiaryAnalyzer.generateFullAnalysis(
      mockAccounts,
      mockBeneficiaries,
      clientState,
      maritalStatus,
      hasChildren
    );

    setAnalysis(result);
    setLoading(false);
  }, [accounts, clientState, maritalStatus, hasChildren]);

  if (loading || !analysis) {
    return <div className="flex items-center justify-center h-64">Loading beneficiary analysis...</div>;
  }

  const completionPercentage = Math.round(
    (analysis.accounts_with_beneficiaries / analysis.total_accounts) * 100
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficiary Completion</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <Progress value={completionPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analysis.total_asset_value)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(analysis.undesignated_asset_value)} undesignated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Gaps</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysis.gaps.filter(g => g.severity === 'critical').length}
            </div>
            <p className="text-xs text-destructive">
              Immediate attention required
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Probate Risk</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analysis.estimated_probate_costs)}</div>
            <p className="text-xs text-muted-foreground">
              Estimated probate costs
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gaps" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gaps">Beneficiary Gaps</TabsTrigger>
          <TabsTrigger value="strategies">Advanced Strategies</TabsTrigger>
          <TabsTrigger value="state-rules">State Tax Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="gaps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Beneficiary Designation Gaps</CardTitle>
              <CardDescription>
                Critical issues requiring immediate attention to avoid probate and estate complications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.gaps.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Excellent! No beneficiary designation gaps detected. Your estate planning is well-structured.
                  </AlertDescription>
                </Alert>
              ) : (
                analysis.gaps.map((gap, index) => (
                  <Alert key={index} variant={gap.severity === 'critical' ? 'destructive' : 'default'}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {gap.account_name} ({formatCurrency(gap.account_value)})
                          </div>
                          <div className="text-sm">{gap.description}</div>
                          <div className="text-sm font-medium text-primary">
                            Recommendation: {gap.recommendation}
                          </div>
                          {gap.estimated_probate_cost && (
                            <div className="text-sm text-destructive">
                              Potential probate cost: {formatCurrency(gap.estimated_probate_cost)}
                            </div>
                          )}
                        </div>
                        <Badge variant={getSeverityColor(gap.severity) as any}>
                          {gap.severity}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Estate Planning Strategies</CardTitle>
              <CardDescription>
                Sophisticated strategies to minimize estate taxes and optimize wealth transfer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.recommended_strategies.map((strategy, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg capitalize">
                        {strategy.strategy_type.replace('_', ' ')} Strategy
                      </CardTitle>
                      <Badge variant={strategy.recommended ? 'default' : 'secondary'}>
                        {strategy.recommended ? 'Recommended' : 'Optional'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Estate Tax Savings</div>
                        <div className="font-semibold text-green-600">
                          {formatCurrency(strategy.tax_benefits.estate_tax_savings)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Gift Tax Savings</div>
                        <div className="font-semibold text-green-600">
                          {formatCurrency(strategy.tax_benefits.gift_tax_savings)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Implementation</div>
                        <div className="font-semibold text-primary">
                          {strategy.implemented ? 'Complete' : 'Pending'}
                        </div>
                      </div>
                    </div>

                    {strategy.strategy_details.trust_value && (
                      <div className="text-sm">
                        <strong>Trust Value:</strong> {formatCurrency(strategy.strategy_details.trust_value)}
                      </div>
                    )}

                    <Button variant="outline" className="w-full">
                      Learn More About This Strategy
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="state-rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                State-Specific Estate Tax Rules
              </CardTitle>
              <CardDescription>
                Tax implications and planning considerations for your state of residence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.state_specific_considerations.map((rule, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{rule.state}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">State Exemption</div>
                        <div className="font-semibold">
                          {rule.exemption_amount > 0 
                            ? formatCurrency(rule.exemption_amount)
                            : 'No State Estate Tax'
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Portability</div>
                        <div className="font-semibold">
                          {rule.portability_recognized ? 'Recognized' : 'Not Recognized'}
                        </div>
                      </div>
                    </div>

                    {rule.tax_rate_schedule.length > 0 && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Tax Rate Schedule</div>
                        <div className="space-y-1">
                          {rule.tax_rate_schedule.map((bracket, idx) => (
                            <div key={idx} className="text-sm flex justify-between">
                              <span>
                                {formatCurrency(bracket.min_amount)} - {bracket.max_amount ? formatCurrency(bracket.max_amount) : 'Above'}
                              </span>
                              <span className="font-medium">{(bracket.rate * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};