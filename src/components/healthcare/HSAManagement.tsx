
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRightLeft, Plus, Wallet, Download, Calendar } from "lucide-react";

interface HSAAccount {
  id: string;
  provider: string;
  accountNumber: string;
  balance: number;
  owner: string;
  yearToDateContribution: number;
  lastUpdated: string;
}

interface HSATransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "contribution" | "expense" | "distribution";
  category?: string;
  accountId: string;
}

export function HSAManagement() {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<HSAAccount[]>([
    {
      id: "1",
      provider: "Fidelity",
      accountNumber: "****5678",
      balance: 5250.75,
      owner: "Tom Brady",
      yearToDateContribution: 3650,
      lastUpdated: "2025-04-25"
    },
    {
      id: "2",
      provider: "HSA Bank",
      accountNumber: "****1234",
      balance: 2750.50,
      owner: "Jane Brady",
      yearToDateContribution: 1850,
      lastUpdated: "2025-04-24"
    }
  ]);
  
  const [transactions, setTransactions] = useState<HSATransaction[]>([
    {
      id: "t1",
      date: "2025-04-15",
      description: "Annual Family Contribution",
      amount: 2000.00,
      type: "contribution",
      accountId: "1"
    },
    {
      id: "t2",
      date: "2025-04-10",
      description: "Prescription Medication",
      amount: -125.30,
      type: "expense",
      category: "Pharmacy",
      accountId: "1"
    },
    {
      id: "t3",
      date: "2025-03-28",
      description: "Doctor Visit Co-pay",
      amount: -50.00,
      type: "expense",
      category: "Doctor",
      accountId: "2"
    },
    {
      id: "t4",
      date: "2025-03-15",
      description: "Employer Contribution",
      amount: 1000.00,
      type: "contribution",
      accountId: "1"
    },
    {
      id: "t5",
      date: "2025-03-05",
      description: "Dental Cleaning",
      amount: -150.00,
      type: "expense",
      category: "Dental",
      accountId: "2"
    }
  ]);
  
  const [newTransactionOpen, setNewTransactionOpen] = useState(false);
  const [newAccountOpen, setNewAccountOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || "");
  
  const handleAddTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newTransaction: HSATransaction = {
      id: `t${transactions.length + 1}`,
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      amount: parseFloat(formData.get('amount') as string) * 
        (formData.get('type') === 'expense' ? -1 : 1),
      type: formData.get('type') as "contribution" | "expense" | "distribution",
      category: formData.get('type') === 'expense' ? formData.get('category') as string : undefined,
      accountId: formData.get('accountId') as string
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Update account balance
    setAccounts(accounts.map(account => {
      if (account.id === newTransaction.accountId) {
        const updatedBalance = account.balance + newTransaction.amount;
        const updatedYTD = 
          newTransaction.type === 'contribution' 
            ? account.yearToDateContribution + Math.abs(newTransaction.amount)
            : account.yearToDateContribution;
            
        return {
          ...account,
          balance: updatedBalance,
          yearToDateContribution: updatedYTD,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return account;
    }));
    
    setNewTransactionOpen(false);
    toast({
      title: "Transaction Added",
      description: "Your HSA transaction has been recorded successfully."
    });
  };
  
  const handleAddAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newAccount: HSAAccount = {
      id: `${accounts.length + 1}`,
      provider: formData.get('provider') as string,
      accountNumber: formData.get('accountNumber') as string,
      balance: parseFloat(formData.get('balance') as string || "0"),
      owner: formData.get('owner') as string,
      yearToDateContribution: parseFloat(formData.get('ytdContribution') as string || "0"),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setAccounts([...accounts, newAccount]);
    setNewAccountOpen(false);
    toast({
      title: "Account Added",
      description: "Your HSA account has been added successfully."
    });
  };
  
  const currentYear = new Date().getFullYear();
  const hsaLimit = 8300; // 2025 family contribution limit (example)
  const totalContribution = accounts.reduce((sum, account) => sum + account.yearToDateContribution, 0);
  const remainingContribution = hsaLimit - totalContribution;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Current HSA Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${accounts.reduce((sum, account) => sum + account.balance, 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{currentYear} Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalContribution.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="inline-block pr-2 border-r">Limit: ${hsaLimit.toLocaleString()}</span>
              <span className="inline-block pl-2">Remaining: ${remainingContribution.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button size="sm" onClick={() => setNewTransactionOpen(true)}>
              <ArrowRightLeft className="h-4 w-4 mr-1" /> Record Transaction
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">HSA Accounts</h3>
            <Button size="sm" onClick={() => setNewAccountOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Account
            </Button>
          </div>
          
          <div className="space-y-4">
            {accounts.map(account => (
              <Card key={account.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{account.provider}</CardTitle>
                    <Wallet className="h-4 w-4 text-primary" />
                  </div>
                  <CardDescription>Account: {account.accountNumber} • Owner: {account.owner}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">${account.balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                      <p className="text-xs text-muted-foreground">Current Balance</p>
                    </div>
                    <div>
                      <p className="font-medium">${account.yearToDateContribution.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                      <p className="text-xs text-muted-foreground">{currentYear} YTD Contributions</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground text-right">Last Updated</p>
                      <p className="text-xs">{new Date(account.lastUpdated).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">HSA Tax Benefits</CardTitle>
              <CardDescription>Triple tax advantage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Tax-Deductible Contributions</h4>
                <p className="text-muted-foreground">Contributions to your HSA are pre-tax or tax-deductible.</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Tax-Free Growth</h4>
                <p className="text-muted-foreground">Interest and investment earnings grow tax-free.</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Tax-Free Withdrawals</h4>
                <p className="text-muted-foreground">For qualified medical expenses, withdrawals are tax-free.</p>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">2025 Contribution Limits: $4,150 (individual) / $8,300 (family)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 10).map((transaction) => {
                  const account = accounts.find(a => a.id === transaction.accountId);
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.category || transaction.type}</TableCell>
                      <TableCell>{account?.provider}</TableCell>
                      <TableCell className={`text-right ${transaction.amount > 0 ? 'text-green-500' : ''}`}>
                        {transaction.amount > 0 ? '+' : ''}
                        ${Math.abs(transaction.amount).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableCaption>
                Showing the 10 most recent transactions
              </TableCaption>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-center py-4">
            <Button variant="outline" size="sm">View All Transactions</Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Add Transaction Dialog */}
      <Dialog open={newTransactionOpen} onOpenChange={setNewTransactionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record HSA Transaction</DialogTitle>
            <DialogDescription>
              Add a new contribution, expense, or distribution to your HSA account.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddTransaction} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountId">HSA Account</Label>
                <Select name="accountId" defaultValue={selectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.provider} ({account.accountNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type</Label>
                <Select name="type" defaultValue="expense">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="contribution">Contribution</SelectItem>
                    <SelectItem value="distribution">Distribution</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="date" 
                    name="date" 
                    type="date" 
                    defaultValue={new Date().toISOString().split('T')[0]} 
                    className="pl-9"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input id="amount" name="amount" type="number" step="0.01" min="0" placeholder="0.00" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="Transaction description" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category (for expenses)</Label>
              <Select name="category" defaultValue="doctor">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Doctor/Medical</SelectItem>
                  <SelectItem value="dental">Dental</SelectItem>
                  <SelectItem value="vision">Vision</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy/Prescription</SelectItem>
                  <SelectItem value="therapy">Therapy/Mental Health</SelectItem>
                  <SelectItem value="equipment">Medical Equipment</SelectItem>
                  <SelectItem value="other">Other Qualified Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button type="submit">Save Transaction</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Add Account Dialog */}
      <Dialog open={newAccountOpen} onOpenChange={setNewAccountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add HSA Account</DialogTitle>
            <DialogDescription>
              Add a new Health Savings Account to track contributions and expenses.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddAccount} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="provider">HSA Provider</Label>
              <Input id="provider" name="provider" placeholder="HSA Bank, Fidelity, etc." />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" name="accountNumber" placeholder="Last 4 digits" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="owner">Account Owner</Label>
                <Input id="owner" name="owner" placeholder="Primary account holder" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="balance">Current Balance ($)</Label>
                <Input id="balance" name="balance" type="number" step="0.01" min="0" placeholder="0.00" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ytdContribution">YTD Contribution ($)</Label>
                <Input id="ytdContribution" name="ytdContribution" type="number" step="0.01" min="0" placeholder="0.00" />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit">Add Account</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
