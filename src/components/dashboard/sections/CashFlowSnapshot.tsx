import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react";
import { IncomeStream } from "@/types/familyOffice";

interface CashFlowSnapshotProps {
  incomeStreams: IncomeStream[];
}

export const CashFlowSnapshot: React.FC<CashFlowSnapshotProps> = ({ incomeStreams }) => {
  const monthlyIncome = incomeStreams.reduce((sum, stream) => {
    const monthlyAmount = stream.frequency === 'monthly' ? stream.amount : 
                         stream.frequency === 'quarterly' ? stream.amount / 3 :
                         stream.amount / 12;
    return sum + monthlyAmount;
  }, 0);

  // Mock expense categories for demonstration
  const expenseCategories = [
    { name: "Healthcare & Wellness", amount: 1200, budget: 1000, color: "text-pink-600" },
    { name: "Travel & Experiences", amount: 800, budget: 1200, color: "text-blue-600" },
    { name: "Family & Gifting", amount: 600, budget: 500, color: "text-green-600" },
    { name: "Housing & Utilities", amount: 2800, budget: 3000, color: "text-gray-600" },
    { name: "Other Living Expenses", amount: 1100, budget: 1200, color: "text-purple-600" }
  ];

  const totalExpenses = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const netSavings = monthlyIncome - totalExpenses;
  const savingsRate = (netSavings / monthlyIncome) * 100;

  // Last 3 months trend (mock data)
  const trendData = [
    { month: "Oct", savings: 12200, rate: 58.2 },
    { month: "Nov", savings: 11800, rate: 56.1 },
    { month: "Dec", savings: 12900, rate: 61.4 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Cash Flow Snapshot</h2>
        <p className="text-muted-foreground">Month at a glance - no overwhelm, just clarity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>December Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Income */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Income</span>
              <span className="font-semibold text-emerald-600 text-lg">
                +{formatCurrency(monthlyIncome)}
              </span>
            </div>

            {/* Expenses */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Outflows</span>
              <span className="font-semibold text-red-600 text-lg">
                -{formatCurrency(totalExpenses)}
              </span>
            </div>

            {/* Net Savings */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Net Savings</span>
                <span className="font-bold text-xl text-emerald-600">
                  +{formatCurrency(netSavings)}
                </span>
              </div>
              <Progress value={savingsRate} className="h-3 mb-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {savingsRate.toFixed(1)}% savings rate this month
                </span>
                <Badge variant={savingsRate >= 20 ? "default" : "secondary"}>
                  {savingsRate >= 20 ? "Excellent" : "Good"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {expenseCategories.map((category, index) => {
              const percentOfBudget = (category.amount / category.budget) * 100;
              const isOverBudget = percentOfBudget > 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-medium ${category.color}`}>
                      {category.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{formatCurrency(category.amount)}</span>
                      {isOverBudget && <AlertCircle className="h-4 w-4 text-amber-500" />}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Progress 
                      value={Math.min(percentOfBudget, 100)} 
                      className="h-2"
                    />
                    {isOverBudget && (
                      <div className="absolute top-0 left-0 w-full h-2 bg-amber-200 rounded-full opacity-50" />
                    )}
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Budget: {formatCurrency(category.budget)}</span>
                    <span className={isOverBudget ? "text-amber-600 font-medium" : ""}>
                      {percentOfBudget.toFixed(0)}% of budget
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* 3-Month Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>3-Month Savings Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {trendData.map((month, index) => (
              <div key={month.month} className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">{month.month}</div>
                <div className="font-semibold text-lg">{formatCurrency(month.savings)}</div>
                <Badge variant="outline" className="text-xs">
                  {month.rate.toFixed(1)}% rate
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Great Progress! 🎯</h3>
              <p className="text-sm text-blue-700">
                You're on track to fund your Greece trip goal. Healthcare spending is 20% above average - 
                consider reviewing wellness investments with your advisor.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};