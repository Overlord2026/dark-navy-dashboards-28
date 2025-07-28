import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";
import { PremiumPlaceholder } from "@/components/premium/PremiumPlaceholder";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export const BillAnalytics: React.FC = () => {
  const { checkFeatureAccess } = useSubscriptionAccess();
  const hasPremiumAccess = checkFeatureAccess('bill_pay_premium');

  if (!hasPremiumAccess) {
    return (
      <PremiumPlaceholder 
        featureId="bill_pay_premium" 
        featureName="Bill Analytics & Insights"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">Spending Trends</h3>
                <p className="text-sm text-muted-foreground">Track bill changes over time</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <PieChart className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold">Category Breakdown</h3>
                <p className="text-sm text-muted-foreground">Analyze spending by category</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold">Savings Opportunities</h3>
                <p className="text-sm text-muted-foreground">AI-powered cost reduction insights</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PremiumPlaceholder>
    );
  }

  const monthlyData = {
    totalSpent: 2456.78,
    change: 2.3,
    savingsOpportunities: 145.67,
    billsAnalyzed: 12
  };

  const categoryData = [
    { category: "Utilities", amount: 245.67, percentage: 22, trend: "up" },
    { category: "Insurance", amount: 567.89, percentage: 35, trend: "stable" },
    { category: "Subscriptions", amount: 89.45, percentage: 8, trend: "down" },
    { category: "Housing", amount: 1200.00, percentage: 28, trend: "stable" },
    { category: "Other", amount: 78.99, percentage: 7, trend: "up" }
  ];

  const insights = [
    {
      type: "opportunity",
      title: "Potential Savings on Internet Bill",
      description: "Your internet bill is 25% higher than average in your area. Consider negotiating or switching providers.",
      amount: 28.50,
      confidence: "high"
    },
    {
      type: "warning",
      title: "Utility Bill Increase",
      description: "Your electric bill has increased by 15% over the last 3 months. Check for energy efficiency improvements.",
      amount: 45.67,
      confidence: "medium"
    },
    {
      type: "success",
      title: "Great Insurance Rate",
      description: "Your auto insurance rate is competitive compared to market rates.",
      amount: 0,
      confidence: "high"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyData.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{monthlyData.change}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Potential</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${monthlyData.savingsOpportunities.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per month identified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bills Analyzed</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyData.billsAnalyzed}</div>
            <p className="text-xs text-muted-foreground">Active bills tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">78%</div>
            <p className="text-xs text-muted-foreground">Room for improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>Your bill distribution across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-primary rounded" style={{backgroundColor: `hsl(${index * 60}, 70%, 50%)`}}></div>
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-sm text-muted-foreground">{item.percentage}% of total</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">${item.amount.toFixed(2)}</span>
                  {item.trend === "up" && <TrendingUp className="h-4 w-4 text-red-500" />}
                  {item.trend === "down" && <TrendingDown className="h-4 w-4 text-green-500" />}
                  {item.trend === "stable" && <div className="w-4 h-4 bg-gray-300 rounded-full" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Insights</CardTitle>
          <CardDescription>Smart recommendations to optimize your bill payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <Card key={index} className={`border-l-4 ${
                insight.type === "opportunity" ? "border-l-green-500" :
                insight.type === "warning" ? "border-l-yellow-500" :
                "border-l-blue-500"
              }`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {insight.type === "opportunity" && <Target className="h-5 w-5 text-green-500 mt-0.5" />}
                      {insight.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                      {insight.type === "success" && <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />}
                      <div>
                        <h3 className="font-medium">{insight.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {insight.confidence} confidence
                          </Badge>
                          {insight.amount > 0 && (
                            <Badge variant="outline" className="text-xs text-green-600">
                              Save ${insight.amount}/month
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {insight.type === "opportunity" && (
                      <Button size="sm">Take Action</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trends Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>6-Month Spending Trend</CardTitle>
          <CardDescription>Track how your bills have changed over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Interactive trend chart coming soon</p>
              <p className="text-sm text-muted-foreground">Track monthly bill changes and identify patterns</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};