import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from 'recharts';
import { ResponsiveChart } from '@/components/ui/responsive-chart';
import { CHART_COLORS } from '@/utils/chartTheme';
import { formatCurrency } from '@/lib/formatters';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface MonteCarloData {
  portfolioValue: number;
  monthlyContribution: number;
  expectedReturn: number;
  volatility: number;
  timeHorizonYears: number;
  inflationRate?: number;
}

interface MonteCarloSimulationProps {
  data: MonteCarloData;
  previewMode?: boolean;
  title?: string;
}

export function MonteCarloSimulation({ 
  data, 
  previewMode = false, 
  title = "Monte Carlo Simulation - Wealth Projection" 
}: MonteCarloSimulationProps) {
  const { portfolioValue, monthlyContribution, expectedReturn, volatility, timeHorizonYears, inflationRate = 0.03 } = data;
  
  // Generate Monte Carlo scenarios
  const generateScenarios = () => {
    const scenarios = [];
    const numSimulations = 1000;
    const months = timeHorizonYears * 12;
    
    // Run simulations
    const finalValues = [];
    
    for (let sim = 0; sim < numSimulations; sim++) {
      let currentValue = portfolioValue;
      
      for (let month = 0; month < months; month++) {
        const monthlyReturn = (expectedReturn / 12) + (Math.random() - 0.5) * (volatility / Math.sqrt(12));
        currentValue = currentValue * (1 + monthlyReturn) + monthlyContribution;
      }
      
      finalValues.push(currentValue);
    }
    
    finalValues.sort((a, b) => a - b);
    
    // Calculate percentiles
    const percentiles = {
      p10: finalValues[Math.floor(numSimulations * 0.1)],
      p25: finalValues[Math.floor(numSimulations * 0.25)],
      p50: finalValues[Math.floor(numSimulations * 0.5)],
      p75: finalValues[Math.floor(numSimulations * 0.75)],
      p90: finalValues[Math.floor(numSimulations * 0.9)]
    };
    
    return { finalValues, percentiles };
  };
  
  const { finalValues, percentiles } = generateScenarios();
  
  // Generate yearly projection data for charting
  const yearlyProjections = Array.from({ length: timeHorizonYears + 1 }, (_, year) => {
    const months = year * 12;
    let values = [];
    
    // Calculate projections for different percentiles
    for (let i = 0; i < 100; i++) {
      let value = portfolioValue;
      for (let month = 0; month < months; month++) {
        const returnVariation = (Math.random() - 0.5) * (volatility / Math.sqrt(12));
        const monthlyReturn = (expectedReturn / 12) + returnVariation;
        value = value * (1 + monthlyReturn) + monthlyContribution;
      }
      values.push(value);
    }
    
    values.sort((a, b) => a - b);
    
    return {
      year,
      p10: values[10],
      p25: values[25],
      median: values[50],
      p75: values[75],
      p90: values[90],
      expected: portfolioValue * Math.pow(1 + expectedReturn, year) + 
               monthlyContribution * ((Math.pow(1 + expectedReturn/12, months) - 1) / (expectedReturn/12))
    };
  });
  
  // Calculate success probability (meeting financial goals)
  const goalValue = portfolioValue * 2; // Example: doubling wealth
  const successRate = (finalValues.filter(v => v >= goalValue).length / finalValues.length) * 100;
  
  // Generate health score based on multiple factors
  const generateHealthScore = () => {
    let score = 50; // Base score
    
    // Contribution factor
    const contributionRatio = (monthlyContribution * 12) / portfolioValue;
    if (contributionRatio > 0.1) score += 20;
    else if (contributionRatio > 0.05) score += 10;
    
    // Diversification factor (assume good if using this tool)
    score += 15;
    
    // Time horizon factor
    if (timeHorizonYears >= 10) score += 15;
    else if (timeHorizonYears >= 5) score += 10;
    
    // Success probability factor
    if (successRate > 80) score += 20;
    else if (successRate > 60) score += 10;
    else if (successRate < 40) score -= 10;
    
    return Math.min(100, Math.max(0, score));
  };
  
  const healthScore = generateHealthScore();
  
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { 
      status: "On Track", 
      color: "text-green-600", 
      bgColor: "bg-green-100",
      icon: CheckCircle 
    };
    if (score >= 60) return { 
      status: "Needs Attention", 
      color: "text-yellow-600", 
      bgColor: "bg-yellow-100",
      icon: AlertTriangle 
    };
    return { 
      status: "At Risk", 
      color: "text-red-600", 
      bgColor: "bg-red-100",
      icon: AlertTriangle 
    };
  };
  
  const healthStatus = getHealthStatus(healthScore);

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2 border-b border-gray-300 pb-2">{title}</h2>
          <p className="text-sm text-gray-600">
            1,000 simulation scenarios based on {(expectedReturn * 100).toFixed(1)}% expected return and {(volatility * 100).toFixed(1)}% volatility
          </p>
        </div>

        {/* Wealth Health Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`${healthStatus.bgColor} p-4 rounded-lg border border-opacity-30`}>
            <div className="flex items-center gap-3">
              <healthStatus.icon className={`w-6 h-6 ${healthStatus.color}`} />
              <div>
                <p className="text-sm font-medium">Wealth Health Score</p>
                <p className={`text-2xl font-bold ${healthStatus.color}`}>{healthScore}/100</p>
                <p className={`text-xs ${healthStatus.color}`}>{healthStatus.status}</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Goal Success Rate</p>
            <p className="text-2xl font-bold text-blue-800">{successRate.toFixed(1)}%</p>
            <p className="text-xs text-blue-600">Probability of doubling wealth</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 font-medium">Median Outcome</p>
            <p className="text-2xl font-bold text-purple-800">{formatCurrency(percentiles.p50)}</p>
            <p className="text-xs text-purple-600">In {timeHorizonYears} years</p>
          </div>
        </div>

        {/* Probability Bands Chart */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Wealth Projection with Probability Bands</h3>
          <ResponsiveChart height={350}>
            <AreaChart data={yearlyProjections}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="year" 
                fontSize={12}
                tick={{ fill: '#666' }}
                axisLine={{ stroke: '#ddd' }}
              />
              <YAxis 
                fontSize={12}
                tick={{ fill: '#666' }}
                axisLine={{ stroke: '#ddd' }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value), 
                  name === 'p90' ? '90th Percentile' :
                  name === 'p75' ? '75th Percentile' :
                  name === 'median' ? 'Median (50th)' :
                  name === 'p25' ? '25th Percentile' :
                  name === 'p10' ? '10th Percentile' : 'Expected'
                ]}
                labelFormatter={(year) => `Year ${year}`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Legend />
              
              {/* Probability bands */}
              <Area
                type="monotone"
                dataKey="p90"
                stackId="1"
                stroke={CHART_COLORS.accessible.high}
                fill={CHART_COLORS.accessible.high}
                fillOpacity={0.1}
                name="90th Percentile"
              />
              <Area
                type="monotone"
                dataKey="p75"
                stackId="2"
                stroke={CHART_COLORS.primary}
                fill={CHART_COLORS.primary}
                fillOpacity={0.2}
                name="75th Percentile"
              />
              <Area
                type="monotone"
                dataKey="median"
                stackId="3"
                stroke={CHART_COLORS.accent}
                fill={CHART_COLORS.accent}
                fillOpacity={0.3}
                name="Median (50th)"
              />
              <Area
                type="monotone"
                dataKey="p25"
                stackId="4"
                stroke={CHART_COLORS.secondary}
                fill={CHART_COLORS.secondary}
                fillOpacity={0.2}
                name="25th Percentile"
              />
              <Area
                type="monotone"
                dataKey="p10"
                stackId="5"
                stroke={CHART_COLORS.accessible.danger}
                fill={CHART_COLORS.accessible.danger}
                fillOpacity={0.1}
                name="10th Percentile"
              />
            </AreaChart>
          </ResponsiveChart>
        </div>

        {/* Key Projections Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Key Milestones</h3>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Timeline</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Conservative</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Expected</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Optimistic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[1, 3, 5, 10].filter(year => year <= timeHorizonYears).map((year) => {
                    const yearData = yearlyProjections[year];
                    return (
                      <tr key={year}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Year {year}</td>
                        <td className="px-4 py-3 text-sm text-right text-red-600">
                          {formatCurrency(yearData.p25)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">
                          {formatCurrency(yearData.median)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-green-600">
                          {formatCurrency(yearData.p75)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Assessment */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Risk Assessment</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Probability of Loss</span>
                  <span className="text-sm font-bold text-red-600">
                    {((finalValues.filter(v => v < portfolioValue).length / finalValues.length) * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-gray-600">Chance of ending with less than starting value</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Worst Case Scenario</span>
                  <span className="text-sm font-bold text-red-600">
                    {formatCurrency(percentiles.p10)}
                  </span>
                </div>
                <p className="text-xs text-gray-600">10th percentile outcome</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Best Case Scenario</span>
                  <span className="text-sm font-bold text-green-600">
                    {formatCurrency(percentiles.p90)}
                  </span>
                </div>
                <p className="text-xs text-gray-600">90th percentile outcome</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Monte Carlo Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Key Findings</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• {successRate > 70 ? 'High' : successRate > 50 ? 'Moderate' : 'Low'} probability of meeting wealth goals</li>
                <li>• Median outcome: {formatCurrency(percentiles.p50)}</li>
                <li>• Portfolio shows {volatility > 0.15 ? 'high' : volatility > 0.10 ? 'moderate' : 'low'} volatility</li>
                <li>• Time horizon: {timeHorizonYears} years</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-2">Recommendations</h4>
              <ul className="space-y-1 text-green-700">
                <li>• {monthlyContribution < 1000 ? 'Consider increasing' : 'Continue'} monthly contributions</li>
                <li>• {timeHorizonYears < 10 ? 'Extend investment timeline if possible' : 'Maintain long-term focus'}</li>
                <li>• Monitor and rebalance portfolio quarterly</li>
                <li>• Review goals annually and adjust strategy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PDF version - simplified layout
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-600">1,000 simulations • {timeHorizonYears} year horizon</p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center p-3 bg-gray-50 rounded">
          <p className="font-semibold">Health Score</p>
          <p className={`text-lg font-bold ${healthStatus.color}`}>{healthScore}/100</p>
          <p className="text-xs">{healthStatus.status}</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <p className="font-semibold">Success Rate</p>
          <p className="text-lg font-bold text-blue-600">{successRate.toFixed(1)}%</p>
          <p className="text-xs">Goal achievement</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <p className="font-semibold">Median Outcome</p>
          <p className="text-lg font-bold">{formatCurrency(percentiles.p50)}</p>
          <p className="text-xs">Expected value</p>
        </div>
      </div>

      <div className="text-sm">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left border-r">Scenario</th>
              <th className="p-2 text-right border-r">Conservative</th>
              <th className="p-2 text-right border-r">Median</th>
              <th className="p-2 text-right">Optimistic</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2 border-r">Year {timeHorizonYears}</td>
              <td className="p-2 text-right border-r text-red-600">{formatCurrency(percentiles.p25)}</td>
              <td className="p-2 text-right border-r font-semibold">{formatCurrency(percentiles.p50)}</td>
              <td className="p-2 text-right text-green-600">{formatCurrency(percentiles.p75)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}