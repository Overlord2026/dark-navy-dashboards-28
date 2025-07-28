import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';
import { ScenarioResults as ScenarioResultsType, LongevityInputs } from '@/hooks/useLongevityScorecard';

interface ScenarioResultsProps {
  results: ScenarioResultsType;
  inputs: LongevityInputs;
}

export const ScenarioResults: React.FC<ScenarioResultsProps> = ({ results, inputs }) => {
  const retirementYears = inputs.projectedLifespan - inputs.expectedRetirementAge;
  
  // Prepare chart data
  const withdrawalData = results.inflationAdjusted.annualWithdrawals.map(w => ({
    year: w.year,
    nominal: w.nominal,
    real: w.real,
    realFormatted: formatCurrency(w.real),
    nominalFormatted: formatCurrency(w.nominal)
  }));

  const scenarioComparison = [
    {
      scenario: 'Worst Case',
      years: results.worstCase.moneyLastsYears,
      percentage: (results.worstCase.moneyLastsYears / retirementYears) * 100,
      color: '#ef4444'
    },
    {
      scenario: 'Average Case',
      years: results.averageCase.moneyLastsYears,
      percentage: (results.averageCase.moneyLastsYears / retirementYears) * 100,
      color: '#3b82f6'
    },
    {
      scenario: 'Target',
      years: retirementYears,
      percentage: 100,
      color: '#10b981'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Sequence of Returns Stress Test</h3>
        <p className="text-muted-foreground">
          How your money holds up against market volatility and inflation
        </p>
      </div>

      {/* Scenario Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Worst Case Scenario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {results.worstCase.moneyLastsYears} years
              </div>
              <p className="text-sm text-muted-foreground">Money duration</p>
            </div>
            
            <Progress 
              value={(results.worstCase.moneyLastsYears / retirementYears) * 100} 
              className="h-3"
            />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Final Value:</span>
                <span className="font-medium">{formatCurrency(results.worstCase.finalValue)}</span>
              </div>
              {results.worstCase.shortfall > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Potential Shortfall:</span>
                  <span className="font-medium">{formatCurrency(results.worstCase.shortfall)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <TrendingUp className="h-5 w-5" />
              Average Case Scenario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {results.averageCase.moneyLastsYears} years
              </div>
              <p className="text-sm text-muted-foreground">Money duration</p>
            </div>
            
            <Progress 
              value={Math.min(100, (results.averageCase.moneyLastsYears / retirementYears) * 100)} 
              className="h-3"
            />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Final Value:</span>
                <span className="font-medium">{formatCurrency(results.averageCase.finalValue)}</span>
              </div>
              {results.averageCase.surplus > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Potential Surplus:</span>
                  <span className="font-medium">{formatCurrency(results.averageCase.surplus)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>How Long Your Money Lasts</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scenarioComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="scenario" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value} years`, 'Duration']}
                labelFormatter={(label) => `${label} Scenario`}
              />
              <Bar 
                dataKey="years" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Inflation Impact Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Inflation Impact on Your Withdrawals</CardTitle>
          <p className="text-sm text-muted-foreground">
            See how inflation affects your purchasing power over time
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={withdrawalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                label={{ value: 'Year in Retirement', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                label={{ value: 'Annual Withdrawal', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'nominal' ? 'Future Dollars' : 'Today\'s Purchasing Power'
                ]}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="nominal" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="nominal"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="real" 
                stroke="#10b981" 
                strokeWidth={2}
                name="real"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm">Future Dollars (with inflation)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm">Today's Purchasing Power</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Sequence Risk Impact</h4>
              <p className="text-sm text-blue-700">
                Poor early returns could reduce your money's duration by{' '}
                <span className="font-bold">
                  {results.averageCase.moneyLastsYears - results.worstCase.moneyLastsYears} years
                </span>
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Inflation Effect</h4>
              <p className="text-sm text-blue-700">
                At {inputs.inflationRate}% inflation, your purchasing power will{' '}
                <span className="font-bold">halve every {Math.round(72 / inputs.inflationRate)} years</span>
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Total Real Spending</h4>
              <p className="text-sm text-blue-700">
                You'll need{' '}
                <span className="font-bold">
                  {formatCurrency(results.inflationAdjusted.totalRealSpending)}
                </span>{' '}
                in today's purchasing power
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Risk Assessment</h4>
              <Badge variant={results.worstCase.moneyLastsYears >= retirementYears ? "default" : "destructive"}>
                {results.worstCase.moneyLastsYears >= retirementYears ? 'Low Risk' : 'High Risk'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};