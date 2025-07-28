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
  Building,
  BarChart3
} from "lucide-react";

export const PropertyAnalytics: React.FC = () => {
  const { checkFeatureAccess } = useSubscriptionAccess();
  const hasPremiumAccess = checkFeatureAccess('premium');

  if (!hasPremiumAccess) {
    return (
      <PremiumPlaceholder 
        featureId="premium_property_features" 
        featureName="Property Analytics & Insights"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold">Portfolio Performance</h3>
                <p className="text-sm text-muted-foreground">Track value and equity changes</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <DollarSign className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold">Cash Flow Analysis</h3>
                <p className="text-sm text-muted-foreground">Rental income and expenses</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold">Market Insights</h3>
                <p className="text-sm text-muted-foreground">Compare to local market trends</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PremiumPlaceholder>
    );
  }

  const portfolioMetrics = {
    totalValue: 2450000,
    totalEquity: 1850000,
    monthlyIncome: 8500,
    monthlyExpenses: 3200,
    netCashFlow: 5300,
    averageROI: 8.2
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioMetrics.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12.5% this year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cash Flow</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${portfolioMetrics.netCashFlow.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Net income after expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{portfolioMetrics.averageROI}%</div>
            <p className="text-xs text-muted-foreground">Annual return on investment</p>
          </CardContent>
        </Card>
      </div>

      {/* Property Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Property Performance</CardTitle>
          <CardDescription>Individual property analytics and comparisons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Interactive performance charts</p>
              <p className="text-sm text-muted-foreground">Compare property values, ROI, and cash flow</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
          <CardDescription>Compare your properties to local market trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Market comparison charts</p>
              <p className="text-sm text-muted-foreground">Track neighborhood trends and valuations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};