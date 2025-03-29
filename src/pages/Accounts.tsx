
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  PlusIcon, 
  CircleDollarSign, 
  Bank, 
  Percent, 
  TrendingUp, 
  Eye, 
  EyeOff, 
  RefreshCw,
  ChevronDown,
  Briefcase,
  Home,
  CreditCard,
  Shield,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";
import { PlaidLinkDialog } from "@/components/accounts/PlaidLinkDialog";
import { AddAccountDialog } from "@/components/accounts/AddAccountDialog";
import { AccountLinkTypeSelector } from "@/components/accounts/AccountLinkTypeSelector";
import { RealEstateTracker } from "@/components/accounts/RealEstateTracker";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";

type AccountSection = "all-accounts" | "checking" | "savings" | "investment" | "retirement" | "real-estate";

type Account = {
  id: string;
  name: string;
  institution: string;
  type: string;
  balance: number;
  lastUpdated: string;
  isHidden?: boolean;
};

type PropertyAsset = {
  id: string;
  address: string;
  type: string;
  purchasePrice: number;
  currentValue: number;
  equity: number;
  mortgage?: number;
};

const accounts: Account[] = [
  {
    id: "acc-001",
    name: "Everyday Checking",
    institution: "Chase Bank",
    type: "checking",
    balance: 4250.67,
    lastUpdated: "2023-10-25T10:30:00",
  },
  {
    id: "acc-002",
    name: "Savings Account",
    institution: "Chase Bank",
    type: "savings",
    balance: 12750.42,
    lastUpdated: "2023-10-25T10:30:00",
  },
  {
    id: "acc-003",
    name: "High Yield Savings",
    institution: "Ally Bank",
    type: "savings",
    balance: 25340.91,
    lastUpdated: "2023-10-25T09:15:00",
  },
  {
    id: "acc-004",
    name: "Roth IRA",
    institution: "Vanguard",
    type: "retirement",
    balance: 62481.34,
    lastUpdated: "2023-10-24T16:00:00",
  },
  {
    id: "acc-005",
    name: "401(k)",
    institution: "Fidelity",
    type: "retirement",
    balance: 143875.29,
    lastUpdated: "2023-10-24T16:30:00",
  },
  {
    id: "acc-006",
    name: "Brokerage Account",
    institution: "Charles Schwab",
    type: "investment",
    balance: 87651.20,
    lastUpdated: "2023-10-24T16:15:00",
  },
  {
    id: "acc-007",
    name: "Taxable Account",
    institution: "Vanguard",
    type: "investment",
    balance: 53120.87,
    lastUpdated: "2023-10-24T16:00:00",
  },
  {
    id: "acc-008",
    name: "Business Checking",
    institution: "Bank of America",
    type: "checking",
    balance: 8975.12,
    lastUpdated: "2023-10-25T08:45:00",
    isHidden: true,
  },
];

const realEstateProperties: PropertyAsset[] = [
  {
    id: "prop-001",
    address: "123 Main St, Austin, TX 78701",
    type: "Primary Residence",
    purchasePrice: 475000,
    currentValue: 525000,
    equity: 125000,
    mortgage: 400000,
  },
  {
    id: "prop-002",
    address: "456 Rental Ave, Austin, TX 78704",
    type: "Rental Property",
    purchasePrice: 350000,
    currentValue: 425000,
    equity: 155000,
    mortgage: 270000,
  },
  {
    id: "prop-003",
    address: "789 Vacation Dr, Aspen, CO 81611",
    type: "Vacation Home",
    purchasePrice: 650000,
    currentValue: 875000,
    equity: 325000,
    mortgage: 550000,
  },
];

