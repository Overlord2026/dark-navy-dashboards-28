import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Shield,
  Target,
  Percent
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface PortfolioAnalysisProps {
  portfolio: any;
  onNext: () => void;
  onBack: () => void;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const PortfolioAnalysis: React.FC<PortfolioAnalysisProps> = ({
  portfolio,
  onNext,
  onBack
}) => {
  const { holdings, analysis, riskMetrics, incomeAnalysis, feeAnalysis } = portfolio;

  const assetAllocationData = Object.entries(analysis.asset_allocation).map(([key, value]) => ({
    name: key.replace('_', ' ').toUpperCase(),
    value: Number(value),
    percentage: `${Number(value).toFixed(1)}%`
  }));

  const sectorAllocationData = Object.entries(analysis.sector_allocation)
    .sort(([,a], [,b]) => Number(b) - Number(a))
    .slice(0, 8)
    .map(([key, value]) => ({
      name: key,
      value: Number(value)
    }));

  const topHoldings = holdings
    .sort((a: any, b: any) => b.market_value - a.market_value)
    .slice(0, 10);

  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: 'Conservative', color: 'bg-green-100 text-green-800' };
    if (score <= 60) return { level: 'Moderate', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Aggressive', color: 'bg-red-100 text-red-800' };
  };

  const riskLevel = getRiskLevel(riskMetrics.overall_risk_score);

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Value</span>
            </div>
            <p className="text-2xl font-bold">${analysis.total_value.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Holdings</span>
            </div>
            <p className="text-2xl font-bold">{analysis.holdings_count}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Risk Level</span>
            </div>
            <Badge className={riskLevel.color}>{riskLevel.level}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Income Yield</span>
            </div>
            <p className="text-2xl font-bold">{incomeAnalysis.weighted_yield.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsPieChart>
                  <Pie
                    data={assetAllocationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}`}
                  >
                    {assetAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sector Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorAllocationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Allocation']} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">Risk Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Overall Risk Score</span>
                  <span className="font-medium">{riskMetrics.overall_risk_score}/100</span>
                </div>
                <Progress value={riskMetrics.overall_risk_score} className="h-2" />
                
                <div className="flex justify-between">
                  <span className="text-sm">Portfolio Beta</span>
                  <span className="font-medium">{riskMetrics.beta.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Estimated Volatility</span>
                  <span className="font-medium">{(riskMetrics.volatility * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Concentration Risk</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Largest Position</span>
                  <span className="font-medium">{analysis.largest_position_weight.toFixed(1)}%</span>
                </div>
                {analysis.concentration_risk > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">High concentration detected</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Risk Warnings</h4>
              <div className="space-y-2">
                {riskMetrics.concentration_warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-orange-50 rounded">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <span className="text-sm text-orange-800">{warning}</span>
                  </div>
                ))}
                {riskMetrics.concentration_warnings.length === 0 && (
                  <p className="text-sm text-green-600">No concentration risks detected</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Income Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Income Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-medium mb-2">Annual Income</h4>
              <p className="text-xl font-bold text-green-600">
                ${incomeAnalysis.total_annual_income.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {incomeAnalysis.weighted_yield.toFixed(2)}% yield
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Dividend Income</h4>
              <p className="text-lg font-semibold">
                ${incomeAnalysis.dividend_income.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {((incomeAnalysis.dividend_income / incomeAnalysis.total_annual_income) * 100).toFixed(0)}% of total
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Interest Income</h4>
              <p className="text-lg font-semibold">
                ${incomeAnalysis.interest_income.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {((incomeAnalysis.interest_income / incomeAnalysis.total_annual_income) * 100).toFixed(0)}% of total
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Reliability Score</h4>
              <p className="text-lg font-semibold">{incomeAnalysis.income_reliability_score}/100</p>
              <Progress value={incomeAnalysis.income_reliability_score} className="h-2 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Fee Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Portfolio Fees</h4>
              <p className="text-lg font-semibold">
                ${feeAnalysis.total_annual_fees.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                {feeAnalysis.weighted_expense_ratio.toFixed(2)}% weighted average
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">High-Fee Holdings</h4>
              <p className="text-lg font-semibold text-orange-600">
                {feeAnalysis.high_fee_holdings.length}
              </p>
              <p className="text-sm text-gray-500">
                Holdings with >1.0% fees
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Potential Savings</h4>
              <p className="text-lg font-semibold text-green-600">
                ${feeAnalysis.fee_optimization_savings.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Through fee optimization
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Holdings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Top 10 Holdings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topHoldings.map((holding: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{holding.ticker}</span>
                    <span className="text-sm text-gray-500">{holding.name}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {holding.asset_class} • {holding.sector || 'N/A'}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${holding.market_value.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{holding.weight_percent.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack}>
          Back to Input
        </Button>
        <Button onClick={onNext} className="flex-1">
          Continue to Model Comparison
        </Button>
      </div>
    </div>
  );
};