
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  WalletIcon,
  HomeIcon,
  BriefcaseIcon,
  PiggyBankIcon,
  ArrowUpDown,
  Plus,
  CreditCard,
  Building,
  DollarSign,
  MoreHorizontal,
} from "lucide-react";
import { PlaidLinkDialog } from "@/components/accounts/PlaidLinkDialog";
import { AddAccountDialog } from "@/components/accounts/AddAccountDialog";
import { AccountLinkTypeSelector } from "@/components/accounts/AccountLinkTypeSelector";
import { RealEstateTracker } from "@/components/accounts/RealEstateTracker";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Define types
type AccountSection = "all-accounts" | "checking" | "savings" | "investment" | "retirement" | "real-estate" | "credit-cards" | "loans";

type AccountData = {
  id: string;
  name: string;
  type: string;
  balance: number;
  institution: string;
  lastUpdated: string;
  accountNumber: string;
  routingNumber?: string;
  interestRate?: number;
  dueDate?: string;
  minimumPayment?: number;
  creditLimit?: number;
  availableCredit?: number;
  propertyValue?: number;
  propertyAddress?: string;
  loanAmount?: number;
  loanTerm?: number;
  transactions?: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
  }>;
};

// Mock data
const mockAccounts: AccountData[] = [
  {
    id: "1",
    name: "Primary Checking",
    type: "checking",
    balance: 5240.23,
    institution: "Chase Bank",
    lastUpdated: "2023-10-15",
    accountNumber: "****1234",
    routingNumber: "072000326",
  },
  {
    id: "2",
    name: "High-Yield Savings",
    type: "savings",
    balance: 25680.45,
    institution: "Ally Bank",
    lastUpdated: "2023-10-14",
    accountNumber: "****5678",
    interestRate: 3.75,
  },
  {
    id: "3",
    name: "Retirement Fund",
    type: "retirement",
    balance: 352450.89,
    institution: "Vanguard",
    lastUpdated: "2023-10-12",
    accountNumber: "****4321",
  },
  {
    id: "4",
    name: "Stock Portfolio",
    type: "investment",
    balance: 128934.67,
    institution: "Charles Schwab",
    lastUpdated: "2023-10-15",
    accountNumber: "****8765",
  },
  {
    id: "5",
    name: "Travel Rewards Card",
    type: "credit-cards",
    balance: -2340.56,
    institution: "American Express",
    lastUpdated: "2023-10-13",
    accountNumber: "****9012",
    dueDate: "2023-11-05",
    minimumPayment: 35.00,
    creditLimit: 15000,
    availableCredit: 12659.44,
  },
  {
    id: "6",
    name: "Mortgage",
    type: "loans",
    balance: -285000.00,
    institution: "Wells Fargo",
    lastUpdated: "2023-10-10",
    accountNumber: "****3456",
    dueDate: "2023-11-01",
    minimumPayment: 1850.75,
    loanAmount: 320000,
    loanTerm: 30,
  },
  {
    id: "7",
    name: "Vacation Home",
    type: "real-estate",
    balance: 450000.00,
    institution: "Self Managed",
    lastUpdated: "2023-09-30",
    accountNumber: "N/A",
    propertyValue: 450000,
    propertyAddress: "123 Sunset Drive, Miami, FL 33101",
  },
];

// Generate mock transactions for a specific account
const generateMockTransactions = (accountId: string) => {
  const transactions = [];
  const categories = ["Food", "Shopping", "Transportation", "Entertainment", "Utilities", "Health"];
  
  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    transactions.push({
      id: `tx-${accountId}-${i}`,
      date: date.toISOString().split('T')[0],
      description: `Transaction ${i + 1}`,
      amount: Math.round(Math.random() * 200 * 100) / 100,
      category: categories[Math.floor(Math.random() * categories.length)]
    });
  }
  
  return transactions;
};

