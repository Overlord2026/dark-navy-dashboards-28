import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PieChart, 
  TrendingUp, 
  AlertCircle, 
  Clock,
  DollarSign,
  FileText,
  Users,
  Calculator,
  Target,
  Shield
} from 'lucide-react';
import { useEstateRetirementIntegration } from '@/contexts/EstateRetirementIntegrationContext';
import { formatCurrency } from '@/lib/utils';

export function EstateSettlementAnalyzer() {
  const { 
    estateSettlement, 
    retirementData,
    beneficiaries,
    generateEstateSettlement,
    analyzing 
  } = useEstateRetirementIntegration();

  const [selectedRecommendation, setSelectedRecommendation] = useState<string>('');

  useEffect(() => {
    if (retirementData && beneficiaries.length > 0) {
      generateEstateSettlement();
    }
  }, [retirementData, beneficiaries, generateEstateSettlement]);

  useEffect(() => {
    if (estateSettlement?.recommendations.length > 0 && !selectedRecommendation) {
      setSelectedRecommendation(estateSettlement.recommendations[0].id);
    }
  }, [estateSettlement, selectedRecommendation]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'roth_conversion': return <Target className="h-4 w-4" />;
      case 'life_insurance': return <Shield className="h-4 w-4" />;
      case 'tax_strategy': return <Calculator className="h-4 w-4" />;
      case 'liquidity': return <DollarSign className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (analyzing) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <PieChart className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg font-medium">Analyzing Estate Settlement...</p>
            <p className="text-muted-foreground">
              Calculating settlement costs, tax burdens, and optimization strategies
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!estateSettlement) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Estate Analysis Available</h3>
          <p className="text-muted-foreground mb-4">
            Complete retirement planning data and add beneficiaries to generate estate settlement analysis.
          </p>
          <Button onClick={generateEstateSettlement} disabled={analyzing}>
            Generate Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  const taxEfficiencyRatio = (estateSettlement.stepUpBasisAssets / estateSettlement.totalEstate) * 100;
  const liquidityRatio = (estateSettlement.liquidityNeeds / estateSettlement.totalEstate) * 100;

  return (
    <div className="space-y-6">
      {/* Estate Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Estate</p>
                <p className="text-2xl font-bold">{formatCurrency(estateSettlement.totalEstate)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Step-Up Basis</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(estateSettlement.stepUpBasisAssets)}
                </p>
                <p className="text-xs text-muted-foreground">{taxEfficiencyRatio.toFixed(1)}% of estate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tax Burden</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(estateSettlement.beneficiaryTaxBurden)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Liquidity Need</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(estateSettlement.liquidityNeeds)}
                </p>
                <p className="text-xs text-muted-foreground">{liquidityRatio.toFixed(1)}% of estate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breakdown">Asset Breakdown</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="timeline">Implementation Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tax Treatment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Step-Up Basis Assets (Tax-Favorable)</span>
                      <span>{taxEfficiencyRatio.toFixed(1)}%</span>
                    </div>
                    <Progress value={taxEfficiencyRatio} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(estateSettlement.stepUpBasisAssets)} - No capital gains tax for heirs
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Ordinary Income Assets (Taxable)</span>
                      <span>{(100 - taxEfficiencyRatio).toFixed(1)}%</span>
                    </div>
                    <Progress value={100 - taxEfficiencyRatio} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(estateSettlement.ordinaryIncomeAssets)} - Taxed at ordinary rates
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Tax Optimization Opportunity</h4>
                  <p className="text-sm text-blue-600">
                    Converting {formatCurrency(estateSettlement.ordinaryIncomeAssets * 0.5)} to Roth accounts 
                    could save beneficiaries approximately {formatCurrency(estateSettlement.beneficiaryTaxBurden * 0.4)} in taxes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settlement Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between p-3 border rounded-lg">
                    <span className="text-sm">Estate Administration</span>
                    <span className="font-medium">
                      {formatCurrency(estateSettlement.estimatedSettlementCosts * 0.6)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 border rounded-lg">
                    <span className="text-sm">Legal & Professional Fees</span>
                    <span className="font-medium">
                      {formatCurrency(estateSettlement.estimatedSettlementCosts * 0.3)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 border rounded-lg">
                    <span className="text-sm">Court & Filing Costs</span>
                    <span className="font-medium">
                      {formatCurrency(estateSettlement.estimatedSettlementCosts * 0.1)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 border rounded-lg bg-red-50 border-red-200">
                    <span className="text-sm font-medium">Beneficiary Tax Impact</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(estateSettlement.beneficiaryTaxBurden)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-orange-800">Total Liquidity Required</h4>
                      <p className="text-sm text-orange-600">Cash needed for taxes & settlement</p>
                    </div>
                    <span className="text-xl font-bold text-orange-700">
                      {formatCurrency(estateSettlement.liquidityNeeds)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Optimization Strategies</h3>
              {estateSettlement.recommendations.map((rec) => (
                <Button
                  key={rec.id}
                  variant={selectedRecommendation === rec.id ? "default" : "outline"}
                  className="w-full justify-start p-3"
                  onClick={() => setSelectedRecommendation(rec.id)}
                >
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(rec.type)}
                    <div className="text-left">
                      <p className="text-sm font-medium">{rec.type.replace('_', ' ').toUpperCase()}</p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPriorityColor(rec.priority)}`}
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="col-span-2">
              {selectedRecommendation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {getTypeIcon(estateSettlement.recommendations.find(r => r.id === selectedRecommendation)?.type || '')}
                      <span className="ml-2">
                        {estateSettlement.recommendations.find(r => r.id === selectedRecommendation)?.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`ml-2 ${getPriorityColor(estateSettlement.recommendations.find(r => r.id === selectedRecommendation)?.priority || '')}`}
                      >
                        {estateSettlement.recommendations.find(r => r.id === selectedRecommendation)?.priority} priority
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const rec = estateSettlement.recommendations.find(r => r.id === selectedRecommendation);
                      if (!rec) return null;
                      
                      return (
                        <div className="space-y-4">
                          <p className="text-muted-foreground">{rec.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <DollarSign className="h-4 w-4 text-green-500" />
                                <span className="font-medium">Financial Impact</span>
                              </div>
                              <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(rec.impact)}
                              </p>
                              <p className="text-xs text-muted-foreground">Potential savings</p>
                            </div>
                            
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">Timeline</span>
                              </div>
                              <p className="text-lg font-semibold">{rec.timeline}</p>
                            </div>
                          </div>

                          {rec.type === 'roth_conversion' && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                              <h4 className="font-semibold text-green-800 mb-2">Roth Conversion Benefits</h4>
                              <ul className="text-sm text-green-600 space-y-1">
                                <li>• Reduces taxable inheritance for beneficiaries</li>
                                <li>• Eliminates required minimum distributions</li>
                                <li>• Provides tax-free growth for heirs</li>
                                <li>• Optimizes SECURE Act compliance</li>
                              </ul>
                            </div>
                          )}

                          {rec.type === 'life_insurance' && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                              <h4 className="font-semibold text-blue-800 mb-2">Life Insurance Strategy</h4>
                              <ul className="text-sm text-blue-600 space-y-1">
                                <li>• Provides immediate liquidity for estate taxes</li>
                                <li>• Tax-free death benefit to beneficiaries</li>
                                <li>• Preserves retirement assets for family</li>
                                <li>• Can be owned by irrevocable trust</li>
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Roadmap</CardTitle>
              <p className="text-sm text-muted-foreground">
                Prioritized timeline for estate optimization strategies
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {estateSettlement.recommendations
                  .sort((a, b) => {
                    const priorityOrder = { high: 1, medium: 2, low: 3 };
                    return priorityOrder[a.priority as keyof typeof priorityOrder] - 
                           priorityOrder[b.priority as keyof typeof priorityOrder];
                  })
                  .map((rec, index) => (
                    <div key={rec.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getTypeIcon(rec.type)}
                          <h4 className="font-semibold">{rec.type.replace('_', ' ').toUpperCase()}</h4>
                          <Badge 
                            variant="outline" 
                            className={getPriorityColor(rec.priority)}
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-2">{rec.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Timeline: {rec.timeline}</span>
                          <span className="text-sm font-bold text-green-600">
                            Impact: {formatCurrency(rec.impact)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}