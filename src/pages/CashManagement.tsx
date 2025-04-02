
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowDownIcon, 
  ArrowRightIcon, 
  ArrowUpIcon, 
  BanknoteIcon, 
  Link2Icon, 
  Wallet, 
  ArrowRightLeft, 
  BuildingIcon,
  PlusCircle
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FileUpload } from "@/components/ui/file-upload";

const CashManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Funding accounts modals state
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showAddManualModal, setShowAddManualModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [verificationFile, setVerificationFile] = useState<File | null>(null);

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

  // Account types for dropdown
  const accountTypes = ["Checking", "Savings", "Money Market", "Other"];

  // States for dropdown
  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
    "New Hampshire", "New Jersey", "New Mexico", "New York", 
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
    "West Virginia", "Wisconsin", "Wyoming"
  ];

  // Form setup for funding accounts
  const form = useForm({
    defaultValues: {
      bankName: "",
      accountHolderName: "",
      accountTitle: "",
      accountType: "",
      bankCity: "",
      bankState: "",
      accountNumber: "",
      routingNumber: "",
    },
  });

  // Sample linked accounts - in a real app, this would come from an API or context
  const linkedAccounts = [
    { id: "acc1", name: "Chase Checking ****4582" },
    { id: "acc2", name: "Bank of America Savings ****7839" },
    { id: "acc3", name: "Wells Fargo Money Market ****9214" }
  ];

  const handleSelectAccount = (account: string) => {
    setSelectedAccount(account);
  };

  const handleSaveSelectedAccount = () => {
    if (selectedAccount) {
      const accountName = linkedAccounts.find(acc => acc.id === selectedAccount)?.name;
      toast.success(`Account ${accountName} selected as funding account`);
      setShowSelectModal(false);
      // Reset selection after closing
      setSelectedAccount(null);
    }
  };

  const handleFileChange = (file: File) => {
    setVerificationFile(file);
    console.log("Verification file selected:", file.name);
  };

  const handleManualAccountSubmit = (values: any) => {
    console.log("Manual account form values:", values);
    console.log("Verification file:", verificationFile);
    
    // In a real app, you would send this data to your backend
    toast.success("Account added successfully");
    setShowAddManualModal(false);
    form.reset();
    setVerificationFile(null);
  };

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
                  <Button variant="outline" className="flex flex-col items-center justify-center h-24 space-y-2" onClick={() => setActiveTab("funding")}>
                    <Wallet className="h-6 w-6" />
                    <span>Add Funding Account</span>
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
                    Select or add a funding account to use for transfers and payments.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Funding accounts are used to fund your transfers, payments, and investments. 
                      You can select an existing linked account or add a new one manually.
                    </p>
                    
                    <Button 
                      className="w-full md:w-auto mt-4 flex items-center" 
                      onClick={() => setShowSelectModal(true)}
                    >
                      <Link2Icon className="mr-2 h-4 w-4" />
                      Select a Funding Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Show current funding accounts if any */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Funding Sources</CardTitle>
                  <CardDescription>
                    These accounts are currently set up as funding sources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {linkedAccounts.length > 0 ? (
                      <div className="divide-y">
                        {linkedAccounts.map((account) => (
                          <div key={account.id} className="py-3 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <Wallet className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{account.name}</p>
                                <p className="text-sm text-muted-foreground">Added on {new Date().toLocaleDateString()}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">Remove</Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No funding accounts set up yet</p>
                        <Button className="mt-4" onClick={() => setShowSelectModal(true)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Funding Account
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Select Account Modal */}
        <Dialog open={showSelectModal} onOpenChange={setShowSelectModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Select a Funding Account</DialogTitle>
              <DialogDescription>
                Please select a linked institution from the dropdown.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account">Select an account</Label>
                  <Select value={selectedAccount || ""} onValueChange={handleSelectAccount}>
                    <SelectTrigger id="account">
                      <SelectValue placeholder="Select an account..." />
                    </SelectTrigger>
                    <SelectContent>
                      {linkedAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  If you need to add a new account, go to the{" "}
                  <Link to="/accounts" className="text-primary hover:underline">
                    Accounts section
                  </Link>{" "}
                  and click Add Account.
                </p>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row justify-between items-center">
              <Button 
                variant="outline" 
                type="button" 
                className="w-full sm:w-auto" 
                onClick={() => {
                  setShowSelectModal(false);
                  setShowAddManualModal(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Account Manually
              </Button>
              <div className="flex gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => setShowSelectModal(false)}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleSaveSelectedAccount}
                  disabled={!selectedAccount}
                  className="flex-1 sm:flex-none"
                >
                  Save
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Manual Account Modal */}
        <Dialog open={showAddManualModal} onOpenChange={setShowAddManualModal}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Account Manually</DialogTitle>
              <DialogDescription>
                Enter the details of your funding account.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleManualAccountSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bank name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountHolderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account holder name" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="accountTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account title" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accountTypes.map((type) => (
                              <SelectItem key={type} value={type.toLowerCase()}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bankCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bank city" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bankState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank State</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account #</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing #</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter routing number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Verification</Label>
                  <FileUpload
                    onFileChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    maxSize={10 * 1024 * 1024}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload a bank statement or voided check associated with this funding account.
                  </p>
                </div>

                <DialogFooter className="pt-4">
                  <Button variant="outline" type="button" onClick={() => setShowAddManualModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </ThreeColumnLayout>
  );
};

export default CashManagement;