const Accounts = () => {
  const [selectedSection, setSelectedSection] = useState<AccountSection>("all-accounts");
  const [hideBalances, setHideBalances] = useState(false);
  const [showAddAccountDialog, setShowAddAccountDialog] = useState(false);
  const [showPlaidLinkDialog, setShowPlaidLinkDialog] = useState(false);
  const [showAccountTypeSelector, setShowAccountTypeSelector] = useState(false);
  const [showAddPropertyDialog, setShowAddPropertyDialog] = useState(false);
  const [showHiddenAccounts, setShowHiddenAccounts] = useState(false);
  
  // Filter accounts based on the selected section
  const filteredAccounts = accounts.filter(account => {
    // First filter by visibility
    if (!showHiddenAccounts && account.isHidden) {
      return false;
    }
    
    // Then filter by section
    if (selectedSection === "all-accounts") {
      return true;
    }
    if (selectedSection === "real-estate") {
      return false; // Real estate is handled separately
    }
    return account.type === selectedSection;
  });

  // Calculate totals
  const totalBalance = filteredAccounts.reduce((sum, account) => sum + account.balance, 0);
  const savingsTotal = accounts
    .filter(a => a.type === "savings" && (!a.isHidden || showHiddenAccounts))
    .reduce((sum, a) => sum + a.balance, 0);
  const checkingTotal = accounts
    .filter(a => a.type === "checking" && (!a.isHidden || showHiddenAccounts))
    .reduce((sum, a) => sum + a.balance, 0);
  const investmentTotal = accounts
    .filter(a => a.type === "investment" && (!a.isHidden || showHiddenAccounts))
    .reduce((sum, a) => sum + a.balance, 0);
  const retirementTotal = accounts
    .filter(a => a.type === "retirement" && (!a.isHidden || showHiddenAccounts))
    .reduce((sum, a) => sum + a.balance, 0);
  
  // Calculate real estate totals
  const realEstateValue = realEstateProperties.reduce((sum, property) => sum + property.currentValue, 0);
  const realEstateEquity = realEstateProperties.reduce((sum, property) => sum + property.equity, 0);
  const totalMortgage = realEstateProperties.reduce((sum, property) => sum + (property.mortgage || 0), 0);

  const refreshAccounts = () => {
    toast.success("Accounts refreshed successfully");
  };

  const handleSectionChange = (section: AccountSection) => {
    setSelectedSection(section);
  };

  const handleAddNewClick = () => {
    if (selectedSection === "real-estate") {
      setShowAddPropertyDialog(true);
    } else {
      setShowAccountTypeSelector(true);
    }
  };

  const handleAccountTypeSelected = (type: string) => {
    setShowAccountTypeSelector(false);
    if (type === "plaid") {
      setShowPlaidLinkDialog(true);
    } else {
      setShowAddAccountDialog(true);
    }
  };

  const handlePlaidLinkSuccess = (token: string) => {
    console.log("Plaid link successful with token:", token);
    setShowPlaidLinkDialog(false);
    toast.success("Account linked successfully!");
  };

  const handleAddAccount = (accountData: any) => {
    console.log("Adding new account:", accountData);
    setShowAddAccountDialog(false);
    toast.success(`${accountData.name} account added successfully!`);
  };

  const handleAddProperty = (propertyData: any) => {
    console.log("Adding new property:", propertyData);
    setShowAddPropertyDialog(false);
    toast.success(`Property at ${propertyData.address} added successfully!`);
  };

  const handleHideAccount = (accountId: string) => {
    console.log("Hiding account:", accountId);
    toast.success("Account visibility updated");
  };

  const handleDeleteAccount = (accountId: string) => {
    console.log("Deleting account:", accountId);
    toast.success("Account deleted successfully");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <ThreeColumnLayout
      activeMainItem="accounts"
      activeSecondaryItem={selectedSection}
      title="Accounts"
    >
      <div className="min-h-screen animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Accounts</h1>
            <p className="text-muted-foreground">Manage all your financial accounts in one place</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setHideBalances(!hideBalances)}
              title={hideBalances ? "Show Balances" : "Hide Balances"}
            >
              {hideBalances ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={refreshAccounts}
              title="Refresh Accounts"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={handleAddNewClick}>
              <PlusIcon className="mr-2 h-4 w-4" />
              {selectedSection === "real-estate" ? "Add Property" : "Add Account"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className={selectedSection === "all-accounts" ? "border-primary" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hideBalances ? "••••••" : formatCurrency(totalBalance)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all accounts
              </p>
              <Button 
                variant="ghost" 
                className="mt-3 w-full justify-between px-2"
                onClick={() => handleSectionChange("all-accounts")}
              >
                View All Accounts
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className={selectedSection === "checking" ? "border-primary" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Checking</CardTitle>
              <Bank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hideBalances ? "••••••" : formatCurrency(checkingTotal)}
              </div>
              <p className="text-xs text-muted-foreground">
                {accounts.filter(a => a.type === "checking" && (!a.isHidden || showHiddenAccounts)).length} account(s)
              </p>
              <Button 
                variant="ghost" 
                className="mt-3 w-full justify-between px-2"
                onClick={() => handleSectionChange("checking")}
              >
                View Checking
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className={selectedSection === "savings" ? "border-primary" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Savings</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hideBalances ? "••••••" : formatCurrency(savingsTotal)}
              </div>
              <p className="text-xs text-muted-foreground">
                {accounts.filter(a => a.type === "savings" && (!a.isHidden || showHiddenAccounts)).length} account(s)
              </p>
              <Button 
                variant="ghost" 
                className="mt-3 w-full justify-between px-2"
                onClick={() => handleSectionChange("savings")}
              >
                View Savings
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className={selectedSection === "investment" ? "border-primary" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Investments</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hideBalances ? "••••••" : formatCurrency(investmentTotal)}
              </div>
              <p className="text-xs text-muted-foreground">
                {accounts.filter(a => a.type === "investment" && (!a.isHidden || showHiddenAccounts)).length} account(s)
              </p>
              <Button 
                variant="ghost" 
                className="mt-3 w-full justify-between px-2"
                onClick={() => handleSectionChange("investment")}
              >
                View Investments
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className={selectedSection === "retirement" ? "border-primary" : ""}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Retirement</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hideBalances ? "••••••" : formatCurrency(retirementTotal)}
              </div>
              <p className="text-xs text-muted-foreground">
                {accounts.filter(a => a.type === "retirement" && (!a.isHidden || showHiddenAccounts)).length} account(s)
              </p>
              <Button 
                variant="ghost" 
                className="mt-3 w-full justify-between px-2"
                onClick={() => handleSectionChange("retirement")}
              >
                View Retirement
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card className={`md:col-span-3 ${selectedSection === "real-estate" ? "border-primary" : ""}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Real Estate</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Value</p>
                  <p className="text-xl font-bold">
                    {hideBalances ? "••••••" : formatCurrency(realEstateValue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Equity</p>
                  <p className="text-xl font-bold">
                    {hideBalances ? "••••••" : formatCurrency(realEstateEquity)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Mortgage</p>
                  <p className="text-xl font-bold">
                    {hideBalances ? "••••••" : formatCurrency(totalMortgage)}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="mt-3 w-full justify-between px-2"
                onClick={() => handleSectionChange("real-estate")}
              >
                View Real Estate
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {selectedSection === "all-accounts" 
              ? "All Accounts" 
              : selectedSection === "real-estate" 
                ? "Properties" 
                : `${selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)} Accounts`}
          </h2>
          
          {selectedSection !== "real-estate" && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowHiddenAccounts(!showHiddenAccounts)}
            >
              {showHiddenAccounts ? "Hide Hidden Accounts" : "Show Hidden Accounts"}
            </Button>
          )}
        </div>
        
        {selectedSection === "real-estate" ? (
          <RealEstateTracker properties={realEstateProperties} />
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.length > 0 ? (
                    filteredAccounts.map((account) => (
                      <TableRow key={account.id} className={account.isHidden ? "text-muted-foreground" : ""}>
                        <TableCell>
                          <div className="font-medium">{account.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Last updated: {new Date(account.lastUpdated).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{account.institution}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {account.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {hideBalances ? "••••••" : formatCurrency(account.balance)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Account</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleHideAccount(account.id)}>
                                {account.isHidden ? "Unhide Account" : "Hide Account"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteAccount(account.id)}
                              >
                                Delete Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No accounts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
      
      {showAddAccountDialog && (
        <AddAccountDialog 
          isOpen={showAddAccountDialog}
          onClose={() => setShowAddAccountDialog(false)}
          onAddAccount={handleAddAccount}
          accountType={selectedSection === "all-accounts" ? "Account" : selectedSection}
          sectionType={selectedSection === "all-accounts" ? "General" : selectedSection}
        />
      )}
      
      {showPlaidLinkDialog && (
        <PlaidLinkDialog
          isOpen={showPlaidLinkDialog}
          onClose={() => setShowPlaidLinkDialog(false)}
          onSuccess={handlePlaidLinkSuccess}
        />
      )}
      
      {showAccountTypeSelector && (
        <AccountLinkTypeSelector
          isOpen={showAccountTypeSelector}
          onClose={() => setShowAccountTypeSelector(false)}
          onSelectPlaid={() => handleAccountTypeSelected("plaid")}
          onSelectManual={() => handleAccountTypeSelected("manual")}
        />
      )}
      
      {showAddPropertyDialog && (
        <RealEstateTracker.AddPropertyDialog
          isOpen={showAddPropertyDialog}
          onClose={() => setShowAddPropertyDialog(false)}
          onAddProperty={handleAddProperty}
        />
      )}
    </ThreeColumnLayout>
  );
};

export default Accounts;
