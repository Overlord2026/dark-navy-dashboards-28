import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { ResponsiveChart } from '@/components/ui/responsive-chart';
import { CHART_COLORS } from '@/utils/chartTheme';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

interface FeeComparisonData {
  portfolioValue: number;
  valueBasedFee: number; // Fixed dollar fee
  aumBasedFee: number; // Percentage of AUM
  timeHorizonYears: number;
}

interface FeeExpenseComparisonProps {
  data: FeeComparisonData;
  previewMode?: boolean;
  title?: string;
}

export function FeeExpenseComparison({ 
  data, 
  previewMode = false, 
  title = "Fee Structure Comparison: Value-Based vs AUM Model" 
}: FeeExpenseComparisonProps) {
  const { portfolioValue, valueBasedFee, aumBasedFee, timeHorizonYears } = data;
  
  // Calculate annual AUM fee (percentage)
  const annualAUMFee = (portfolioValue * aumBasedFee) / 100;
  
  // Calculate projections over time horizon
  const projectionData = Array.from({ length: timeHorizonYears + 1 }, (_, year) => {
    const projectedValue = portfolioValue * Math.pow(1.07, year); // Assume 7% growth
    const cumulativeValueFee = valueBasedFee * year;
    const cumulativeAUMFee = Array.from({ length: year }, (_, y) => 
      portfolioValue * Math.pow(1.07, y) * (aumBasedFee / 100)
    ).reduce((sum, fee) => sum + fee, 0);
    
    return {
      year,
      valueBasedFee: cumulativeValueFee,
      aumBasedFee: cumulativeAUMFee,
      savings: cumulativeAUMFee - cumulativeValueFee,
      portfolioValue: projectedValue
    };
  });

  // Calculate total savings over time horizon
  const finalProjection = projectionData[timeHorizonYears];
  const totalSavings = finalProjection.savings;
  const savingsPercentage = (totalSavings / finalProjection.aumBasedFee) * 100;

  // Pie chart data for fee breakdown
  const feeBreakdownData = [
    { 
      name: 'Value-Based Fee', 
      value: finalProjection.valueBasedFee, 
      color: CHART_COLORS.primary 
    },
    { 
      name: 'Traditional AUM Fee', 
      value: finalProjection.aumBasedFee, 
      color: CHART_COLORS.negative 
    }
  ];

  // Annual comparison data
  const annualComparisonData = [
    {
      feeType: 'Value-Based Annual',
      amount: valueBasedFee,
      percentage: (valueBasedFee / portfolioValue) * 100
    },
    {
      feeType: 'Traditional AUM',
      amount: annualAUMFee,
      percentage: aumBasedFee
    }
  ];

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold mb-2 border-b border-gray-300 pb-2">{title}</h2>
          <p className="text-sm text-gray-600">
            Comparing fixed value-based pricing against traditional AUM percentage fees
          </p>
        </div>

        {/* Key Savings Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 font-medium">Total Savings Over {timeHorizonYears} Years</p>
            <p className="text-2xl font-bold text-green-800">{formatCurrency(totalSavings)}</p>
            <p className="text-xs text-green-600">{savingsPercentage.toFixed(1)}% less in fees</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium">Annual Value-Based Fee</p>
            <p className="text-2xl font-bold text-blue-800">{formatCurrency(valueBasedFee)}</p>
            <p className="text-xs text-blue-600">{((valueBasedFee / portfolioValue) * 100).toFixed(3)}% of portfolio</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-700 font-medium">Traditional AUM Fee</p>
            <p className="text-2xl font-bold text-red-800">{formatCurrency(annualAUMFee)}</p>
            <p className="text-xs text-red-600">{aumBasedFee.toFixed(2)}% of portfolio annually</p>
          </div>
        </div>

        {/* Fee Projection Chart */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Cumulative Fee Comparison Over Time</h3>
          <ResponsiveChart height={300}>
            <BarChart data={projectionData}>
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
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value), 
                  name === 'valueBasedFee' ? 'Value-Based Fees' : 'Traditional AUM Fees'
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
              <Bar 
                dataKey="valueBasedFee" 
                name="Value-Based Fees"
                fill={CHART_COLORS.primary}
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="aumBasedFee" 
                name="Traditional AUM Fees"
                fill={CHART_COLORS.negative}
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveChart>
        </div>

        {/* Fee Structure Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Total Fee Comparison ({timeHorizonYears} Years)</h3>
            <ResponsiveChart height={250}>
              <PieChart>
                <Pie
                  data={feeBreakdownData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  labelLine={false}
                  fontSize={12}
                >
                  {feeBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Total Fees']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveChart>
          </div>

          {/* Annual Comparison Table */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Annual Fee Structure</h3>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Fee Model</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Annual Amount</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">% of Portfolio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {annualComparisonData.map((row, index) => (
                    <tr key={index} className={index === 0 ? 'bg-green-50' : 'bg-red-50'}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.feeType}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">
                        {formatCurrency(row.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {row.percentage.toFixed(3)}%
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-blue-50 font-semibold">
                    <td className="px-4 py-3 text-sm text-gray-900">Annual Savings</td>
                    <td className="px-4 py-3 text-sm text-right text-green-700">
                      {formatCurrency(annualAUMFee - valueBasedFee)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-green-700">
                      {((annualAUMFee - valueBasedFee) / annualAUMFee * 100).toFixed(1)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Value Proposition Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Value-Based Pricing Advantage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Traditional AUM Model</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Fees increase with portfolio growth</li>
                <li>• Higher costs on larger portfolios</li>
                <li>• {aumBasedFee}% annually regardless of service level</li>
                <li>• Compounds over time</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-800 mb-2">Value-Based Model</h4>
              <ul className="space-y-1 text-green-700">
                <li>• Fixed annual fee: {formatCurrency(valueBasedFee)}</li>
                <li>• Transparent, predictable pricing</li>
                <li>• More portfolio growth stays with you</li>
                <li>• Aligned with your financial success</li>
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
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center p-3 bg-gray-50 rounded">
          <p className="font-semibold">Total Savings</p>
          <p className="text-lg font-bold text-green-600">{formatCurrency(totalSavings)}</p>
          <p className="text-xs">Over {timeHorizonYears} years</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <p className="font-semibold">Value-Based Fee</p>
          <p className="text-lg font-bold">{formatCurrency(valueBasedFee)}</p>
          <p className="text-xs">Annual fixed fee</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded">
          <p className="font-semibold">Traditional AUM</p>
          <p className="text-lg font-bold">{formatCurrency(annualAUMFee)}</p>
          <p className="text-xs">{aumBasedFee}% annually</p>
        </div>
      </div>

      <div className="text-sm">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left border-r">Year</th>
              <th className="p-2 text-right border-r">Value-Based</th>
              <th className="p-2 text-right border-r">Traditional AUM</th>
              <th className="p-2 text-right">Savings</th>
            </tr>
          </thead>
          <tbody>
            {projectionData.slice(1, 6).map((row, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 border-r">{row.year}</td>
                <td className="p-2 text-right border-r">{formatCurrency(row.valueBasedFee)}</td>
                <td className="p-2 text-right border-r">{formatCurrency(row.aumBasedFee)}</td>
                <td className="p-2 text-right text-green-600 font-semibold">
                  {formatCurrency(row.savings)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}