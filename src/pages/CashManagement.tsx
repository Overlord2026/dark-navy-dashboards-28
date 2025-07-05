
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Banknote, TrendingUp, TrendingDown, DollarSign, PiggyBank, Wallet } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const CashManagement = () => {
  const isMobile = useIsMobile();

  return (
    <ThreeColumnLayout 
      activeMainItem="accounts"
      title="Cash Management"
    >
      <div className={cn(
        "container mx-auto max-w-7xl space-y-6",
        isMobile ? "px-3 py-4" : "px-4 py-6"
      )}>
        {/* Header Section */}
        <div className={cn(
          "flex gap-4 pb-6 border-b border-border",
          isMobile ? "flex-col items-start" : "flex-col sm:flex-row sm:items-center sm:justify-between"
        )}>
          <div className="space-y-2">
            <p className={cn(
              "text-muted-foreground",
              isMobile ? "text-sm" : "text-base"
            )}>Optimize your cash flow and manage liquidity across all accounts</p>
          </div>
        </div>

        {/* Cash Overview Cards */}
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}>
          <DashboardCard
            title="Available Cash"
            icon={<DollarSign className="h-4 w-4" />}
          >
            <div className="text-2xl font-bold">$125,430.00</div>
            <p className="text-sm text-green-600">+12.5% this month</p>
          </DashboardCard>
          <DashboardCard
            title="Monthly Inflow"
            icon={<TrendingUp className="h-4 w-4" />}
          >
            <div className="text-2xl font-bold">$28,500.00</div>
            <p className="text-sm text-green-600">+8.2% vs last month</p>
          </DashboardCard>
          <DashboardCard
            title="Monthly Outflow"
            icon={<TrendingDown className="h-4 w-4" />}
          >
            <div className="text-2xl font-bold">$22,150.00</div>
            <p className="text-sm text-red-600">+3.1% vs last month</p>
          </DashboardCard>
          <DashboardCard
            title="Net Cash Flow"
            icon={<Banknote className="h-4 w-4" />}
          >
            <div className="text-2xl font-bold">$6,350.00</div>
            <p className="text-sm text-green-600">+15.7% vs last month</p>
          </DashboardCard>
        </div>

        {/* Main Content Grid */}
        <div className={cn(
          "grid gap-6",
          isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
        )}>
          {/* Cash Flow Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Cash Flow Analysis
              </CardTitle>
              <CardDescription>
                Track your cash movements and identify patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cash flow chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>

          {/* Liquidity Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Liquidity Management
              </CardTitle>
              <CardDescription>
                Optimize cash allocation across accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">High-Yield Savings</p>
                    <p className="text-sm text-muted-foreground">4.5% APY</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$85,000</p>
                    <p className="text-sm text-green-600">Optimal</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Checking Account</p>
                    <p className="text-sm text-muted-foreground">0.1% APY</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$40,430</p>
                    <p className="text-sm text-yellow-600">Review</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cash Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-primary" />
                Cash Goals
              </CardTitle>
              <CardDescription>
                Track progress towards your cash reserves targets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Emergency Fund</span>
                    <span className="text-sm text-muted-foreground">$85K / $100K</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Investment Buffer</span>
                    <span className="text-sm text-muted-foreground">$25K / $50K</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your cash efficiently
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Banknote className="mr-2 h-4 w-4" />
                Transfer Between Accounts
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Optimize Cash Allocation
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <PiggyBank className="mr-2 h-4 w-4" />
                Set Cash Goals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default CashManagement;
