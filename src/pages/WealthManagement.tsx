
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileLineChart, CreditCard, Building, Calculator, BarChart3 } from "lucide-react";

const WealthManagement = () => {
  return (
    <ThreeColumnLayout title="Wealth Management">
      <div className="mx-auto w-full max-w-6xl p-4 md:p-6 animate-fade-in">
        <h1 className="text-2xl font-semibold mb-6">Wealth Management Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/financial-plans">
            <Card className="h-full hover:bg-muted/5 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Financial Plans</CardTitle>
                <FileLineChart className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View and manage your financial planning goals
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/accounts">
            <Card className="h-full hover:bg-muted/5 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Accounts</CardTitle>
                <CreditCard className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage your accounts and track balances
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/accounts">
            <Card className="h-full hover:bg-muted/5 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Investments</CardTitle>
                <BarChart3 className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor and manage your investment portfolio
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/properties">
            <Card className="h-full hover:bg-muted/5 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Properties</CardTitle>
                <Building className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View and manage all your real estate assets
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/tax-budgets">
            <Card className="h-full hover:bg-muted/5 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Tax & Budgets</CardTitle>
                <Calculator className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Plan your taxes and manage household budgets
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-medium mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <Link to="/accounts">View All Accounts</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/financial-plans">Create New Financial Plan</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/tax-budgets">Budget Planner</Link>
            </Button>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default WealthManagement;
