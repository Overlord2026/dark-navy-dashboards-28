import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Shield, 
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { RiskScoreCalculator } from './RiskScoreCalculator';

interface Portfolio {
  name: string;
  holdings: any[];
  analysis: any;
  riskMetrics: any;
  incomeAnalysis: any;
  feeAnalysis: any;
  riskScore?: number;
  riskLevel?: string;
}

interface SideBySideComparisonProps {
  currentPortfolio: Portfolio;
  proposedPortfolio: Portfolio;
  clientName: string;
  riskProfile?: {
    age?: number;
    timeHorizon?: number;
    riskTolerance?: 'conservative' | 'moderate' | 'growth' | 'aggressive';
  };
  onScheduleReview?: () => void;
  className?: string;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const SideBySideComparison: React.FC<SideBySideComparisonProps> = ({
  currentPortfolio,
  proposedPortfolio,
  clientName,
  riskProfile,
  onScheduleReview,
  className = ''
}) => {
  const calculateImpact = () => {
    const current = currentPortfolio;
    const proposed = proposedPortfolio;
    
    const riskChange = (proposed.riskScore || 50) - (current.riskScore || 50);
    const incomeChange = ((proposed.incomeAnalysis.total_annual_income - current.incomeAnalysis.total_annual_income) / current.incomeAnalysis.total_annual_income) * 100;
    const feeChange = ((proposed.feeAnalysis.total_annual_fees - current.feeAnalysis.total_annual_fees) / current.feeAnalysis.total_annual_fees) * 100;
    
    return {
      riskChange,
      incomeChange,
      feeChange,
      incomeAmount: proposed.incomeAnalysis.total_annual_income - current.incomeAnalysis.total_annual_income,
      feeAmount: proposed.feeAnalysis.total_annual_fees - current.feeAnalysis.total_annual_fees
    };
  };

  const generateSummary = () => {
    const impact = calculateImpact();
    const currentRiskLevel = current.riskLevel || 'Moderate';
    const proposedRiskLevel = proposed.riskLevel || 'Moderate';
    
    let summary = `${clientName}, your current portfolio has a risk score of ${current.riskScore || 50} (${currentRiskLevel}). `;
    
    if (impact.riskChange < -5) {
      summary += `Our recommended portfolio would lower your risk to ${proposed.riskScore || 50} (${proposedRiskLevel}), `;
    } else if (impact.riskChange > 5) {
      summary += `Our recommended portfolio would increase your risk to ${proposed.riskScore || 50} (${proposedRiskLevel}) for higher growth potential, `;
    } else {
      summary += `Our recommended portfolio maintains similar risk at ${proposed.riskScore || 50} (${proposedRiskLevel}) while `;
    }
    
    if (impact.incomeChange > 0) {
      summary += `and increase your estimated annual income by ${impact.incomeChange.toFixed(1)}% (${impact.incomeAmount >= 0 ? '+' : ''}$${Math.abs(impact.incomeAmount).toLocaleString()}).`;
    } else if (impact.incomeChange < 0) {
      summary += `with a temporary reduction in income of ${Math.abs(impact.incomeChange).toFixed(1)}% for better long-term growth.`;
    } else {
      summary += `maintaining similar income levels.`;
    }
    
    return summary;
  };

  const getComparisonData = () => {
    const currentAllocation = Object.entries(currentPortfolio.analysis.asset_allocation).map(([key, value]) => ({
      asset_class: key.replace('_', ' ').toUpperCase(),
      current: Number(value),
      proposed: Number(proposedPortfolio.analysis.asset_allocation[key] || 0)
    }));
    
    return currentAllocation;
  };

  const getPieChartData = (portfolio: Portfolio) => {
    return Object.entries(portfolio.analysis.asset_allocation).map(([key, value]) => ({
      name: key.replace('_', ' ').toUpperCase(),
      value: Number(value),
      percentage: `${Number(value).toFixed(1)}%`
    }));
  };

  const current = currentPortfolio;
  const proposed = proposedPortfolio;
  const impact = calculateImpact();
  const summary = generateSummary();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Portfolio Comparison Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed mb-4">{summary}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Risk Change</span>
              </div>
              <div className="flex items-center gap-2">
                {impact.riskChange < 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-600" />
                ) : impact.riskChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-red-600" />
                ) : null}
                <span className={`font-medium ${
                  impact.riskChange < 0 ? 'text-green-600' : 
                  impact.riskChange > 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {impact.riskChange > 0 ? '+' : ''}{impact.riskChange.toFixed(0)} points
                </span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Income Change</span>
              </div>
              <div className="flex items-center gap-2">
                {impact.incomeChange > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`font-medium ${impact.incomeChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {impact.incomeChange > 0 ? '+' : ''}{impact.incomeChange.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Fee Impact</span>
              </div>
              <div className="flex items-center gap-2">
                {impact.feeChange < 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-600" />
                )}
                <span className={`font-medium ${impact.feeChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {impact.feeChange > 0 ? '+' : ''}{impact.feeChange.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {onScheduleReview && (
            <div className="text-center">
              <Button onClick={onScheduleReview} className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Your Retirement Roadmap Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Side-by-Side Risk Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Portfolio</CardTitle>
            <CardDescription>${current.analysis.total_value.toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskScoreCalculator 
              portfolio={current} 
              riskProfile={riskProfile}
              className="border-0 shadow-none p-0"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommended Portfolio</CardTitle>
            <CardDescription>${proposed.analysis.total_value.toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskScoreCalculator 
              portfolio={proposed} 
              riskProfile={riskProfile}
              className="border-0 shadow-none p-0"
            />
          </CardContent>
        </Card>
      </div>

      {/* Allocation Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Asset Allocation Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getComparisonData()}>
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

          {/* Pie Charts Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-center">Current Allocation</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={getPieChartData(current)}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="hsl(var(--muted))"
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}`}
                    >
                      {getPieChartData(current).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-center">Proposed Allocation</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={getPieChartData(proposed)}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                      label={({ name, percentage }) => `${name}: ${percentage}`}
                    >
                      {getPieChartData(proposed).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Metric</th>
                  <th className="text-center py-2">Current</th>
                  <th className="text-center py-2">Proposed</th>
                  <th className="text-center py-2">Change</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b">
                  <td className="py-2 font-medium">Risk Score</td>
                  <td className="text-center">{current.riskScore || 50}</td>
                  <td className="text-center">{proposed.riskScore || 50}</td>
                  <td className="text-center">
                    <span className={impact.riskChange < 0 ? 'text-green-600' : impact.riskChange > 0 ? 'text-red-600' : 'text-gray-600'}>
                      {impact.riskChange > 0 ? '+' : ''}{impact.riskChange.toFixed(0)}
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Annual Income</td>
                  <td className="text-center">${current.incomeAnalysis.total_annual_income.toLocaleString()}</td>
                  <td className="text-center">${proposed.incomeAnalysis.total_annual_income.toLocaleString()}</td>
                  <td className="text-center">
                    <span className={impact.incomeChange > 0 ? 'text-green-600' : 'text-red-600'}>
                      {impact.incomeChange > 0 ? '+' : ''}{impact.incomeChange.toFixed(1)}%
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Annual Fees</td>
                  <td className="text-center">${current.feeAnalysis.total_annual_fees.toLocaleString()}</td>
                  <td className="text-center">${proposed.feeAnalysis.total_annual_fees.toLocaleString()}</td>
                  <td className="text-center">
                    <span className={impact.feeChange < 0 ? 'text-green-600' : 'text-red-600'}>
                      {impact.feeChange > 0 ? '+' : ''}{impact.feeChange.toFixed(1)}%
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Holdings Count</td>
                  <td className="text-center">{current.analysis.holdings_count}</td>
                  <td className="text-center">{proposed.analysis.holdings_count}</td>
                  <td className="text-center">
                    {proposed.analysis.holdings_count - current.analysis.holdings_count > 0 ? '+' : ''}
                    {proposed.analysis.holdings_count - current.analysis.holdings_count}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Largest Position %</td>
                  <td className="text-center">{current.analysis.largest_position_weight.toFixed(1)}%</td>
                  <td className="text-center">{proposed.analysis.largest_position_weight.toFixed(1)}%</td>
                  <td className="text-center">
                    <span className={proposed.analysis.largest_position_weight < current.analysis.largest_position_weight ? 'text-green-600' : 'text-red-600'}>
                      {proposed.analysis.largest_position_weight - current.analysis.largest_position_weight > 0 ? '+' : ''}
                      {(proposed.analysis.largest_position_weight - current.analysis.largest_position_weight).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};