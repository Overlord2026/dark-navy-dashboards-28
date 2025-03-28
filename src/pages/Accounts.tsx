
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
} from "lucide-react";
import { AddAccountDialog, AccountData } from "@/components/accounts/AddAccountDialog";
import { AccountLinkTypeSelector } from "@/components/accounts/AccountLinkTypeSelector";
import { PlaidLinkDialog } from "@/components/accounts/PlaidLinkDialog";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

type AccountSection = {
  id: string;
  title: string;
  icon: React.ReactNode;
  balance?: string;
  status?: string;
  isExpanded: boolean;
  accounts: AccountData[];
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

  const [accountSections, setAccountSections] = useState<AccountSection[]>([
    {
      id: "bfo-managed",
      title: "BFO Managed",
      icon: <Landmark className="h-5 w-5 text-blue-400" />,
      status: "Unable to retrieve balance",
      isExpanded: true,
      accounts: [],
    },
    {
      id: "external-investment",
      title: "External Investment",
      icon: <TrendingUp className="h-5 w-5 text-green-400" />,
      balance: "$0.00",
      isExpanded: false,
      accounts: [],
    },
    {
      id: "external-manually-tracked",
      title: "External Manually-Tracked",
      icon: <ClipboardList className="h-5 w-5 text-amber-400" />,
      balance: "$0.00",
      isExpanded: false,
      accounts: [],
    },
    {
      id: "external-loans",
      title: "External Loans",
      icon: <DollarSign className="h-5 w-5 text-indigo-400" />,
      balance: "$0.00",
      isExpanded: false,
      accounts: [],
    },
    {
      id: "external-banking",
      title: "External Banking",
      icon: <Building className="h-5 w-5 text-red-400" />,
      balance: "$0.00",
      isExpanded: false,
      accounts: [],
    },
    {
      id: "external-credit-cards",
      title: "External Credit Cards",
      icon: <CreditCard className="h-5 w-5 text-cyan-400" />,
      balance: "$0.00",
      isExpanded: false,
      accounts: [],
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
              balance: "$1,250.00",
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
                    (sum, account) => sum + parseFloat(account.balance || "0"),
                    parseFloat(accountData.balance || "0")
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
                    (sum, account) => sum + parseFloat(account.balance || "0"),
                    parseFloat(accountData.balance || "0")
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

            <div className="space-y-4">
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
                      {section.accounts.length > 0 ? (
                        <div className="space-y-3">
                          {section.accounts.map((account) => (
                            <div 
                              key={account.id}
                              className={`p-3 rounded-lg ${
                                isLightTheme 
                                  ? "bg-[#E9E7D8] border border-[#DCD8C0]" 
                                  : "bg-[#1c2e4a] border border-gray-700"
                              } flex justify-between items-center`}
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
                        </div>
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
              ))}
            </div>
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
