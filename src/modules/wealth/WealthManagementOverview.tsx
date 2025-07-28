import React, { useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutGridIcon, TrendingUpIcon, DollarSignIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useFamilyWealthData } from "@/hooks/useFamilyWealthData";
import { FamilyWealthErrorBoundary } from "@/components/wealth/FamilyWealthErrorBoundary";
import { WealthManagementOverviewSkeleton } from "@/components/ui/skeletons/FamilyWealthSkeletons";
import { FamilyWealthPerformanceMonitor } from "@/components/debug/FamilyWealthPerformanceMonitor";

export const WealthManagementOverview = () => {
  const {
    formattedTotalBalance,
    accountCount,
    activePlanCount,
    draftPlanCount,
    totalGoals,
    averageSuccessRate,
    isLoading
  } = useFamilyWealthData();

  // Memoized navigation items to prevent re-renders
  const navigationItems = useMemo(() => [
    {
      to: "/wealth/accounts",
      icon: LayoutGridIcon,
      title: "Accounts Overview",
      description: "View all your financial accounts in one place"
    },
    {
      to: "/wealth/cash",
      icon: DollarSignIcon,
      title: "Cash & Transfers",
      description: "Manage cash flow and transfer funds"
    },
    {
      to: "/wealth/properties",
      icon: LayoutGridIcon,
      title: "Properties",
      description: "Real estate portfolio management"
    },
    {
      to: "/wealth/goals",
      icon: TrendingUpIcon,
      title: "Goals & Budgets",
      description: "Track financial goals and budgets"
    },
    {
      to: "/wealth/docs",
      icon: LayoutGridIcon,
      title: "Documents & Vault",
      description: "Secure document storage and management"
    },
    {
      to: "/wealth/social-security",
      icon: LayoutGridIcon,
      title: "Social Security",
      description: "Social security planning and optimization"
    }
  ], []);

  // Memoized formatting functions
  const formatAccountText = useCallback((count: number) => {
    return `${count} connected account${count !== 1 ? 's' : ''}`;
  }, []);

  const formatPlanText = useCallback((count: number) => {
    return `${count} draft plan${count !== 1 ? 's' : ''}`;
  }, []);

  const formatSuccessRate = useCallback((rate: number) => {
    return `${Math.round(rate)}% success rate`;
  }, []);

  if (isLoading) {
    return (
      <FamilyWealthErrorBoundary>
        <WealthManagementOverviewSkeleton />
        {process.env.NODE_ENV === 'development' && (
          <FamilyWealthPerformanceMonitor componentName="WealthManagementOverview" />
        )}
      </FamilyWealthErrorBoundary>
    );
  }

  return (
    <FamilyWealthErrorBoundary>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wealth Management Overview</h1>
            <p className="text-muted-foreground">Comprehensive view of your financial portfolio</p>
          </div>
          <Button asChild>
            <Link to="/wealth/goals">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Goal
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formattedTotalBalance}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatAccountText(accountCount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Financial Plans</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activePlanCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatPlanText(draftPlanCount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
              <LayoutGridIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalGoals}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatSuccessRate(averageSuccessRate)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link key={item.to} to={item.to}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Coming Soon Section */}
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>Features in development</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Business Filings</Badge>
              <Badge variant="secondary">Bill Pay</Badge>
              <Badge variant="secondary">Advanced Analytics</Badge>
            </div>
          </CardContent>
        </Card>
        
        {process.env.NODE_ENV === 'development' && (
          <FamilyWealthPerformanceMonitor componentName="WealthManagementOverview" />
        )}
      </div>
    </FamilyWealthErrorBoundary>
  );
};