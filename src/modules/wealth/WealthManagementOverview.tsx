import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutGridIcon, TrendingUpIcon, DollarSignIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useBankAccounts } from "@/hooks/useBankAccounts";
import { useFinancialPlans } from "@/hooks/useFinancialPlans";

export const WealthManagementOverview = () => {
  const { accounts, loading: accountsLoading, getFormattedTotalBalance } = useBankAccounts();
  const { plans, activePlan, summary, loading: plansLoading } = useFinancialPlans();

  const totalBalance = getFormattedTotalBalance();
  const isLoading = accountsLoading || plansLoading;

  return (
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
              {isLoading ? "Loading..." : totalBalance}
            </div>
            <p className="text-xs text-muted-foreground">
              {accounts.length} connected account{accounts.length !== 1 ? 's' : ''}
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
              {isLoading ? "..." : summary.activePlans}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.draftPlans} draft plan{summary.draftPlans !== 1 ? 's' : ''}
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
              {isLoading ? "..." : summary.totalGoals}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(summary.averageSuccessRate)}% success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/wealth/accounts">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutGridIcon className="h-5 w-5" />
                Accounts Overview
              </CardTitle>
              <CardDescription>View all your financial accounts in one place</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/wealth/cash">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSignIcon className="h-5 w-5" />
                Cash & Transfers
              </CardTitle>
              <CardDescription>Manage cash flow and transfer funds</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/wealth/properties">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutGridIcon className="h-5 w-5" />
                Properties
              </CardTitle>
              <CardDescription>Real estate portfolio management</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/wealth/goals">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5" />
                Goals & Budgets
              </CardTitle>
              <CardDescription>Track financial goals and budgets</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/wealth/docs">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutGridIcon className="h-5 w-5" />
                Documents & Vault
              </CardTitle>
              <CardDescription>Secure document storage and management</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/wealth/social-security">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutGridIcon className="h-5 w-5" />
                Social Security
              </CardTitle>
              <CardDescription>Social security planning and optimization</CardDescription>
            </CardHeader>
          </Card>
        </Link>
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
    </div>
  );
};