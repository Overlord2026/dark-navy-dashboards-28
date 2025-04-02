
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BanknoteIcon, 
  BarChart3Icon, 
  CreditCardIcon, 
  DollarSignIcon, 
  FileTextIcon, 
  Link2Icon, 
  PiggyBankIcon, 
  TrendingUpIcon,
  ArrowRightIcon,
  CalendarIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronRightIcon 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const CashManagement = () => {
  const [activeTab, setActiveTab] = useState("accounts");
  const { userProfile } = useUser();
  
  // Sample data for banking accounts
  const accounts = [
    {
      id: "acc-1",
      name: "Primary Checking",
      type: "checking",
      accountNumber: "****4582",
      balance: 12467.52,
      apy: 0.01,
      isPrimary: true,
      transactions: 24
    },
    {
      id: "acc-2",
      name: "Emergency Savings",
      type: "savings",
      accountNumber: "****7839",
      balance: 35920.18,
      apy: 1.75,
      isPrimary: false,
      transactions: 5
    },
    {
      id: "acc-3",
      name: "High-Yield Savings",
      type: "savings",
      accountNumber: "****9214",
      balance: 78350.44,
      apy: 3.50,
      isPrimary: false,
      transactions: 2
    }
  ];
  
  // Sample data for bank cards
  const cards = [
    {
      id: "card-1",
      name: "Platinum Debit",
      type: "debit",
      lastFour: "4582",
      expiryMonth: 11,
      expiryYear: 25,
      isActive: true,
      linkedAccount: "Primary Checking"
    },
    {
      id: "card-2",
      name: "Travel Credit Card",
      type: "credit",
      lastFour: "7231",
      expiryMonth: 8,
      expiryYear: 26,
      isActive: true,
      limit: 25000,
      balance: 3427.89,
      availableCredit: 21572.11
    }
  ];
  
  // Sample recent transactions
  const recentTransactions = [
    {
      id: "tx-1",
      date: "2023-10-15",
      description: "Deposit",
      amount: 5000,
      type: "credit",
      account: "Primary Checking"
    },
    {
      id: "tx-2",
      date: "2023-10-14",
      description: "Whole Foods Market",
      amount: 82.47,
      type: "debit",
      account: "Primary Checking"
    },
    {
      id: "tx-3",
      date: "2023-10-12",
      description: "Transfer to Savings",
      amount: 1000,
      type: "transfer",
      account: "Primary Checking"
    },
    {
      id: "tx-4",
      date: "2023-10-10",
      description: "Amazon.com",
      amount: 124.99,
      type: "debit",
      account: "Primary Checking"
    },
    {
      id: "tx-5",
      date: "2023-10-08",
      description: "Interest Payment",
      amount: 112.45,
      type: "credit",
      account: "Emergency Savings"
    }
  ];
  
  // Sample scheduled transactions
  const scheduledTransactions = [
    {
      id: "sched-1",
      description: "Mortgage Payment",
      amount: 3500,
      nextDate: "2023-11-01",
      frequency: "Monthly",
      account: "Primary Checking"
    },
    {
      id: "sched-2",
      description: "Transfer to Savings",
      amount: 1000,
      nextDate: "2023-10-25",
      frequency: "Monthly",
      account: "Primary Checking"
    },
    {
      id: "sched-3",
      description: "Auto Loan Payment",
      amount: 450,
      nextDate: "2023-11-05",
      frequency: "Monthly",
      account: "Primary Checking"
    }
  ];
  
  // Summary totals
  const totalCash = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  return (
    <ThreeColumnLayout title="Cash Management">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Cash Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your banking accounts, view transactions, and set up payments.
          </p>
        </div>
        
        {/* Banking Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Cash Overview */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Total Cash Overview</CardTitle>
              <CardDescription>All your liquid assets</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">${totalCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className="ml-2 text-green-500 flex items-center text-sm">
                  <TrendingUpIcon className="h-4 w-4 mr-1" /> +2.3%
                </span>
              </div>
              
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Checking</span>
                  <span className="font-semibold">${accounts.filter(a => a.type === 'checking').reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Savings</span>
                  <span className="font-semibold">${accounts.filter(a => a.type === 'savings').reduce((sum, acc) => sum + acc.balance, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Cash Yield (Avg.)</span>
                  <span className="font-semibold">2.12%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-end">
              <Button variant="outline" className="text-sm" asChild>
                <Link to="/accounts">View All Accounts</Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/transfers">
                  <ArrowRightIcon className="h-4 w-4 mr-2" />
                  Transfer Money
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <DollarSignIcon className="h-4 w-4 mr-2" />
                Pay a Bill
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Link2Icon className="h-4 w-4 mr-2" />
                Link Account
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CreditCardIcon className="h-4 w-4 mr-2" />
                Manage Cards
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="accounts">
              <BanknoteIcon className="h-4 w-4 mr-2" />
              Accounts
            </TabsTrigger>
            <TabsTrigger value="transactions">
              <FileTextIcon className="h-4 w-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Scheduled
            </TabsTrigger>
            <TabsTrigger value="insights">
              <BarChart3Icon className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>
          
          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {account.type === 'checking' ? (
                        <BanknoteIcon className="h-5 w-5 mr-2 text-blue-600" />
                      ) : (
                        <PiggyBankIcon className="h-5 w-5 mr-2 text-green-600" />
                      )}
                      <CardTitle>{account.name}</CardTitle>
                    </div>
                    {account.isPrimary && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Primary</span>
                    )}
                  </div>
                  <CardDescription>Account {account.accountNumber}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <p className="text-sm text-muted-foreground">Available Balance</p>
                      <p className="text-2xl font-bold">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    {account.type === 'savings' && (
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">APY</p>
                        <p className="text-lg font-semibold text-green-600">{account.apy.toFixed(2)}%</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center text-sm text-muted-foreground">
                    <FileTextIcon className="h-4 w-4 mr-1" />
                    <span>{account.transactions} transactions this month</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/transfers">
                      Transfer
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Link2Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-1">Link External Account</h3>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Connect your external accounts for a complete view of your finances
                </p>
                <Button>
                  Link Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>View your recent banking transactions across all accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'credit' 
                            ? 'bg-green-100 text-green-600' 
                            : transaction.type === 'debit'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-blue-100 text-blue-600'
                        }`}>
                          {transaction.type === 'credit' 
                            ? <ArrowDownIcon className="h-4 w-4" />
                            : transaction.type === 'debit'
                              ? <ArrowUpIcon className="h-4 w-4" />
                              : <ArrowRightIcon className="h-4 w-4" />
                          }
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()} • {transaction.account}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'credit' 
                            ? 'text-green-600' 
                            : transaction.type === 'debit'
                              ? 'text-red-600'
                              : 'text-blue-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : transaction.type === 'debit' ? '-' : ''}
                          ${transaction.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/transactions">
                    View All Transactions
                    <ChevronRightIcon className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Scheduled Tab */}
          <TabsContent value="scheduled">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Transactions</CardTitle>
                <CardDescription>Upcoming payments and transfers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduledTransactions.map((scheduled) => (
                    <div key={scheduled.id} className="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium">{scheduled.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(scheduled.nextDate).toLocaleDateString()} • {scheduled.frequency} • {scheduled.account}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${scheduled.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link to="/transfers">
                    Schedule New Transfer
                  </Link>
                </Button>
                <Button variant="outline">
                  Manage Autopay
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Insights Tab */}
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Banking Insights</CardTitle>
                <CardDescription>Financial analysis and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-900 mb-2">Optimization Opportunity</h3>
                  <p className="text-blue-700 mb-3">
                    Your Primary Checking account has a high balance that could earn more interest in your High-Yield Savings.
                  </p>
                  <Button variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-100" asChild>
                    <Link to="/transfers">
                      Transfer Funds
                    </Link>
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Cash Flow Analysis</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Monthly Income</p>
                      <p className="font-semibold">$12,500.00</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Monthly Expenses</p>
                      <p className="font-semibold">$8,750.00</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Detailed Report</Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">Interest Earned YTD</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Interest Earned</p>
                      <p className="font-semibold text-green-600">$1,245.89</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Projected Annual</p>
                      <p className="font-semibold">$1,850.00</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View Interest History</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Banking Cards Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cards.map((card) => (
              <Card key={card.id} className={`overflow-hidden ${card.type === 'credit' ? 'border-purple-200' : 'border-blue-200'}`}>
                <div className={`h-32 relative ${
                  card.type === 'credit' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                }`}>
                  <div className="absolute top-4 left-4 right-4 bottom-4 flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{card.name}</h3>
                      <CreditCardIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm opacity-80">
                        **** **** **** {card.lastFour}
                      </p>
                      <p className="text-xs mt-1">
                        Expires {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}
                      </p>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-4">
                  {card.type === 'debit' ? (
                    <div>
                      <p className="text-sm text-muted-foreground">Linked to {card.linkedAccount}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Current Balance</p>
                        <p className="font-semibold">${card.balance.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Credit Limit</p>
                        <p className="font-semibold">${card.limit.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Available Credit</p>
                        <p className="font-semibold text-green-600">${card.availableCredit.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">Manage Card</Button>
                  {card.type === 'credit' && (
                    <Button size="sm">Make Payment</Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default CashManagement;
