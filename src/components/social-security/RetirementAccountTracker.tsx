
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, PiggyBank, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { mockRetirementAccounts } from "@/data/mock/socialSecurity";

export const RetirementAccountTracker: React.FC = () => {
  const retirementAccounts = mockRetirementAccounts;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getContributionProgress = (ytd: number, limit: number) => {
    return Math.min(100, (ytd / limit) * 100);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold">Retirement Accounts</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track your retirement accounts and contributions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Performance
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {retirementAccounts.length > 0 ? (
          <div className="space-y-6">
            {retirementAccounts.map((account) => (
              <div key={account.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{account.accountType}</h3>
                    <p className="text-sm text-muted-foreground">{account.provider}</p>
                    <p className="text-xs text-muted-foreground">Account #{account.accountNumber}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{formatCurrency(account.balance)}</div>
                    <p className="text-xs text-muted-foreground">Current Balance</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">YTD Contributions</span>
                    <span className="text-sm font-medium">{formatCurrency(account.contributionYTD)} / {formatCurrency(account.annualContributionLimit)}</span>
                  </div>
                  <Progress value={getContributionProgress(account.contributionYTD, account.annualContributionLimit)} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Last Contribution</p>
                    <p className="text-sm font-medium">{formatCurrency(account.lastContribution.amount)} on {account.lastContribution.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-sm font-medium">{account.status}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Investment Allocation</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {account.investmentAllocation.map((allocation, index) => (
                      <div key={index} className="flex flex-col bg-muted p-2 rounded">
                        <span className="text-xs">{allocation.category}</span>
                        <span className="font-medium text-sm">{allocation.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <PiggyBank className="h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-1">No Retirement Accounts</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Add your retirement accounts to track balances, contributions, and performance.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add First Account
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
