import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Calendar,
  Shield,
  FileText,
  Calculator,
  User,
  AlertTriangle,
  CheckCircle,
  Target
} from 'lucide-react';
import { MonitoringPanel } from './MonitoringPanel';
import { ReceiptTable } from './ReceiptTable';

interface PhaseData {
  id: string;
  name: string;
  years: string;
  color: string;
  annualIncome: number;
  annualExpenses: number;
  coverageRatio: number;
  assetAllocation: {
    stocks: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
  actionSteps: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface DashboardMetrics {
  successProbability: number;
  withdrawalRate: number;
  yearsUntilDepletion: number;
  currentTaxBracket: string;
}

interface ScenarioResult {
  id: string;
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  adjustedSuccess: number;
}

const mockPhaseData: PhaseData[] = [
  {
    id: 'income_now',
    name: 'Income Now',
    years: 'Years 1-2',
    color: 'bg-blue-500',
    annualIncome: 75000,
    annualExpenses: 72000,
    coverageRatio: 104,
    assetAllocation: { stocks: 60, bonds: 30, cash: 8, alternatives: 2 },
    actionSteps: [
      'Optimize Social Security timing',
      'Review immediate annuity options',
      'Establish emergency cash reserves'
    ],
    riskLevel: 'Low'
  },
  {
    id: 'income_later',
    name: 'Income Later',
    years: 'Years 3-12',
    color: 'bg-green-500',
    annualIncome: 68000,
    annualExpenses: 70000,
    coverageRatio: 97,
    assetAllocation: { stocks: 65, bonds: 25, cash: 5, alternatives: 5 },
    actionSteps: [
      'Begin Roth IRA conversions',
      'Consider deferred annuities',
      'Plan for Medicare transition'
    ],
    riskLevel: 'Medium'
  },
  {
    id: 'growth',
    name: 'Growth',
    years: '12+ Years',
    color: 'bg-purple-500',
    annualIncome: 85000,
    annualExpenses: 75000,
    coverageRatio: 113,
    assetAllocation: { stocks: 70, bonds: 20, cash: 3, alternatives: 7 },
    actionSteps: [
      'Maximize growth investments',
      'Estate planning optimization',
      'Tax-loss harvesting strategy'
    ],
    riskLevel: 'Medium'
  },
  {
    id: 'legacy',
    name: 'Legacy',
    years: 'Ongoing',
    color: 'bg-orange-500',
    annualIncome: 60000,
    annualExpenses: 55000,
    coverageRatio: 109,
    assetAllocation: { stocks: 50, bonds: 35, cash: 10, alternatives: 5 },
    actionSteps: [
      'Establish charitable giving strategy',
      'Update beneficiary designations',
      'Consider trust structures'
    ],
    riskLevel: 'Low'
  }
];

const mockMetrics: DashboardMetrics = {
  successProbability: 87,
  withdrawalRate: 3.8,
  yearsUntilDepletion: 32,
  currentTaxBracket: '22%'
};

const mockScenarios: ScenarioResult[] = [
  {
    id: 'market_downturn',
    name: 'Market Downturn',
    impact: 'negative',
    description: '2008-style crash reduces success probability',
    adjustedSuccess: 74
  },
  {
    id: 'roth_conversion',
    name: 'Roth Conversions',
    impact: 'positive',
    description: 'Tax optimization improves long-term outlook',
    adjustedSuccess: 92
  }
];

export const SWAGPhaseDashboard = () => {
  const [selectedPhase, setSelectedPhase] = useState<string>('income_now');
  const [activeTab, setActiveTab] = useState('overview');

  const selectedPhaseData = mockPhaseData.find(phase => phase.id === selectedPhase);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCoverageColor = (ratio: number) => {
    if (ratio >= 100) return 'text-green-600';
    if (ratio >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your SWAG GPS Retirement Roadmap</h1>
        <p className="text-muted-foreground">Comprehensive analysis across all four phases</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Probability</p>
                <p className="text-2xl font-bold text-green-600">{mockMetrics.successProbability}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Withdrawal Rate</p>
                <p className="text-2xl font-bold">{mockMetrics.withdrawalRate}%</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Years Until Depletion</p>
                <p className="text-2xl font-bold">{mockMetrics.yearsUntilDepletion}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tax Bracket</p>
                <p className="text-2xl font-bold">{mockMetrics.currentTaxBracket}</p>
              </div>
              <Calculator className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {mockPhaseData.map((phase) => (
          <Card
            key={phase.id}
            className={`cursor-pointer transition-all ${
              selectedPhase === phase.id 
                ? 'ring-2 ring-primary shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedPhase(phase.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-4 h-4 ${phase.color} rounded-full`} />
                <div>
                  <h3 className="font-semibold">{phase.name}</h3>
                  <p className="text-sm text-muted-foreground">{phase.years}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Income:</span>
                  <span className="font-medium">{formatCurrency(phase.annualIncome)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Expenses:</span>
                  <span className="font-medium">{formatCurrency(phase.annualExpenses)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Coverage:</span>
                  <span className={`font-bold ${getCoverageColor(phase.coverageRatio)}`}>
                    {phase.coverageRatio}%
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Badge className={getRiskColor(phase.riskLevel)} variant="outline">
                  {phase.riskLevel} Risk
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Phase View */}
      {selectedPhaseData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className={`w-6 h-6 ${selectedPhaseData.color} rounded-full`} />
              <span>{selectedPhaseData.name} Phase Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
                <TabsTrigger value="actions">Action Steps</TabsTrigger>
                <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                <TabsTrigger value="receipts">Receipts</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Income vs Expenses</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-green-600">Annual Income</span>
                          <span className="font-bold">{formatCurrency(selectedPhaseData.annualIncome)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-600">Annual Expenses</span>
                          <span className="font-bold">{formatCurrency(selectedPhaseData.annualExpenses)}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between">
                            <span>Net Cash Flow</span>
                            <span className={`font-bold ${
                              selectedPhaseData.annualIncome - selectedPhaseData.annualExpenses >= 0 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {formatCurrency(selectedPhaseData.annualIncome - selectedPhaseData.annualExpenses)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Coverage Analysis</h4>
                      <div className="text-center">
                        <div className={`text-4xl font-bold mb-2 ${getCoverageColor(selectedPhaseData.coverageRatio)}`}>
                          {selectedPhaseData.coverageRatio}%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedPhaseData.coverageRatio >= 100 
                            ? 'Expenses fully covered' 
                            : 'Shortfall requires attention'
                          }
                        </p>
                        <Progress 
                          value={Math.min(selectedPhaseData.coverageRatio, 100)} 
                          className="mt-3" 
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Risk Profile</h4>
                      <div className="text-center">
                        <Badge className={`${getRiskColor(selectedPhaseData.riskLevel)} text-lg px-4 py-2`}>
                          {selectedPhaseData.riskLevel} Risk
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">
                          Based on asset allocation and time horizon
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="allocation" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-4">Recommended Asset Allocation</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Stocks</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${selectedPhaseData.assetAllocation.stocks}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{selectedPhaseData.assetAllocation.stocks}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span>Bonds</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${selectedPhaseData.assetAllocation.bonds}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{selectedPhaseData.assetAllocation.bonds}%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span>Cash</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-600 h-2 rounded-full" 
                                style={{ width: `${selectedPhaseData.assetAllocation.cash}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{selectedPhaseData.assetAllocation.cash}%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span>Alternatives</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${selectedPhaseData.assetAllocation.alternatives}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{selectedPhaseData.assetAllocation.alternatives}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-4">Investment Recommendations</h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-blue-900">Stock Allocation</h5>
                          <p className="text-sm text-blue-700">Focus on diversified index funds with low fees</p>
                        </div>
                        
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-green-900">Bond Allocation</h5>
                          <p className="text-sm text-green-700">Consider Treasury ladders and high-grade corporates</p>
                        </div>

                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <h5 className="font-medium text-yellow-900">Cash Reserve</h5>
                          <p className="text-sm text-yellow-700">High-yield savings for immediate needs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-4">Top Priority Action Steps</h4>
                    <div className="space-y-4">
                      {selectedPhaseData.actionSteps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                          <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{step}</p>
                          </div>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <User className="h-6 w-6 text-primary" />
                        <div>
                          <h5 className="font-semibold">Ready to take action?</h5>
                          <p className="text-sm text-muted-foreground">
                            Schedule a consultation with one of our advisors to implement these strategies
                          </p>
                        </div>
                      </div>
                      <Button className="mt-3">Book Your Review</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scenarios" className="mt-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Stress Test Results</h4>
                  
                  {mockScenarios.map((scenario) => (
                    <Card key={scenario.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {scenario.impact === 'positive' ? (
                              <TrendingUp className="h-6 w-6 text-green-600" />
                            ) : scenario.impact === 'negative' ? (
                              <TrendingDown className="h-6 w-6 text-red-600" />
                            ) : (
                              <AlertTriangle className="h-6 w-6 text-yellow-600" />
                            )}
                            <div>
                              <h5 className="font-semibold">{scenario.name}</h5>
                              <p className="text-sm text-muted-foreground">{scenario.description}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Adjusted Success Rate</p>
                            <p className={`text-xl font-bold ${
                              scenario.adjustedSuccess >= mockMetrics.successProbability 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {scenario.adjustedSuccess}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Target className="h-12 w-12 text-primary mx-auto mb-3" />
                        <h5 className="font-semibold mb-2">Want to test more scenarios?</h5>
                        <p className="text-sm text-muted-foreground mb-4">
                          Run additional stress tests and "what-if" analyses with our scenario planning tools
                        </p>
                        <Button variant="outline">Run More Scenarios</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="monitoring" className="mt-6">
                <MonitoringPanel 
                  metrics={{
                    ISP: 0.87,
                    DGBP: 0.15,
                    LCR: 1.24,
                    LCI: 0.78,
                    ATE: 0.82,
                    OS: 84
                  }}
                  proposals={[]}
                />
              </TabsContent>

              <TabsContent value="receipts" className="mt-6">
                <ReceiptTable receipts={[]} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Export and Next Steps */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Export PDF Report</span>
        </Button>
        
        <Button className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>Schedule Advisor Review</span>
        </Button>
        
        <Button variant="outline" className="flex items-center space-x-2">
          <Calculator className="h-4 w-4" />
          <span>Run More Scenarios</span>
        </Button>
      </div>
    </div>
  );
};