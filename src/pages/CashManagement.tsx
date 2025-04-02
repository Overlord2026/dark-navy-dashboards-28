
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, BanknoteIcon, Link2Icon, Wallet, ArrowRightLeft, BuildingIcon } from "lucide-react";
import { toast } from "sonner";

const CashManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample account data - in a real application, this would come from an API
  const accounts = [
    {
      id: "acc1",
      name: "Checking Account",
      type: "checking",
      balance: 12467.52,
      institution: "First National Bank"
    },
    {
      id: "acc2",
      name: "Savings Account",
      type: "savings",
      balance: 35920.18,
      institution: "Chase Bank"
    },
    {
      id: "acc3",
      name: "Investment Account",
      type: "investment",
      balance: 152890.43,
      institution: "Fidelity"
    }
  ];

  // Sample recent transactions
  const recentTransactions = [
    {
      id: "tx1",
      date: "2023-10-15",
      description: "Salary deposit",
      amount: 3500,
      type: "deposit"
    },
    {
      id: "tx2",
      date: "2023-10-12",
      description: "Utility bill payment",
      amount: 120.45,
      type: "withdrawal"
    },
    {
      id: "tx3",
      date: "2023-10-10",
      description: "Transfer to savings",
      amount: 500,
      type: "transfer"
    }
  ];

  return (
    <ThreeColumnLayout title="Cash Management">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Cash Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your cash flow, accounts, transfers, and funding sources.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BanknoteIcon className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="transfers" className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              <span>Transfers</span>
            </TabsTrigger>
            <TabsTrigger value="funding" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span>Funding Accounts</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your most recent financial activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${
                              transaction.type === 'deposit' 
                                ? 'bg-green-100 text-green-600' 
                                : transaction.type === 'withdrawal'
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-blue-100 text-blue-600'
                            }`}>
                              {transaction.type === 'deposit' 
                                ? <ArrowDownIcon className="h-4 w-4" />
                                : transaction.type === 'withdrawal'
                                  ? <ArrowUpIcon className="h-4 w-4" />
                                  : <ArrowRightLeft className="h-4 w-4" />
                              }
                            </div>
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(transaction.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className={`font-semibold ${
                            transaction.type === 'deposit' 
                              ? 'text-green-600' 
                              : transaction.type !== 'deposit' 
                                ? 'text-red-600'
                                : 'text-foreground'
                          }`}>
                            {transaction.type === 'deposit' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                            ${transaction.amount.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4" asChild>
                      <Link to="/transfers">
                        View All Transactions <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Accounts</CardTitle>
                    <CardDescription>Available balances</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {accounts.map((account) => (
                      <div key={account.id} className="flex justify-between items-center pb-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-sm text-muted-foreground">{account.institution}</p>
                        </div>
                        <p className="font-semibold">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2" asChild>
                      <Link to="/accounts">
                        Manage Accounts <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common financial tasks</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2" asChild>
                    <Link to="/transfers">
                      <ArrowRightLeft className="h-6 w-6" />
                      <span>Make a Transfer</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2" asChild>
                    <Link to="/funding-accounts">
                      <Wallet className="h-6 w-6" />
                      <span>Add Funding Account</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2" asChild>
                    <Link to="/accounts">
                      <Link2Icon className="h-6 w-6" />
                      <span>Link New Account</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2" asChild>
                    <Link to="/properties">
                      <BuildingIcon className="h-6 w-6" />
                      <span>Manage Properties</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial Insights</CardTitle>
                  <CardDescription>Cash flow overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Monthly Inflow</p>
                      <p className="font-semibold text-green-600">$9,250.00</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Monthly Outflow</p>
                      <p className="font-semibold text-red-600">$6,430.45</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <p className="font-medium">Net Cash Flow</p>
                      <p className="font-semibold text-blue-600">$2,819.55</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/financial-plans">
                      View Financial Plan <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transfers Tab */}
          <TabsContent value="transfers">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Options</CardTitle>
                  <CardDescription>
                    Choose the type of transfer you'd like to make
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-6 flex flex-col items-center text-center space-y-2" onClick={() => toast.info("Redirecting to transfers page")}>
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-2">
                      <ArrowRightLeft className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium">Between Your Accounts</h3>
                    <p className="text-sm text-muted-foreground">Transfer money between your linked accounts</p>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-6 flex flex-col items-center text-center space-y-2" asChild>
                    <Link to="/transfers">
                      <div className="p-3 bg-green-100 text-green-600 rounded-full mb-2">
                        <ArrowDownIcon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-medium">Deposit Funds</h3>
                      <p className="text-sm text-muted-foreground">Add money to your accounts from external sources</p>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-auto p-6 flex flex-col items-center text-center space-y-2" asChild>
                    <Link to="/transfers">
                      <div className="p-3 bg-red-100 text-red-600 rounded-full mb-2">
                        <ArrowUpIcon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-medium">Withdraw Funds</h3>
                      <p className="text-sm text-muted-foreground">Send money to external accounts or recipients</p>
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Button variant="default" className="w-full" asChild>
                <Link to="/transfers">
                  Go to Full Transfer Center <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          {/* Funding Accounts Tab */}
          <TabsContent value="funding">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Funding Accounts</CardTitle>
                  <CardDescription>
                    Manage the accounts you use to fund transfers and payments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Funding accounts are used to deposit and withdraw funds for transfers, payments, and investments.
                    You can select existing linked accounts or add new ones manually.
                  </p>
                  
                  <div className="space-y-4 mt-4">
                    <h3 className="text-sm font-medium">Available Funding Accounts</h3>
                    {accounts.map((account) => (
                      <div key={account.id} className="flex justify-between items-center p-4 border rounded-md">
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="text-sm text-muted-foreground">{account.institution}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast.success(`${account.name} set as primary funding account`)}
                        >
                          Set as Primary
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button variant="default" className="w-full" asChild>
                <Link to="/funding-accounts">
                  Manage Funding Accounts <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default CashManagement;
