import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Landmark, 
  CreditCard,
  Building,
  TrendingUp,
  ClipboardList,
  DollarSign,
  Home,
  Filter,
  PieChart,
  Download,
  ArrowUpDown,
  RefreshCcw
} from "lucide-react";
import { AddAccountDialog, AccountData } from "@/components/accounts/AddAccountDialog";
import { AccountLinkTypeSelector } from "@/components/accounts/AccountLinkTypeSelector";
import { PlaidLinkDialog } from "@/components/accounts/PlaidLinkDialog";
import { RealEstateTracker } from "@/components/accounts/RealEstateTracker";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

type AccountSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  balance?: string;
  status?: string;
  isExpanded: boolean;
  accounts: AccountData[];
  component?: React.ReactNode;
};

type AppView = "main" | "selection" | "plaid";

const Accounts = () => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  
  const [currentView, setCurrentView] = useState<AppView>("main");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [plaidDialogOpen, setPlaidDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<AccountSection | null>(null);
  const [mainDialogOpen, setMainDialogOpen] = useState(false);
  const [showRealEstate, setShowRealEstate] = useState(true);
  const [showNetWorth, setShowNetWorth] = useState(true);
  const [activeAccountType, setActiveAccountType] = useState<string | null>(null);
  const [accountDetailView, setAccountDetailView] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [accountHistory, setAccountHistory] = useState<any[]>([
    { date: '2023-01-01', balance: 15000 },
    { date: '2023-02-01', balance: 16200 },
    { date: '2023-03-01', balance: 17500 },
    { date: '2023-04-01', balance: 16800 },
    { date: '2023-05-01', balance: 18200 },
    { date: '2023-06-01', balance: 19500 },
    { date: '2023-07-01', balance: 20300 },
    { date: '2023-08-01', balance: 21600 },
    { date: '2023-09-01', balance: 22800 },
    { date: '2023-10-01', balance: 24000 },
  ]);

  const [accountSections, setAccountSections] = useState<AccountSection[]>([
    {
      id: "bfo-managed",
      title: "BFO Managed",
      icon: <Landmark className="h-5 w-5 text-blue-400" />,
      status: "Connected",
      isExpanded: true,
      accounts: [
        {
          id: "bfo-1",
          name: "Core Investment Account",
          accountNumber: "BFO-7459-XXX",
          balance: "485,750.00",
          type: "Investment",
          section: "BFO Managed"
        },
        {
          id: "bfo-2",
          name: "Tax Advantaged Portfolio",
          accountNumber: "BFO-8912-XXX",
          balance: "237,250.00",
          type: "Investment",
          section: "BFO Managed"
        }
      ],
    },
    {
      id: "external-investment",
      title: "External Investment",
      icon: <TrendingUp className="h-5 w-5 text-green-400" />,
      balance: "$310,450.00",
      isExpanded: false,
      accounts: [
        {
          id: "ext-inv-1",
          name: "Vanguard 401(k)",
          accountNumber: "VG-4532-XXX",
          balance: "186,250.00",
          type: "Retirement",
          section: "External Investment"
        },
        {
          id: "ext-inv-2",
          name: "Fidelity Roth IRA",
          accountNumber: "FID-9823-XXX",
          balance: "124,200.00",
          type: "Retirement",
          section: "External Investment"
        }
      ],
    },
    {
      id: "real-estate",
      title: "Real Estate",
      icon: <Home className="h-5 w-5 text-amber-400" />,
      balance: "$3,145,000.00",
      isExpanded: true,
      accounts: [],
      component: <RealEstateTracker />
    },
    {
      id: "external-manually-tracked",
      title: "External Manually-Tracked",
      icon: <ClipboardList className="h-5 w-5 text-amber-400" />,
      balance: "$85,700.00",
      isExpanded: false,
      accounts: [
        {
          id: "man-1",
          name: "Private Equity Fund",
          accountNumber: "PE-7790-XXX",
          balance: "75,000.00",
          type: "Alternative Investment",
          section: "External Manually-Tracked"
        },
        {
          id: "man-2",
          name: "Art Collection",
          accountNumber: "ASSET-ART-1",
          balance: "10,700.00",
          type: "Collectible",
          section: "External Manually-Tracked"
        }
      ],
    },
    {
      id: "external-loans",
      title: "External Loans",
      icon: <DollarSign className="h-5 w-5 text-indigo-400" />,
      balance: "$735,000.00",
      isExpanded: false,
      accounts: [
        {
          id: "loan-1",
          name: "Primary Mortgage",
          accountNumber: "MTG-5643-XXX",
          balance: "685,000.00",
          type: "Mortgage",
          section: "External Loans"
        },
        {
          id: "loan-2",
          name: "Auto Loan",
          accountNumber: "AUTO-3328-XXX",
          balance: "50,000.00",
          type: "Auto Loan",
          section: "External Loans"
        }
      ],
    },
    {
      id: "external-banking",
      title: "External Banking",
      icon: <Building className="h-5 w-5 text-red-400" />,
      balance: "$68,250.00",
      isExpanded: false,
      accounts: [
        {
          id: "bank-1",
          name: "Chase Checking",
          accountNumber: "CH-8867-XXX",
          balance: "18,250.00",
          type: "Checking",
          section: "External Banking"
        },
        {
          id: "bank-2",
          name: "Chase Savings",
          accountNumber: "CH-9954-XXX",
          balance: "50,000.00",
          type: "Savings",
          section: "External Banking"
        }
      ],
    },
    {
      id: "external-credit-cards",
      title: "External Credit Cards",
      icon: <CreditCard className="h-5 w-5 text-cyan-400" />,
      balance: "$12,450.00",
      isExpanded: false,
      accounts: [
        {
          id: "cc-1",
          name: "Chase Sapphire Reserve",
          accountNumber: "CSR-5678-XXX",
          balance: "8,250.00",
          type: "Credit Card",
          section: "External Credit Cards"
        },
        {
          id: "cc-2",
          name: "American Express Platinum",
          accountNumber: "AMEX-9012-XXX",
          balance: "4,200.00",
          type: "Credit Card",
          section: "External Credit Cards"
        }
      ],
    },
  ]);

  const toggleSection = (id: string) => {
    setAccountSections(
      accountSections.map((section) =>
        section.id === id
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  const openAddDialog = (section: AccountSection) => {
    setSelectedSection(section);
    setDialogOpen(true);
  };

  const openMainAddDialog = () => {
    setCurrentView("selection");
  };

  const handleBackToMain = () => {
    setCurrentView("main");
  };

  const handlePlaidLinkSuccess = (linkToken: string) => {
    console.log("Plaid Link Token:", linkToken);
    
    const newAccount: AccountData = {
      id: `plaid-${Date.now()}`,
      name: "Plaid Demo Account",
      accountNumber: "PLAID-XXX-" + Math.floor(1000 + Math.random() * 9000),
      balance: "1,250.00",
      type: "External Banking",
      section: "External Banking"
    };

    setAccountSections(
      accountSections.map((section) =>
        section.id === "external-banking"
          ? {
              ...section,
              accounts: [...section.accounts, newAccount],
              balance: "$69,500.00",
              isExpanded: true,
            }
          : section
      )
    );

    toast({
      title: "Account linked",
      description: "Your bank account has been successfully linked via Plaid",
    });

    setCurrentView("main");
  };

  const handleAddAccount = (accountData: AccountData) => {
    if (!selectedSection) return;

    setAccountSections(
      accountSections.map((section) =>
        section.id === selectedSection.id
          ? {
              ...section,
              accounts: [...section.accounts, accountData],
              balance: section.id !== "bfo-managed"
                ? `$${section.accounts.reduce(
                    (sum, account) => sum + parseFloat(account.balance.replace(/,/g, "") || "0"),
                    parseFloat(accountData.balance.replace(/,/g, "") || "0")
                  ).toFixed(2)}`
                : undefined,
              status: section.id === "bfo-managed" ? "Connected" : undefined,
            }
          : section
      )
    );

    toast({
      title: "Account added",
      description: `${accountData.name} has been added to ${selectedSection.title}`,
    });
  };

  const handleMainAddAccount = (accountData: AccountData) => {
    const matchingSection = accountSections.find(
      (section) => section.title.toLowerCase().includes(accountData.section.toLowerCase())
    );

    if (!matchingSection) {
      toast({
        title: "Error",
        description: "Could not find a matching section for this account type",
        variant: "destructive",
      });
      return;
    }

    setAccountSections(
      accountSections.map((section) =>
        section.id === matchingSection.id
          ? {
              ...section,
              accounts: [...section.accounts, accountData],
              balance: section.id !== "bfo-managed"
                ? `$${section.accounts.reduce(
                    (sum, account) => sum + parseFloat(account.balance.replace(/,/g, "") || "0"),
                    parseFloat(accountData.balance.replace(/,/g, "") || "0")
                  ).toFixed(2)}`
                : undefined,
              status: section.id === "bfo-managed" ? "Connected" : undefined,
            }
          : section
      )
    );

    toast({
      title: "Account added",
      description: `${accountData.name} has been added to ${matchingSection.title}`,
    });
  };

  const handleSelectPlaid = () => {
    setPlaidDialogOpen(true);
  };

  const handleSelectManual = () => {
    setMainDialogOpen(true);
  };

  const handleAccountClick = (account: AccountData) => {
    setSelectedAccount(account);
    setAccountDetailView(true);
  };

  const handleBackToAccounts = () => {
    setAccountDetailView(false);
    setSelectedAccount(null);
  };

  const filterAccountsByType = (type: string) => {
    const allAccounts: AccountData[] = [];
    
    accountSections.forEach(section => {
      section.accounts.forEach(account => {
        if (account.type.toLowerCase() === type.toLowerCase()) {
          allAccounts.push(account);
        }
      });
    });
    
    return allAccounts;
  };
  
  const checkingAccounts = filterAccountsByType("checking");
  const savingsAccounts = filterAccountsByType("savings");
  const investmentAccounts = filterAccountsByType("investment");
  const retirementAccounts = filterAccountsByType("retirement");

  const calculateTotal = (accounts: AccountData[]) => {
    return accounts.reduce((total, account) => {
      const balance = parseFloat(account.balance.replace(/,/g, "")) || 0;
      return total + balance;
    }, 0);
  };
  
  const checkingTotal = calculateTotal(checkingAccounts);
  const savingsTotal = calculateTotal(savingsAccounts);
  const investmentTotal = calculateTotal(investmentAccounts);
  const retirementTotal = calculateTotal(retirementAccounts);

  const generateTransactions = (account: AccountData) => {
    const today = new Date();
    const transactions = [];
    const types = {
      "Checking": ["Grocery Store", "ATM Withdrawal", "Online Payment", "Direct Deposit", "Restaurant", "Utility Bill"],
      "Savings": ["Transfer from Checking", "Interest Payment", "Withdrawal", "Deposit", "Automatic Savings"],
      "Investment": ["Stock Purchase", "Dividend Payment", "ETF Purchase", "Fund Management Fee", "Stock Sale"],
      "Retirement": ["401(k) Contribution", "IRA Deposit", "Fund Rebalancing", "Dividend Reinvestment", "Admin Fee"]
    };
    
    const transactionTypes = types[account.type as keyof typeof types] || types["Checking"];
    
    const count = Math.floor(Math.random() * 6) + 5;
    
    for (let i = 0; i < count; i++) {
      const daysAgo = i * 3 + Math.floor(Math.random() * 3);
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      
      const isDeposit = Math.random() > 0.7;
      const amount = isDeposit 
        ? Math.floor(Math.random() * 2000) + 500 
        : -(Math.floor(Math.random() * 300) + 50);
        
      const typeIndex = Math.floor(Math.random() * transactionTypes.length);
      
      transactions.push({
        date: format(date, 'yyyy-MM-dd'),
        description: transactionTypes[typeIndex],
        amount: amount,
        type: amount > 0 ? 'credit' : 'debit'
      });
    }
    
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  const renderAnalytics = (accounts: AccountData[], title: string) => {
    const total = calculateTotal(accounts);
    const pieData = accounts.map(account => ({
      name: account.name,
      value: parseFloat(account.balance.replace(/,/g, "")) || 0
    }));
    
    return (
      <div className={`p-4 rounded-lg ${isLightTheme ? "bg-[#F2F0E1]" : "bg-[#1c2e4a]"} mb-4`}>
        <h3 className="text-lg font-medium mb-3">{title} Analytics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Account Breakdown</h4>
            <div className="space-y-3">
              {accounts.map((account, index) => {
                const percent = Math.round(
                  (parseFloat(account.balance.replace(/,/g, "")) / total) * 100
                );
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{account.name}</span>
                      <span>${account.balance} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 rounded-full">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Growth Over Time</h4>
            <div className="h-40 flex items-end gap-1">
              {accountHistory.map((item, index) => {
                const heightPercent = (item.balance / 24000) * 100;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                    <span className="text-xs mt-1">
                      {format(new Date(item.date), 'MMM')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Performance Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className={`p-3 rounded-lg ${isLightTheme ? "bg-[#E9E7D8]" : "bg-[#121a2c]"}`}>
              <p className="text-sm text-gray-400">Month-over-Month</p>
              <p className="text-lg font-semibold text-green-400">+5.3%</p>
            </div>
            <div className={`p-3 rounded-lg ${isLightTheme ? "bg-[#E9E7D8]" : "bg-[#121a2c]"}`}>
              <p className="text-sm text-gray-400">Quarter-over-Quarter</p>
              <p className="text-lg font-semibold text-green-400">+12.7%</p>
            </div>
            <div className={`p-3 rounded-lg ${isLightTheme ? "bg-[#E9E7D8]" : "bg-[#121a2c]"}`}>
              <p className="text-sm text-gray-400">Year-to-Date</p>
              <p className="text-lg font-semibold text-green-400">+33.2%</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInteractiveAccountTypeDetails = (accounts: AccountData[], title: string) => {
    if (accounts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <p className={`text-center mb-4 ${isLightTheme ? "text-[#666666]" : "text-gray-400"}`}>
            No {title.toLowerCase()} accounts found
          </p>
          <Button 
            onClick={openMainAddDialog}
            className={isLightTheme ? "bg-[#E9E7D8] text-[#222222] hover:bg-[#DCD8C0]" : "bg-white text-black hover:bg-slate-100"}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add {title} Account
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{title} Accounts</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className={`${
                isLightTheme 
                  ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                  : "border-gray-700 text-white hover:bg-[#1c2e4a]"
              }`}
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <PieChart className="h-4 w-4 mr-2" />
              {showAnalytics ? "Hide Analytics" : "Show Analytics"}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className={`${
                isLightTheme 
                  ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                  : "border-gray-700 text-white hover:bg-[#1c2e4a]"
              }`}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className={`${
                isLightTheme 
                  ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                  : "border-gray-700 text-white hover:bg-[#1c2e4a]"
              }`}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        {showAnalytics && renderAnalytics(accounts, title)}
        
        <div className={`p-4 rounded-lg ${isLightTheme ? "bg-[#F2F0E1]" : "bg-[#1c2e4a]"}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{title} Summary</h3>
            <p className="font-bold">${calculateTotal(accounts).toLocaleString()}</p>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className={isLightTheme ? "bg-[#E9E7D8]" : "bg-[#121a2c]"}>
                <TableHead>Account Name</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>
                  <div className="flex items-center justify-end">
                    <span className="sr-only">Sort</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow 
                  key={account.id}
                  className={`cursor-pointer ${isLightTheme ? "hover:bg-[#E9E7D8]" : "hover:bg-[#2A2A40]"}`}
                  onClick={() => handleAccountClick(account)}
                >
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{account.accountNumber}</TableCell>
                  <TableCell className="text-right">${account.balance}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAccountClick(account);
                      }}
                    >
                      <ChevronDown className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            onClick={openMainAddDialog}
            variant="outline" 
            className={`${
              isLightTheme 
                ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                : "border-gray-700 text-white hover:bg-[#1c2e4a]"
            }`}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add {title} Account
          </Button>
          
          {title === "Investment" && (
            <Button
              className={isLightTheme ? "bg-[#E9E7D8] text-[#222222] hover:bg-[#DCD8C0]" : "bg-white text-black hover:bg-slate-100"}
              onClick={() => {
                toast({
                  title: "Portfolio Analysis",
                  description: "Launching detailed portfolio analysis view"
                });
              }}
            >
              Portfolio Analysis
            </Button>
          )}
          
          {title === "Retirement" && (
            <Button
              className={isLightTheme ? "bg-[#E9E7D8] text-[#222222] hover:bg-[#DCD8C0]" : "bg-white text-black hover:bg-slate-100"}
              onClick={() => {
                toast({
                  title: "Retirement Calculator",
                  description: "Launching retirement planning calculator"
                });
              }}
            >
              Retirement Calculator
            </Button>
          )}
        </div>
        
        {title === "Checking" && (
          <Card className={`mt-4 ${isLightTheme ? "bg-[#F2F0E1]" : "bg-[#121a2c]"}`}>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  className={`${
                    isLightTheme 
                      ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                      : "border-gray-700 text-white hover:bg-[#1c2e4a]"
                  }`}
                  onClick={() => {
                    toast({
                      title: "Transfer Initiated",
                      description: "Redirecting to transfer page"
                    });
                  }}
                >
                  Transfer Money
                </Button>
                <Button
                  variant="outline"
                  className={`${
                    isLightTheme 
                      ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                      : "border-gray-700 text-white hover:bg-[#1c2e4a]"
                  }`}
                  onClick={() => {
                    toast({
                      title: "Bill Pay",
                      description: "Redirecting to bill payment page"
                    });
                  }}
                >
                  Pay Bills
                </Button>
                <Button
                  variant="outline"
                  className={`${
                    isLightTheme 
                      ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                      : "border-gray-700 text-white hover:bg-[#1c2e4a]"
                  }`}
                  onClick={() => {
                    toast({
                      title: "Statements",
                      description: "Fetching your recent statements"
                    });
                  }}
                >
                  View Statements
                </Button>
                <Button
                  variant="outline"
                  className={`${
                    isLightTheme 
                      ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                      : "border-gray-700 text-white hover:bg-[#1c2e4a]"
                  }`}
                  onClick={() => {
                    toast({
                      title: "Budget Analysis",
                      description: "Analyzing your spending patterns"
                    });
                  }}
                >
                  Budget Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {title === "Savings" && (
          <Card className={`mt-4 ${isLightTheme ? "bg-[#F2F0E1]" : "bg-[#121a2c]"}`}>
            <CardHeader>
              <CardTitle className="text-base">Savings Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Emergency Fund</span>
                    <span>$8,500 / $15,000</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: '57%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Vacation</span>
                    <span>$3,200 / $5,000</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: '64%' }}
                    ></div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className={`${
                    isLightTheme 
                      ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                      : "border-gray-700 text-white hover:bg-[#1c2e4a]"
                  }`}
                  onClick={() => {
                    toast({
                      title: "Savings Goals",
                      description: "Opening savings goal management"
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderEnhancedAccountDetails = () => {
    if (!selectedAccount) return null;
    
    const transactions = selectedAccount.transactions || [];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBackToAccounts}
            className={`${
              isLightTheme 
                ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                : "border-gray-700 text-white hover:bg-[#1c2e4a]"
            }`}
          >
            Back to Accounts
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className={`${
                isLightTheme 
                  ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                  : "border-gray-700 text-white hover:bg-[#1c2e4a]"
              }`}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            
            <Button
              variant="outline"
              className={`${
                isLightTheme 
                  ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                  : "border-gray-700 text-white hover:bg-[#1c2e4a]"
              }`}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className={`p-6 rounded-lg ${isLightTheme ? "bg-[#F2F0E1] border border-[#DCD8C0]" : "bg-[#121a2c] border border-gray-800"}`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">{selectedAccount.name}</h2>
              <p className={`${isLightTheme ? "text-[#666666]" : "text-gray-400"}`}>
                Account: {selectedAccount.accountNumber}
              </p>
              <p className={`${isLightTheme ? "text-[#666666]" : "text-gray-400"}`}>
                Type: {selectedAccount.type}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${selectedAccount.balance}</p>
              <p className={`${isLightTheme ? "text-[#666666]" : "text-gray-400"}`}>
                Current Balance
              </p>
              
              {selectedAccount.type === "Checking" && (
                <p className={`text-xs ${isLightTheme ? "text-[#666666]" : "text-gray-400"} mt-1`}>
                  Available: ${parseFloat(selectedAccount.balance.replace(/,/g, "")) - 500}
                </p>
              )}
              
              {selectedAccount.type === "Investment" && (
                <div className="mt-1">
                  <p className="text-xs text-green-500">+2.3% today</p>
                  <p className="text-xs text-green-500">+8.7% YTD</p>
                </div>
              )}
            </div>
          </div>
          
          {selectedAccount.type === "Investment" && (
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className={`p-3 rounded-lg ${isLightTheme ? "bg-[#E9E7D8]" : "bg-[#1c2e4a]"}`}>
                <p className="text-sm text-gray-400">Cash Balance</p>
                <p className="text-lg font-semibold">$4,250.00</p>
              </div>
              <div className={`p-3 rounded-lg ${isLightTheme ? "bg-[#E9E7D8]" : "bg-[#1c2e4a]"}`}>
                <p className="text-sm text-gray-400">Securities Value</p>
                <p className="text-lg font-semibold">${(parseFloat(selectedAccount.balance.replace(/,/g, "")) - 4250).toLocaleString()}</p>
              </div>
              <div className={`p-3 rounded-lg ${isLightTheme ? "bg-[#E9E7D8]" : "bg-[#1c2e4a]"}`}>
                <p className="text-sm text-gray-400">Buying Power</p>
                <p className="text-lg font-semibold">$4,250.00</p>
              </div>
            </div>
          )}
          
          {selectedAccount.type === "Retirement" && (
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className={`p-3 rounded-lg ${isLightTheme ? "bg-[#E9E7D8]" : "bg-[#1c2e4a]"}`}>
                <p className="text-sm text-gray-400">YTD Contributions</p>
                <p className="text-lg font-semibold">$12,500.00</p>
              </div>
              <div className={`p-3 rounded-lg ${isLightTheme ? "bg-[#E9E7D8]" : "bg-[#1c2e4a]"}`}>
                <p className="text-sm text-gray-400">Annual Limit</p>
                <p className="text-lg font-semibold">$22,500.00</p>
              </div>
              <div className={`p-3 rounded-lg ${isLightTheme ? "bg-[#E9E7D8]" : "bg-[#1c2e4a]"}`}>
                <p className="text-sm text-gray-400">Remaining</p>
                <p className="text-lg font-semibold">$10,000.00</p>
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
            <Table>
              <TableHeader>
                <TableRow className={isLightTheme ? "bg-[#E9E7D8]" : "bg-[#1c2e4a]"}>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell 
                      className={`text-right ${
                        transaction.type === 'credit' 
                          ? 'text-green-500' 
                          : isLightTheme ? 'text-red-500' : 'text-red-400'
                      }`}
                    >
                      {transaction.type === 'credit' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {selectedAccount.type === "Investment" && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Holdings</h3>
              <Table>
                <TableHeader>
                  <TableRow className={isLightTheme ? "bg-[#E9E7D8]" : "bg-[#1c2e4a]"}>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>VTI</TableCell>
                    <TableCell>Vanguard Total Stock Market ETF</TableCell>
                    <TableCell>152</TableCell>
                    <TableCell>$245.68</TableCell>
                    <TableCell className="text-right">$37,343.36</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>VXUS</TableCell>
                    <TableCell>Vanguard Total International Stock ETF</TableCell>
                    <TableCell>320</TableCell>
                    <TableCell>$58.92</TableCell>
                    <TableCell className="text-right">$18,854.40</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>BND</TableCell>
                    <TableCell>Vanguard Total Bond Market ETF</TableCell>
                    <TableCell>275</TableCell>
                    <TableCell>$72.15</TableCell>
                    <TableCell className="text-right">$19,841.25</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>AAPL</TableCell>
                    <TableCell>Apple Inc.</TableCell>
                    <TableCell>45</TableCell>
                    <TableCell>$175.24</TableCell>
                    <TableCell className="text-right">$7,885.80</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
          
          {selectedAccount.type === "Retirement" && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Asset Allocation</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Current Allocation</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stocks</span>
                        <span>70%</span>
                      </div>
                      <div className="w-full bg-gray-700 h-2 rounded-full">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Bonds</span>
                        <span>25%</span>
                      </div>
                      <div className="w-full bg-gray-700 h-2 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cash</span>
                        <span>5%</span>
                      </div>
                      <div className="w-full bg-gray-700 h-2 rounded-full">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Target Allocation</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stocks</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-gray-700 h-2 rounded-full">
                        <div className="bg-blue-800 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Bonds</span>
                        <span>30%</span>
                      </div>
                      <div className="w-full bg-gray-700 h-2 rounded-full">
                        <div className="bg-green-800 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cash</span>
                        <span>5%</span>
                      </div>
                      <div className="w-full bg-gray-700 h-2 rounded-full">
                        <div className="bg-amber-800 h-2 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Performance</h4>
                  <div className="space-y-2">
                    <div className={`p-2 rounded-lg ${isLightTheme ? "bg-[#E9E7D8]" : "bg-[#1c2e4a]"}`}>
                      <p className="text-xs text-gray-400">1 Year</p>
                      <p className="text-sm font-semibold text-green-500">+8.2%</p>
                    </div>
                    <div className={`p-2 rounded-lg ${isLightTheme ? "bg-[#E9E7D8]" : "bg-[#1c2e4a]"}`}>
                      <p className="text-xs text-gray-400">3 Year</p>
                      <p className="text-sm font-semibold text-green-500">+24.5%</p>
                    </div>
                    <div className={`p-2 rounded-lg ${isLightTheme ? "bg-[#E9E7D8]" : "bg-[#1c2e4a]"}`}>
                      <p className="text-xs text-gray-400">5 Year</p>
                      <p className="text-sm font-semibold text-green-500">+42.8%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(selectedAccount.type === "Checking" || selectedAccount.type === "Savings") && (
            <Card className={isLightTheme ? "bg-[#F2F0E1]" : "bg-[#121a2c]"}>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className={`${
                      isLightTheme 
                        ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                        : "border-gray-700 text-white hover:bg-[#1c2e4a]"
                    }`}
                    onClick={() => {
                      toast({
                        title: "Transfer Initiated",
                        description: "Redirecting to transfer page"
                      });
                    }}
                  >
                    Transfer Money
                  </Button>
                  <Button
                    variant="outline"
                    className={`${
                      isLightTheme 
                        ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                        : "border-gray-700 text-white hover:bg-[#1c2e4a]"
                    }`}
                    onClick={() => {
                      toast({
                        title: "Statements",
                        description: "Fetching your recent statements"
                      });
                    }}
                  >
                    View Statements
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {(selectedAccount.type === "Investment" || selectedAccount.type === "Retirement") && (
            <Card className={isLightTheme ? "bg-[#F2F0E1]" : "bg-[#121a2c]"}>
              <CardHeader>
                <CardTitle className="text-base">Investment Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className={`${
                      isLightTheme 
                        ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                        : "border-gray-700 text-white hover:bg-[#1c2e4a]"
                    }`}
                    onClick={() => {
                      toast({
                        title: "Trade",
                        description: "Opening trade interface"
                      });
                    }}
                  >
                    Trade
                  </Button>
                  <Button
                    variant="outline"
                    className={`${
                      isLightTheme 
                        ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                        : "border-gray-700 text-white hover:bg-[#1c2e4a]"
                    }`}
                    onClick={() => {
                      toast({
                        title: "Rebalance",
                        description: "Opening rebalance interface"
                      });
                    }}
                  >
                    Rebalance
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card className={isLightTheme ? "bg-[#F2F0E1]" : "bg-[#121a2c]"}>
            <CardHeader>
              <CardTitle className="text-base">Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className={`${
                    isLightTheme 
                      ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                      : "border-gray-700 text-white hover:bg-[#1c2e4a]"
                  }`}
                  onClick={() => {
                    toast({
                      title: "Edit Account",
                      description: "Opening account settings"
                    });
                  }}
                >
                  Edit Account
                </Button>
                <Button
                  variant="outline"
                  className={`${
                    isLightTheme 
                      ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8]" 
                      : "border-gray-700 text-white hover:bg-[#1c2e4a]"
                  }`}
                  onClick={() => {
                    toast({
                      title: "Alerts Setup",
                      description: "Opening alerts configuration"
                    });
                  }}
                >
                  Setup Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <ThreeColumnLayout activeMainItem="accounts" title="Accounts">
      <div className="mx-auto max-w-6xl animate-fade-in">
        {currentView === "main" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold mb-1">Accounts</h1>
              <Button 
                className={isLightTheme ? "bg-[#E9E7D8] text-[#222222] hover:bg-[#DCD8C0]" : "bg-white text-black hover:bg-slate-100"}
                onClick={openMainAddDialog}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </div>

            {showNetWorth && (
              <div className="mb-6">
                <NetWorthSummary />
              </div>
            )}

            {!accountDetailView ? (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Accounts</TabsTrigger>
                  <TabsTrigger value="checking">Checking ({checkingAccounts.length})</TabsTrigger>
                  <TabsTrigger value="savings">Savings ({savingsAccounts.length})</TabsTrigger>
                  <TabsTrigger value="investment">Investment ({investmentAccounts.length})</TabsTrigger>
                  <TabsTrigger value="retirement">Retirement ({retirementAccounts.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-4">
                  {accountSections.map((section) => (
                    <div
                      key={section.id}
                      className={`rounded-lg ${
                        isLightTheme 
                          ? "bg-[#F2F0E1] border border-[#DCD8C0]" 
                          : "bg-[#121a2c] border border-gray-800"
                      } overflow-hidden`}
                    >
                      <div
                        className="p-4 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleSection(section.id)}
                      >
                        <div className="flex items-center space-x-3">
                          {section.icon}
                          <span className={`font-medium ${isLightTheme ? "text-[#222222]" : "text-white"}`}>
                            {section.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          {section.balance ? (
                            <span className={isLightTheme ? "text-[#222222]" : "text-white"}>
                              {section.balance}
                            </span>
                          ) : (
                            <span className={isLightTheme ? "text-[#666666]" : "text-gray-400"}>
                              {section.status}
                            </span>
                          )}
                          {section.isExpanded ? (
                            <ChevronUp className={`h-5 w-5 ${isLightTheme ? "text-[#666666]" : "text-gray-400"}`} />
                          ) : (
                            <ChevronDown className={`h-5 w-5 ${isLightTheme ? "text-[#666666]" : "text-gray-400"}`} />
                          )}
                        </div>
                      </div>

                      {section.isExpanded && (
                        <div className={`p-6 border-t ${isLightTheme ? "border-[#DCD8C0]" : "border-gray-800"}`}>
                          {section.component ? (
                            section.component
                          ) : (
                            <div className="space-y-3">
                              {section.accounts.length > 0 ? (
                                <>
                                  {section.accounts.map((account) => (
                                    <div 
                                      key={account.id}
                                      className={`p-3 rounded-lg ${
                                        isLightTheme 
                                          ? "bg-[#E9E7D8] border border-[#DCD8C0]" 
                                          : "bg-[#1c2e4a] border border-gray-700"
                                      } flex justify-between items-center cursor-pointer`}
                                      onClick={() => handleAccountClick(account)}
                                    >
                                      <div>
                                        <p className={`font-medium ${isLightTheme ? "text-[#222222]" : "text-white"}`}>
                                          {account.name}
                                        </p>
                                        {account.accountNumber && (
                                          <p className={`text-sm ${isLightTheme ? "text-[#666666]" : "text-gray-400"}`}>
                                            Account: {account.accountNumber}
                                          </p>
                                        )}
                                      </div>
                                      {account.balance && (
                                        <div className="text-right">
                                          <p className={`font-medium ${isLightTheme ? "text-[#222222]" : "text-white"}`}>
                                            ${account.balance}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  
                                  <Button 
                                    variant="outline" 
                                    className={`mt-3 ${
                                      isLightTheme 
                                        ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8] hover:text-[#222222]" 
                                        : "border-gray-700 text-white hover:bg-[#1c2e4a] hover:text-white"
                                    }`}
                                    onClick={() => openAddDialog(section)}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add {section.title.replace("External ", "").replace("BFO ", "")}
                                  </Button>
                                </>
                              ) : (
                                <div className="flex flex-col items-center justify-center py-8">
                                  <p className={`mb-4 ${isLightTheme ? "text-[#666666]" : "text-gray-400"}`}>
                                    No accounts added yet
                                  </p>
                                  <Button 
                                    variant="outline" 
                                    className={`${
                                      isLightTheme 
                                        ? "border-[#DCD8C0] text-[#222222] hover:bg-[#E9E7D8] hover:text-[#222222]" 
                                        : "border-gray-700 text-white hover:bg-[#1c2e4a] hover:text-white"
                                    }`}
                                    onClick={() => openAddDialog(section)}
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add {section.title.replace("External ", "").replace("BFO ", "")}
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="checking">
                  {renderInteractiveAccountTypeDetails(checkingAccounts, "Checking")}
                </TabsContent>
                
                <TabsContent value="savings">
                  {renderInteractiveAccountTypeDetails(savingsAccounts, "Savings")}
                </TabsContent>
                
                <TabsContent value="investment">
                  {renderInteractiveAccountTypeDetails(investmentAccounts, "Investment")}
                </TabsContent>
                
                <TabsContent value="retirement">
                  {renderInteractiveAccountTypeDetails(retirementAccounts, "Retirement")}
                </TabsContent>
              </Tabs>
            ) : (
              renderEnhancedAccountDetails()
            )}
          </>
        )}

        {currentView === "selection" && (
          <AccountLinkTypeSelector 
            onSelectPlaid={handleSelectPlaid}
            onSelectManual={handleSelectManual}
            onBack={handleBackToMain}
          />
        )}

        {selectedSection && (
          <AddAccountDialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onAddAccount={handleAddAccount}
            accountType={selectedSection.title.replace("External ", "").replace("BFO ", "")}
            sectionType={selectedSection.title}
          />
        )}

        <AddAccountDialog
          isOpen={mainDialogOpen}
          onClose={() => setMainDialogOpen(false)}
          onAddAccount={handleMainAddAccount}
          accountType="Account"
          sectionType="Main"
        />

        <PlaidLinkDialog
          isOpen={plaidDialogOpen}
          onClose={() => setPlaidDialogOpen(false)}
          onSuccess={handlePlaidLinkSuccess}
        />
      </div>
    </ThreeColumnLayout>
  );
};

export default Accounts;
