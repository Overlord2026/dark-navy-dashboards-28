import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { SequenceRiskResults as Results, SequenceRiskInput } from '@/engines/sequenceRisk/sequenceRiskEngine';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { AlertTriangle, TrendingDown, DollarSign } from 'lucide-react';

interface SequenceRiskResultsProps {
  results: Results;
  input: SequenceRiskInput;
  loading: boolean;
}

export const SequenceRiskResults: React.FC<SequenceRiskResultsProps> = ({
  results,
  input,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Analyzing sequence risk...</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const chartData = results.projections.map(p => ({
    year: p.year,
    age: p.age,
    portfolioValue: p.endingBalance,
    withdrawal: p.withdrawal,
    withdrawalRate: p.withdrawalRate,
    marketReturn: p.marketReturn * 100,
    portfolioReturn: p.portfolioReturn * 100,
    phaseProtected: p.phaseProtected
  }));

  return (
    <div className="space-y-6">
      {/* Scenario Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {!results.success && <AlertTriangle className="h-5 w-5 text-destructive" />}
                {results.scenarioName}
              </CardTitle>
              <CardDescription>{results.scenarioDescription}</CardDescription>
            </div>
            <Badge variant={results.success ? "default" : "destructive"} className="text-lg px-4 py-2">
              {results.success ? 'Portfolio Survived' : `Failed in Year ${results.portfolioDepletionYear}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{results.portfolioSurvivalYears}</p>
              <p className="text-sm text-muted-foreground">Years Survived</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{formatCurrency(results.finalPortfolioValue)}</p>
              <p className="text-sm text-muted-foreground">Final Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{formatPercentage(results.maxWithdrawalRate / 100)}</p>
              <p className="text-sm text-muted-foreground">Peak Withdrawal Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{formatCurrency(results.totalWithdrawals)}</p>
              <p className="text-sm text-muted-foreground">Total Withdrawn</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Value Over Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Portfolio Value Over Time
          </CardTitle>
          <CardDescription>
            Track portfolio balance throughout retirement with annual withdrawals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value, { compact: true })}
                />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    if (name === 'portfolioValue') {
                      return [formatCurrency(value), 'Portfolio Value'];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="portfolioValue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {results.portfolioDepletionYear && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <p className="font-medium text-destructive">Portfolio Depleted</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Portfolio ran out of money in {results.portfolioDepletionYear}, requiring {formatCurrency(results.shortfall)} in additional funding to reach age {input.longevityAge}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Annual Returns and Withdrawals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Annual Returns vs. Withdrawal Rates
          </CardTitle>
          <CardDescription>
            Compare market performance with withdrawal stress on portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    if (name === 'portfolioReturn') {
                      return [`${Number(value).toFixed(1)}%`, 'Portfolio Return'];
                    }
                    if (name === 'withdrawalRate') {
                      return [`${Number(value).toFixed(1)}%`, 'Withdrawal Rate'];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Year ${label}`}
                />
                <Bar dataKey="portfolioReturn" fill="hsl(var(--primary))" name="portfolioReturn" />
                <Bar dataKey="withdrawalRate" fill="hsl(var(--destructive))" name="withdrawalRate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Worst Years Analysis */}
      {results.worstYears.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Worst Performing Years
            </CardTitle>
            <CardDescription>
              Years with the most negative impact on portfolio sustainability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.worstYears.map((year, index) => (
                <div key={year.year} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge variant="destructive">{index + 1}</Badge>
                    <div>
                      <p className="font-medium">{year.year} (Age {year.age})</p>
                      <p className="text-sm text-muted-foreground">
                        Portfolio Return: {formatPercentage(year.portfolioReturn)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(year.endingBalance)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPercentage(year.withdrawalRate / 100)} withdrawal rate
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};