const Accounts = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedSection, setSelectedSection] = useState<AccountSection>("all-accounts");
  const [accounts, setAccounts] = useState<AccountData[]>(mockAccounts);
  const [showAddAccountDialog, setShowAddAccountDialog] = useState(false);
  const [showPlaidLinkDialog, setShowPlaidLinkDialog] = useState(false);
  const [showAccountTypeSelector, setShowAccountTypeSelector] = useState(false);
  const [showRealEstateTracker, setShowRealEstateTracker] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(null);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  
  // Filter accounts based on selected section
  const filteredAccounts = accounts.filter(account => {
    if (selectedSection === "all-accounts") return true;
    return account.type === selectedSection;
  });

  // Calculate net worth
  const netWorth = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Calculate assets
  const assets = accounts
    .filter(account => account.balance > 0)
    .reduce((sum, account) => sum + account.balance, 0);
  
  // Calculate liabilities
  const liabilities = accounts
    .filter(account => account.balance < 0)
    .reduce((sum, account) => sum + Math.abs(account.balance), 0);

  const handleAccountClick = (account: AccountData) => {
    // Generate transactions if they don't exist
    if (!account.transactions) {
      account.transactions = generateMockTransactions(account.id);
    }
    setSelectedAccount(account);
    setShowAccountDetails(true);
  };

  const handleAddAccount = (accountData: AccountData) => {
    // Generate a new ID
    const newAccount = {
      ...accountData,
      id: `${accounts.length + 1}`,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    
    setAccounts([...accounts, newAccount]);
    setShowAddAccountDialog(false);
    toast.success("Account added successfully");
  };

  const handlePlaidLinkSuccess = (linkToken: string) => {
    console.log("Plaid link success:", linkToken);
    setShowPlaidLinkDialog(false);
    setShowAddAccountDialog(true);
    toast.success("Account linked successfully");
  };

  const handleAddAccountClick = () => {
    setShowAccountTypeSelector(true);
  };

  const handleAccountTypeSelected = (type: string) => {
    setShowAccountTypeSelector(false);
    
    if (type === "plaid") {
      setShowPlaidLinkDialog(true);
    } else if (type === "real-estate") {
      setShowRealEstateTracker(true);
    } else {
      setShowAddAccountDialog(true);
    }
  };

  const handleRealEstateAdded = (propertyData: any) => {
    const newProperty = {
      id: `${accounts.length + 1}`,
      name: propertyData.propertyName,
      type: "real-estate",
      balance: propertyData.propertyValue,
      institution: "Self Managed",
      lastUpdated: new Date().toISOString().split('T')[0],
      accountNumber: "N/A",
      propertyValue: propertyData.propertyValue,
      propertyAddress: propertyData.propertyAddress,
    };
    
    setAccounts([...accounts, newProperty]);
    setShowRealEstateTracker(false);
    toast.success("Property added successfully");
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <ThreeColumnLayout activeMainItem="accounts" activeSecondaryItem={selectedSection} title="Accounts">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Accounts</h1>
          <Button onClick={handleAddAccountClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Net Worth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(netWorth)}</div>
              <div className="flex justify-between mt-2 text-sm">
                <div>
                  <span className="text-gray-500">Assets:</span> {formatCurrency(assets)}
                </div>
                <div>
                  <span className="text-gray-500">Liabilities:</span> {formatCurrency(liabilities)}
                </div>
              </div>
              <Progress value={assets / (assets + liabilities) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accounts.length}</div>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-[#D3E4FD] text-blue-700 hover:bg-[#D3E4FD]">
                  {accounts.filter(a => a.type === "checking" || a.type === "savings").length} Bank
                </Badge>
                <Badge variant="outline" className="bg-[#F2FCE2] text-green-700 hover:bg-[#F2FCE2]">
                  {accounts.filter(a => a.type === "investment" || a.type === "retirement").length} Investment
                </Badge>
                <Badge variant="outline" className="bg-[#FFDEE2] text-red-700 hover:bg-[#FFDEE2]">
                  {accounts.filter(a => a.type === "credit-cards" || a.type === "loans").length} Credit
                </Badge>
                <Badge variant="outline" className="bg-[#FDE1D3] text-orange-700 hover:bg-[#FDE1D3]">
                  {accounts.filter(a => a.type === "real-estate").length} Property
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Last Updated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accounts.length > 0 
                  ? new Date(Math.max(...accounts.map(a => new Date(a.lastUpdated).getTime()))).toLocaleDateString() 
                  : "N/A"}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {accounts.length > 0 ? (
                  <span>
                    {accounts.filter(a => {
                      const today = new Date();
                      const lastUpdated = new Date(a.lastUpdated);
                      const diffTime = Math.abs(today.getTime() - lastUpdated.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 1;
                    }).length} accounts updated today
                  </span>
                ) : "No accounts to update"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredAccounts.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Accounts</CardTitle>
                    <CardDescription>
                      Manage and track all your financial accounts in one place
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Account</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Institution</TableHead>
                          <TableHead className="text-right">Balance</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAccounts.map((account) => (
                          <TableRow key={account.id} onClick={() => handleAccountClick(account)} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">{account.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                account.type === "checking" || account.type === "savings" 
                                  ? "bg-[#D3E4FD] text-blue-700" 
                                  : account.type === "investment" || account.type === "retirement"
                                  ? "bg-[#F2FCE2] text-green-700"
                                  : account.type === "credit-cards" || account.type === "loans"
                                  ? "bg-[#FFDEE2] text-red-700"
                                  : "bg-[#FDE1D3] text-orange-700"
                              }>
                                {account.type.charAt(0).toUpperCase() + account.type.slice(1).replace("-", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>{account.institution}</TableCell>
                            <TableCell className={`text-right ${account.balance < 0 ? "text-red-500" : ""}`}>
                              {formatCurrency(account.balance)}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleAccountClick(account);
                                  }}>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Edit account:", account.id);
                                    toast.info("Edit account feature coming soon");
                                  }}>
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Update balance:", account.id);
                                    toast.info("Update balance feature coming soon");
                                  }}>
                                    Update Balance
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Remove account:", account.id);
                                    setAccounts(accounts.filter(a => a.id !== account.id));
                                    toast.success("Account removed successfully");
                                  }}>
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Accounts Found</CardTitle>
                    <CardDescription>
                      {selectedSection === "all-accounts" 
                        ? "You haven't added any accounts yet." 
                        : `You don't have any ${selectedSection.replace("-", " ")} accounts.`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <Button onClick={handleAddAccountClick}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Account
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  View and manage your recent account transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-6">
                  <p>Select an account to view transactions</p>
                  <Button variant="outline" className="mt-2" onClick={() => setActiveTab("overview")}>
                    Go to Accounts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Insights</CardTitle>
                <CardDescription>
                  Analyze your accounts and get personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Spending Analysis</h3>
                    <p className="text-sm text-gray-500">
                      Connect more accounts to get personalized spending insights.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Savings Opportunities</h3>
                    <p className="text-sm text-gray-500">
                      We've identified potential for higher interest rates on your savings accounts.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Debt Optimization</h3>
                    <p className="text-sm text-gray-500">
                      Strategies to help you pay down debt more efficiently.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Account Details Dialog */}
      <Dialog open={showAccountDetails} onOpenChange={setShowAccountDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedAccount && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAccount.name}</DialogTitle>
                <DialogDescription>
                  {selectedAccount.institution} • Last updated {new Date(selectedAccount.lastUpdated).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Current Balance</p>
                    <p className={`text-2xl font-bold ${selectedAccount.balance < 0 ? "text-red-500" : ""}`}>
                      {formatCurrency(selectedAccount.balance)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Account Number</p>
                    <p className="font-medium">{selectedAccount.accountNumber}</p>
                  </div>
                </div>
                
                {/* Account-specific details */}
                {selectedAccount.type === "checking" && selectedAccount.routingNumber && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Account Details</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Routing Number</p>
                        <p>{selectedAccount.routingNumber}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedAccount.type === "savings" && selectedAccount.interestRate && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Account Details</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Interest Rate</p>
                        <p>{selectedAccount.interestRate}% APY</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedAccount.type === "credit-cards" && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Credit Card Details</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Payment Due Date</p>
                        <p>{selectedAccount.dueDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Minimum Payment</p>
                        <p>{formatCurrency(selectedAccount.minimumPayment || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Credit Limit</p>
                        <p>{formatCurrency(selectedAccount.creditLimit || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Available Credit</p>
                        <p>{formatCurrency(selectedAccount.availableCredit || 0)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedAccount.type === "loans" && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Loan Details</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Payment Due Date</p>
                        <p>{selectedAccount.dueDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Monthly Payment</p>
                        <p>{formatCurrency(selectedAccount.minimumPayment || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Original Loan Amount</p>
                        <p>{formatCurrency(selectedAccount.loanAmount || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Loan Term</p>
                        <p>{selectedAccount.loanTerm} years</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedAccount.type === "real-estate" && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Property Details</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Property Address</p>
                        <p>{selectedAccount.propertyAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Property Value</p>
                        <p>{formatCurrency(selectedAccount.propertyValue || 0)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Recent Transactions */}
                <div>
                  <h3 className="font-medium mb-2">Recent Transactions</h3>
                  {selectedAccount.transactions && selectedAccount.transactions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedAccount.transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>{transaction.category}</TableCell>
                            <TableCell className={`text-right ${transaction.amount < 0 ? "text-red-500" : ""}`}>
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-gray-500">No recent transactions found.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Account Management Dialogs */}
      {showAddAccountDialog && (
        <AddAccountDialog 
          isOpen={showAddAccountDialog}
          onClose={() => setShowAddAccountDialog(false)}
          onAdd={handleAddAccount}
          selectedSection={selectedSection}
        />
      )}
      
      {showPlaidLinkDialog && (
        <PlaidLinkDialog
          isOpen={showPlaidLinkDialog}
          onClose={() => setShowPlaidLinkDialog(false)}
          onLinkSuccess={handlePlaidLinkSuccess}
        />
      )}
      
      {showAccountTypeSelector && (
        <AccountLinkTypeSelector
          isOpen={showAccountTypeSelector}
          onClose={() => setShowAccountTypeSelector(false)}
          onAdd={handleAccountTypeSelected}
        />
      )}
      
      {showRealEstateTracker && (
        <RealEstateTracker
          isOpen={showRealEstateTracker}
          onClose={() => setShowRealEstateTracker(false)}
          onAdd={handleRealEstateAdded}
        />
      )}
    </ThreeColumnLayout>
  );
};

export default Accounts;
