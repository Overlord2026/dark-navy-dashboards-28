import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { TrendingUp, TrendingDown, Shield, DollarSign, Gauge } from 'lucide-react';

interface Portfolio {
  name: string;
  holdings: Array<{
    symbol: string;
    name: string;
    allocation: number;
    value: number;
    assetClass: 'stock' | 'bond' | 'reit' | 'commodity' | 'cash';
  }>;
  riskScore: number;
  annualIncome: number;
  totalValue: number;
}

interface PortfolioMetrics {
  beta: number;
  volatility: number;
  yield: number;
}

interface PortfolioReportProps {
  clientName: string;
  currentPortfolio: Portfolio;
  proposedPortfolio?: Portfolio;
  currentMetrics: PortfolioMetrics;
  proposedMetrics?: PortfolioMetrics;
  marketData: Record<string, any>;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

export function PortfolioReport({ 
  clientName, 
  currentPortfolio, 
  proposedPortfolio, 
  currentMetrics, 
  proposedMetrics,
  marketData 
}: PortfolioReportProps) {
  const reportDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Prepare asset allocation data for pie chart
  const assetAllocationData = currentPortfolio.holdings.map((holding, index) => ({
    name: holding.symbol,
    value: holding.allocation,
    amount: holding.value,
    color: COLORS[index % COLORS.length]
  }));

  // Asset class breakdown
  const assetClassData = currentPortfolio.holdings.reduce((acc, holding) => {
    const existing = acc.find(item => item.name === holding.assetClass);
    if (existing) {
      existing.value += holding.allocation;
      existing.amount += holding.value;
    } else {
      acc.push({
        name: holding.assetClass.toUpperCase(),
        value: holding.allocation,
        amount: holding.value,
        color: COLORS[acc.length % COLORS.length]
      });
    }
    return acc;
  }, [] as Array<{name: string; value: number; amount: number; color: string}>);

  const getRiskLevel = (beta: number) => {
    if (beta < 0.7) return { level: "Conservative", color: "text-green-600", bgColor: "bg-green-100" };
    if (beta < 1.0) return { level: "Moderate", color: "text-blue-600", bgColor: "bg-blue-100" };
    if (beta < 1.3) return { level: "Growth", color: "text-orange-600", bgColor: "bg-orange-100" };
    return { level: "Aggressive", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const riskLevel = getRiskLevel(currentMetrics.beta);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black" id="portfolio-report">
      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{clientName}</h1>
            <p className="text-slate-600 mt-1">{reportDate}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-600">Portfolio Review</div>
            <div className="text-sm text-slate-600">Confidential</div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-slate-800 mt-4">Portfolio Analysis & Review</h2>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-3">Portfolio Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Current Portfolio:</span>
                <span className="font-medium">{formatCurrency(currentPortfolio.totalValue)}</span>
              </div>
              {proposedPortfolio && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Proposed Portfolio:</span>
                  <span className="font-medium">{formatCurrency(proposedPortfolio.totalValue)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600">Portfolio Risk (Beta):</span>
                <span className="font-medium">{currentMetrics.beta.toFixed(2)} vs. S&P 500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Income Yield:</span>
                <span className="font-medium">{formatPercentage(currentMetrics.yield)}</span>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-3">Risk Assessment</h3>
            <div className="flex items-center gap-3 mb-2">
              <Badge className={`${riskLevel.bgColor} ${riskLevel.color} border-0`}>
                {riskLevel.level}
              </Badge>
              <span className="text-sm text-slate-600">Risk Profile</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              Portfolio beta of {currentMetrics.beta.toFixed(2)} indicates {' '}
              {currentMetrics.beta > 1.0 ? 'higher' : currentMetrics.beta < 1.0 ? 'lower' : 'similar'} systematic risk 
              compared to the S&P 500, with {formatPercentage(currentMetrics.volatility)} annualized volatility.
            </p>
          </div>
        </div>

        {/* Asset Allocation Pie Chart */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="font-semibold text-slate-900 mb-3">Asset Allocation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetClassData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                >
                  {assetClassData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Allocation']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Holdings Detail Table */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Current Holdings Analysis</h3>
        <div className="overflow-hidden border border-slate-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Symbol</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Security Name</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">Allocation</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">Market Value</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">Beta</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">Yield</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">1-Year Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentPortfolio.holdings.map((holding, index) => {
                const data = marketData[holding.symbol] || {};
                return (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{holding.symbol}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{holding.name}</td>
                    <td className="px-4 py-3 text-sm text-right text-slate-700">{holding.allocation.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-sm text-right text-slate-700">{formatCurrency(holding.value)}</td>
                    <td className="px-4 py-3 text-sm text-right text-slate-700">
                      {data.beta ? data.beta.toFixed(2) : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-slate-700">
                      {data.yield ? formatPercentage(data.yield) : 'N/A'}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right ${(data.oneYearReturn || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.oneYearReturn ? formatPercentage(data.oneYearReturn) : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proposed Portfolio Comparison (if available) */}
      {proposedPortfolio && proposedMetrics && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Proposed Portfolio Comparison</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-3">Current Portfolio</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Beta:</span>
                  <span>{currentMetrics.beta.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Yield:</span>
                  <span>{formatPercentage(currentMetrics.yield)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Volatility:</span>
                  <span>{formatPercentage(currentMetrics.volatility)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Annual Income:</span>
                  <span>{formatCurrency(currentPortfolio.annualIncome)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-3">Proposed Portfolio</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Beta:</span>
                  <span className="font-medium">{proposedMetrics.beta.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Yield:</span>
                  <span className="font-medium text-green-600">{formatPercentage(proposedMetrics.yield)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Volatility:</span>
                  <span className="font-medium">{formatPercentage(proposedMetrics.volatility)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Annual Income:</span>
                  <span className="font-medium text-green-600">{formatCurrency(proposedPortfolio.annualIncome)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Recommendations */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Recommendations</h3>
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900">Risk Management</p>
                <p className="text-sm text-slate-700">
                  Current portfolio beta of {currentMetrics.beta.toFixed(2)} suggests {' '}
                  {riskLevel.level.toLowerCase()} risk exposure relative to market conditions.
                </p>
              </div>
            </div>
            {proposedPortfolio && (
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-slate-900">Income Enhancement</p>
                  <p className="text-sm text-slate-700">
                    Proposed allocation could increase annual income by {' '}
                    {formatCurrency(proposedPortfolio.annualIncome - currentPortfolio.annualIncome)} 
                    ({formatPercentage((proposedPortfolio.annualIncome - currentPortfolio.annualIncome) / currentPortfolio.annualIncome)}).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 pt-4 text-center text-xs text-slate-500">
        <p>This analysis is based on current market data and historical performance. Past performance does not guarantee future results.</p>
        <p className="mt-1">Generated on {reportDate} | Confidential & Proprietary</p>
      </div>
    </div>
  );
}