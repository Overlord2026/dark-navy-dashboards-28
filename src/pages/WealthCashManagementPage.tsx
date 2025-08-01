import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Wallet, RefreshCw } from "lucide-react";

export const WealthCashManagementPage = () => {
  const cashAccounts = [
    {
      id: 1,
      name: "High-Yield Savings",
      bank: "Marcus by Goldman Sachs",
      balance: 125000,
      apy: 4.5,
      type: "Savings"
    },
    {
      id: 2,
      name: "Money Market",
      bank: "Fidelity",
      balance: 75000,
      apy: 4.2,
      type: "Money Market"
    },
    {
      id: 3,
      name: "Checking Account",
      bank: "Chase",
      balance: 25000,
      apy: 0.1,
      type: "Checking"
    }
  ];

  const recentTransactions = [
    {
      id: 1,
      description: "Transfer from Investment Account",
      amount: 10000,
      type: "credit",
      date: "2024-01-15",
      account: "High-Yield Savings"
    },
    {
      id: 2,
      description: "Monthly Budget Transfer",
      amount: -5000,
      type: "debit",
      date: "2024-01-14",
      account: "Checking Account"
    },
    {
      id: 3,
      description: "Interest Payment",
      amount: 468.75,
      type: "credit",
      date: "2024-01-13",
      account: "Money Market"
    }
  ];

  const totalBalance = cashAccounts.reduce((sum, account) => sum + account.balance, 0);
  const weightedAPY = cashAccounts.reduce((sum, account) => 
    sum + (account.balance / totalBalance) * account.apy, 0
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cash Management</h1>
        <p className="text-muted-foreground">
          Optimize your cash holdings and maximize returns
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cash</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weighted APY</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weightedAPY.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              Above market average
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Interest</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$843</div>
            <p className="text-xs text-muted-foreground">
              Estimated this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Cash Accounts */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Cash Accounts</CardTitle>
              <CardDescription>Overview of your cash holdings</CardDescription>
            </div>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Balances
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cashAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{account.name}</h3>
                    <Badge variant="outline">{account.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{account.bank}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">${account.balance.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{account.apy}% APY</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest cash movements across accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'credit' ? 
                      <ArrowUpRight className="h-4 w-4 text-green-600" /> :
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    }
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.account}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">{transaction.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col">
              <ArrowUpRight className="h-6 w-6 mb-2" />
              Transfer Funds
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Optimize Yields
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Wallet className="h-6 w-6 mb-2" />
              Add Account
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="h-6 w-6 mb-2" />
              Set Budget
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};