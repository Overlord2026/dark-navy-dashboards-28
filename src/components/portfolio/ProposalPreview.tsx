import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Zap, 
  Download, 
  Send, 
  Eye,
  BarChart3,
  DollarSign,
  Shield,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ProposalPreviewProps {
  portfolio: any;
  selectedModels: string[];
  clientName: string;
  onProposalGenerated: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
  onGenerateAI: () => void;
  aiInsights: string;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const ProposalPreview: React.FC<ProposalPreviewProps> = ({
  portfolio,
  selectedModels,
  clientName,
  onProposalGenerated,
  onNext,
  onBack,
  onGenerateAI,
  aiInsights
}) => {
  const [customNotes, setCustomNotes] = useState('');
  const [proposalData, setProposalData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateProposalData();
  }, [portfolio, selectedModels]);

  const generateProposalData = () => {
    // Create comprehensive proposal data structure
    const data = {
      client: {
        name: clientName,
        proposal_date: new Date().toLocaleDateString(),
        advisor: 'Your Advisory Firm' // Would come from user profile
      },
      executive_summary: {
        current_value: portfolio.analysis.total_value,
        recommendations: selectedModels.length,
        key_changes: getKeyChanges(),
        expected_benefits: calculateExpectedBenefits()
      },
      current_portfolio: {
        total_value: portfolio.analysis.total_value,
        holdings_count: portfolio.analysis.holdings_count,
        asset_allocation: portfolio.analysis.asset_allocation,
        risk_score: portfolio.riskMetrics.overall_risk_score,
        annual_income: portfolio.incomeAnalysis.total_annual_income,
        annual_fees: portfolio.feeAnalysis.total_annual_fees
      },
      recommended_changes: generateRecommendedChanges(),
      implementation_plan: generateImplementationPlan(),
      fee_structure: {
        advisory_fee: 1.25,
        estimated_annual_cost: portfolio.analysis.total_value * 0.0125
      },
      disclaimers: getStandardDisclaimers()
    };

    setProposalData(data);
    onProposalGenerated(data);
  };

  const getKeyChanges = () => {
    return [
      'Reduce concentration risk in largest holdings',
      'Optimize asset allocation for better diversification',
      'Lower overall portfolio fees through ETF replacements',
      'Enhance income generation through strategic positioning'
    ];
  };

  const calculateExpectedBenefits = () => {
    return {
      risk_reduction: 15,
      return_enhancement: 1.2,
      fee_savings: portfolio.feeAnalysis.fee_optimization_savings,
      diversification_improvement: 25
    };
  };

  const generateRecommendedChanges = () => {
    // Mock recommended changes - would be calculated from model comparison
    return [
      {
        action: 'Reduce',
        security: 'Individual Stock Positions',
        current_weight: 35,
        target_weight: 20,
        rationale: 'Reduce concentration risk and improve diversification'
      },
      {
        action: 'Increase',
        security: 'International Equity Exposure',
        current_weight: 15,
        target_weight: 25,
        rationale: 'Enhance global diversification and growth potential'
      },
      {
        action: 'Add',
        security: 'Real Estate Investment Trusts',
        current_weight: 0,
        target_weight: 10,
        rationale: 'Inflation protection and income generation'
      },
      {
        action: 'Replace',
        security: 'High-Fee Mutual Funds',
        current_weight: 25,
        target_weight: 0,
        rationale: 'Reduce costs through low-cost ETF alternatives'
      }
    ];
  };

  const generateImplementationPlan = () => {
    return [
      {
        phase: 'Phase 1 (Immediate)',
        timeframe: '0-30 days',
        actions: [
          'Replace high-fee mutual funds with low-cost ETFs',
          'Reduce largest individual position to under 10%',
          'Implement tax-loss harvesting opportunities'
        ]
      },
      {
        phase: 'Phase 2 (Short-term)',
        timeframe: '1-3 months',
        actions: [
          'Gradually increase international allocation',
          'Add REIT exposure for diversification',
          'Optimize fixed income duration and quality'
        ]
      },
      {
        phase: 'Phase 3 (Ongoing)',
        timeframe: 'Quarterly',
        actions: [
          'Rebalance to target allocations',
          'Review and adjust based on market conditions',
          'Monitor performance and make tactical adjustments'
        ]
      }
    ];
  };

  const getStandardDisclaimers = () => {
    return [
      'Past performance does not guarantee future results.',
      'All investments involve risk, including potential loss of principal.',
      'Investment recommendations are based on current market conditions and may change.',
      'This proposal is for informational purposes and should not be considered as investment advice without consultation.'
    ];
  };

  const getCurrentVsProposedData = () => {
    if (!proposalData) return [];
    
    return Object.entries(portfolio.analysis.asset_allocation).map(([assetClass, currentWeight]) => ({
      asset_class: assetClass.replace('_', ' ').toUpperCase(),
      current: Number(currentWeight),
      proposed: Number(currentWeight) * (1 + (Math.random() - 0.5) * 0.3) // Mock proposed allocation
    }));
  };

  if (!proposalData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Proposal Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Investment Proposal</CardTitle>
          <CardDescription>
            Prepared for {proposalData.client.name} on {proposalData.client.proposal_date}
          </CardDescription>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="outline" className="px-3 py-1">
              <DollarSign className="h-4 w-4 mr-1" />
              ${proposalData.current_portfolio.total_value.toLocaleString()} Portfolio
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <FileText className="h-4 w-4 mr-1" />
              {proposalData.current_portfolio.holdings_count} Holdings
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Current Portfolio Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Value:</span>
                  <span className="font-medium">${proposalData.current_portfolio.total_value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Risk Score:</span>
                  <span className="font-medium">{proposalData.current_portfolio.risk_score}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Income:</span>
                  <span className="font-medium">${proposalData.current_portfolio.annual_income.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Fees:</span>
                  <span className="font-medium">${proposalData.current_portfolio.annual_fees.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Expected Benefits</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Risk Reduction:</span>
                  <span className="font-medium text-green-600">-{proposalData.executive_summary.expected_benefits.risk_reduction}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Return Enhancement:</span>
                  <span className="font-medium text-green-600">+{proposalData.executive_summary.expected_benefits.return_enhancement}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Annual Fee Savings:</span>
                  <span className="font-medium text-green-600">${proposalData.executive_summary.expected_benefits.fee_savings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Diversification:</span>
                  <span className="font-medium text-blue-600">+{proposalData.executive_summary.expected_benefits.diversification_improvement}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current vs Proposed Allocation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Current vs Proposed Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getCurrentVsProposedData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="asset_class" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name === 'current' ? 'Current' : 'Proposed']} />
                <Bar dataKey="current" fill="hsl(var(--muted))" name="current" />
                <Bar dataKey="proposed" fill="hsl(var(--primary))" name="proposed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Changes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Recommended Changes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proposalData.recommended_changes.map((change: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      change.action === 'Add' ? 'default' :
                      change.action === 'Increase' ? 'secondary' :
                      change.action === 'Reduce' ? 'outline' : 'destructive'
                    }>
                      {change.action}
                    </Badge>
                    <span className="font-medium">{change.security}</span>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-2">
                      <span>{change.current_weight}%</span>
                      <ArrowRight className="h-3 w-3" />
                      <span className="font-medium">{change.target_weight}%</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{change.rationale}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Implementation Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {proposalData.implementation_plan.map((phase: any, index: number) => (
              <div key={index}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{phase.phase}</h4>
                    <p className="text-sm text-gray-500">{phase.timeframe}</p>
                  </div>
                </div>
                <ul className="ml-11 space-y-2">
                  {phase.actions.map((action: string, actionIndex: number) => (
                    <li key={actionIndex} className="text-sm flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI-Generated Insights
          </CardTitle>
          <CardDescription>
            Additional analysis and recommendations powered by AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          {aiInsights ? (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{aiInsights}</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Zap className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 mb-4">Generate AI-powered insights for this proposal</p>
              <Button onClick={onGenerateAI}>
                Generate AI Insights
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Notes & Comments</CardTitle>
          <CardDescription>
            Add personalized notes or modifications to this proposal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Enter any custom notes, special considerations, or modifications for this client..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Fee Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Fee Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span>Advisory Fee:</span>
              <span className="font-medium">{proposalData.fee_structure.advisory_fee}% annually</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Estimated Annual Cost:</span>
              <span className="font-medium">${proposalData.fee_structure.estimated_annual_cost.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Fee is calculated quarterly based on account value and includes ongoing management and rebalancing.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          Back to Models
        </Button>
        <Button onClick={onNext} className="flex-1">
          Proceed to Export
        </Button>
      </div>
    </div>
  );
};