
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon, Calendar, Repeat } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'scheduled';
  date: string;
  amount: number;
  fromAccount?: string;
  toAccount?: string;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  frequency?: string;
  nextDate?: string;
}

const Transfers = () => {
  const [activeTab, setActiveTab] = useState("deposit");
  const { userProfile } = useUser();
  
  // Form states for different transfer types
  const [depositForm, setDepositForm] = useState({
    amount: "",
    toAccount: "Checking Account",
    fromAccount: "",
    description: ""
  });
  
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: "",
    fromAccount: "Checking Account",
    toAccount: "",
    description: ""
  });
  
  const [scheduledForm, setScheduledForm] = useState({
    amount: "",
    fromAccount: "Checking Account",
    toAccount: "Savings Account",
    frequency: "Monthly",
    startDate: "",
    description: ""
  });
  
  // Sample recent transactions
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([
    {
      id: "tx-1",
      type: "deposit",
      date: "2023-10-15",
      amount: 1500,
      toAccount: "Checking Account",
      fromAccount: "External Bank",
      status: "completed",
      description: "Salary deposit"
    },
    {
      id: "tx-2",
      type: "withdrawal",
      date: "2023-10-10",
      amount: 500,
      fromAccount: "Savings Account",
      toAccount: "External Account",
      status: "completed",
      description: "Personal withdrawal"
    },
    {
      id: "tx-3",
      type: "scheduled",
      date: "2023-10-01",
      amount: 200,
      fromAccount: "Checking Account",
      toAccount: "Savings Account",
      status: "completed",
      description: "Monthly savings",
      frequency: "Monthly",
      nextDate: "2023-11-01"
    }
  ]);
  
  // Sample scheduled transfers
  const [scheduledTransfers, setScheduledTransfers] = useState<Transaction[]>([
    {
      id: "sched-1",
      type: "scheduled",
      date: "2023-09-01",
      amount: 200,
      fromAccount: "Checking Account",
      toAccount: "Savings Account",
      status: "pending",
      description: "Monthly savings",
      frequency: "Monthly",
      nextDate: "2023-11-01"
    },
    {
      id: "sched-2",
      type: "scheduled",
      date: "2023-09-15",
      amount: 500,
      fromAccount: "Checking Account",
      toAccount: "Investment Account",
      status: "pending",
      description: "Investment contribution",
      frequency: "Bi-weekly",
      nextDate: "2023-10-29"
    }
  ]);
  
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!depositForm.amount || !depositForm.toAccount || !depositForm.fromAccount) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Process deposit logic would go here
    
    // Add to recent transactions
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "deposit",
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(depositForm.amount),
      toAccount: depositForm.toAccount,
      fromAccount: depositForm.fromAccount,
      status: "pending",
      description: depositForm.description
    };
    
    setRecentTransactions([newTransaction, ...recentTransactions]);
    
    toast.success("Deposit initiated", {
      description: `$${depositForm.amount} will be deposited into your ${depositForm.toAccount}`
    });
    
    // Reset form
    setDepositForm({
      amount: "",
      toAccount: "Checking Account",
      fromAccount: "",
      description: ""
    });
  };
  
  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!withdrawalForm.amount || !withdrawalForm.fromAccount || !withdrawalForm.toAccount) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Process withdrawal logic would go here
    
    // Add to recent transactions
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      type: "withdrawal",
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(withdrawalForm.amount),
      fromAccount: withdrawalForm.fromAccount,
      toAccount: withdrawalForm.toAccount,
      status: "pending",
      description: withdrawalForm.description
    };
    
    setRecentTransactions([newTransaction, ...recentTransactions]);
    
    toast.success("Withdrawal initiated", {
      description: `$${withdrawalForm.amount} will be withdrawn from your ${withdrawalForm.fromAccount}`
    });
    
    // Reset form
    setWithdrawalForm({
      amount: "",
      fromAccount: "Checking Account",
      toAccount: "",
      description: ""
    });
  };
  
  const handleScheduledSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scheduledForm.amount || !scheduledForm.fromAccount || !scheduledForm.toAccount || !scheduledForm.startDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Process scheduled transfer logic would go here
    
    // Calculate next date based on frequency
    let nextDate = new Date(scheduledForm.startDate);
    if (scheduledForm.frequency === "Monthly") {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (scheduledForm.frequency === "Bi-weekly") {
      nextDate.setDate(nextDate.getDate() + 14);
    } else if (scheduledForm.frequency === "Weekly") {
      nextDate.setDate(nextDate.getDate() + 7);
    }
    
    // Add to scheduled transfers
    const newScheduledTransfer: Transaction = {
      id: `sched-${Date.now()}`,
      type: "scheduled",
      date: scheduledForm.startDate,
      amount: parseFloat(scheduledForm.amount),
      fromAccount: scheduledForm.fromAccount,
      toAccount: scheduledForm.toAccount,
      status: "pending",
      description: scheduledForm.description,
      frequency: scheduledForm.frequency,
      nextDate: nextDate.toISOString().split('T')[0]
    };
    
    setScheduledTransfers([newScheduledTransfer, ...scheduledTransfers]);
    
    toast.success("Scheduled transfer created", {
      description: `$${scheduledForm.amount} will be transferred ${scheduledForm.frequency.toLowerCase()} starting ${scheduledForm.startDate}`
    });
    
    // Reset form
    setScheduledForm({
      amount: "",
      fromAccount: "Checking Account",
      toAccount: "Savings Account",
      frequency: "Monthly",
      startDate: "",
      description: ""
    });
  };
  
  const cancelScheduledTransfer = (id: string) => {
    setScheduledTransfers(scheduledTransfers.filter(transfer => transfer.id !== id));
    
    toast.success("Scheduled transfer cancelled");
  };
  
  return (
    <ThreeColumnLayout title="Transfers">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Transfers</h1>
          <p className="text-muted-foreground mt-2">
            Move money between your accounts or to external accounts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transfer section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Make a Transfer</CardTitle>
                <CardDescription>
                  Move money between your accounts or to external accounts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="deposit" className="flex items-center gap-2">
                      <ArrowDownIcon className="h-4 w-4" />
                      <span>Deposit</span>
                    </TabsTrigger>
                    <TabsTrigger value="withdrawal" className="flex items-center gap-2">
                      <ArrowUpIcon className="h-4 w-4" />
                      <span>Withdrawal</span>
                    </TabsTrigger>
                    <TabsTrigger value="scheduled" className="flex items-center gap-2">
                      <Repeat className="h-4 w-4" />
                      <span>Scheduled</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Deposit Tab */}
                  <TabsContent value="deposit">
                    <form onSubmit={handleDepositSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="deposit-amount">Amount</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="deposit-amount"
                              type="number"
                              placeholder="0.00"
                              className="pl-8"
                              value={depositForm.amount}
                              onChange={(e) => setDepositForm({...depositForm, amount: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="deposit-to-account">To Account</Label>
                          <Select 
                            value={depositForm.toAccount}
                            onValueChange={(value) => setDepositForm({...depositForm, toAccount: value})}
                          >
                            <SelectTrigger id="deposit-to-account">
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Checking Account">Checking Account</SelectItem>
                              <SelectItem value="Savings Account">Savings Account</SelectItem>
                              <SelectItem value="Investment Account">Investment Account</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="deposit-from-account">From External Account</Label>
                        <Input 
                          id="deposit-from-account"
                          placeholder="Enter external account or bank name"
                          value={depositForm.fromAccount}
                          onChange={(e) => setDepositForm({...depositForm, fromAccount: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="deposit-description">Description (Optional)</Label>
                        <Input 
                          id="deposit-description"
                          placeholder="Add a note about this deposit"
                          value={depositForm.description}
                          onChange={(e) => setDepositForm({...depositForm, description: e.target.value})}
                        />
                      </div>
                      
                      <Button type="submit" className="w-full">Initiate Deposit</Button>
                    </form>
                  </TabsContent>
                  
                  {/* Withdrawal Tab */}
                  <TabsContent value="withdrawal">
                    <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="withdrawal-amount">Amount</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="withdrawal-amount"
                              type="number"
                              placeholder="0.00"
                              className="pl-8"
                              value={withdrawalForm.amount}
                              onChange={(e) => setWithdrawalForm({...withdrawalForm, amount: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="withdrawal-from-account">From Account</Label>
                          <Select 
                            value={withdrawalForm.fromAccount}
                            onValueChange={(value) => setWithdrawalForm({...withdrawalForm, fromAccount: value})}
                          >
                            <SelectTrigger id="withdrawal-from-account">
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Checking Account">Checking Account</SelectItem>
                              <SelectItem value="Savings Account">Savings Account</SelectItem>
                              <SelectItem value="Investment Account">Investment Account</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="withdrawal-to-account">To External Account</Label>
                        <Input 
                          id="withdrawal-to-account"
                          placeholder="Enter external account or recipient"
                          value={withdrawalForm.toAccount}
                          onChange={(e) => setWithdrawalForm({...withdrawalForm, toAccount: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="withdrawal-description">Description (Optional)</Label>
                        <Input 
                          id="withdrawal-description"
                          placeholder="Add a note about this withdrawal"
                          value={withdrawalForm.description}
                          onChange={(e) => setWithdrawalForm({...withdrawalForm, description: e.target.value})}
                        />
                      </div>
                      
                      <Button type="submit" className="w-full">Initiate Withdrawal</Button>
                    </form>
                  </TabsContent>
                  
                  {/* Scheduled Tab */}
                  <TabsContent value="scheduled">
                    <form onSubmit={handleScheduledSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="scheduled-amount">Amount</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <Input 
                              id="scheduled-amount"
                              type="number"
                              placeholder="0.00"
                              className="pl-8"
                              value={scheduledForm.amount}
                              onChange={(e) => setScheduledForm({...scheduledForm, amount: e.target.value})}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="scheduled-frequency">Frequency</Label>
                          <Select 
                            value={scheduledForm.frequency}
                            onValueChange={(value) => setScheduledForm({...scheduledForm, frequency: value})}
                          >
                            <SelectTrigger id="scheduled-frequency">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="One-time">One-time</SelectItem>
                              <SelectItem value="Weekly">Weekly</SelectItem>
                              <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                              <SelectItem value="Quarterly">Quarterly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="scheduled-from-account">From Account</Label>
                          <Select 
                            value={scheduledForm.fromAccount}
                            onValueChange={(value) => setScheduledForm({...scheduledForm, fromAccount: value})}
                          >
                            <SelectTrigger id="scheduled-from-account">
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Checking Account">Checking Account</SelectItem>
                              <SelectItem value="Savings Account">Savings Account</SelectItem>
                              <SelectItem value="Investment Account">Investment Account</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="scheduled-to-account">To Account</Label>
                          <Select 
                            value={scheduledForm.toAccount}
                            onValueChange={(value) => setScheduledForm({...scheduledForm, toAccount: value})}
                          >
                            <SelectTrigger id="scheduled-to-account">
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Checking Account">Checking Account</SelectItem>
                              <SelectItem value="Savings Account">Savings Account</SelectItem>
                              <SelectItem value="Investment Account">Investment Account</SelectItem>
                              <SelectItem value="External Account">External Account</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="scheduled-start-date">Start Date</Label>
                        <div className="relative">
                          <Input 
                            id="scheduled-start-date"
                            type="date"
                            value={scheduledForm.startDate}
                            onChange={(e) => setScheduledForm({...scheduledForm, startDate: e.target.value})}
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="scheduled-description">Description (Optional)</Label>
                        <Input 
                          id="scheduled-description"
                          placeholder="Add a note about this recurring transfer"
                          value={scheduledForm.description}
                          onChange={(e) => setScheduledForm({...scheduledForm, description: e.target.value})}
                        />
                      </div>
                      
                      <Button type="submit" className="w-full">Schedule Transfer</Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Account summary section */}
          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Accounts</CardTitle>
                <CardDescription>Available balances for your accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <p className="font-medium">Checking Account</p>
                    <p className="text-sm text-muted-foreground">Primary</p>
                  </div>
                  <p className="font-semibold">$12,467.52</p>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <p className="font-medium">Savings Account</p>
                    <p className="text-sm text-muted-foreground">Emergency Fund</p>
                  </div>
                  <p className="font-semibold">$35,920.18</p>
                </div>
                
                <div className="flex justify-between items-center pb-2">
                  <div>
                    <p className="font-medium">Investment Account</p>
                    <p className="text-sm text-muted-foreground">Retirement</p>
                  </div>
                  <p className="font-semibold">$152,890.43</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Transfers</CardTitle>
                <CardDescription>Your upcoming automatic transfers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scheduledTransfers.length > 0 ? (
                  scheduledTransfers.map((transfer) => (
                    <div key={transfer.id} className="flex justify-between items-start pb-3 border-b last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium">${transfer.amount.toFixed(2)}</p>
                        <p className="text-sm">From: {transfer.fromAccount}</p>
                        <p className="text-sm">To: {transfer.toAccount}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {transfer.frequency} • Next: {new Date(transfer.nextDate!).toLocaleDateString()}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-shrink-0"
                        onClick={() => cancelScheduledTransfer(transfer.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No scheduled transfers</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => setActiveTab("scheduled")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Set up recurring transfer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Recent transactions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your most recent deposits, withdrawals, and transfers
            </CardDescription>
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
                          : <Repeat className="h-4 w-4" />
                      }
                    </div>
                    <div>
                      <p className="font-medium">
                        {transaction.type === 'deposit' 
                          ? 'Deposit to '
                          : transaction.type === 'withdrawal'
                            ? 'Withdrawal from '
                            : 'Transfer from '
                        }
                        {transaction.type === 'withdrawal' ? transaction.fromAccount : transaction.toAccount}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()} • 
                        {transaction.type === 'deposit' 
                          ? ` From ${transaction.fromAccount}`
                          : transaction.type === 'withdrawal'
                            ? ` To ${transaction.toAccount}`
                            : ` To ${transaction.toAccount}`
                        }
                      </p>
                      {transaction.description && (
                        <p className="text-sm text-muted-foreground mt-1">{transaction.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'deposit' 
                        ? 'text-green-600' 
                        : 'text-foreground'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : ''}${transaction.amount.toFixed(2)}
                    </p>
                    <p className={`text-sm ${
                      transaction.status === 'pending' 
                        ? 'text-amber-500' 
                        : transaction.status === 'completed'
                          ? 'text-green-600'
                          : 'text-red-600'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};

export default Transfers;
