import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Shield, TrendingUp, CreditCard, Building, Banknote, Wallet, Coins, AlertTriangle, Package, Briefcase, Home, PiggyBank } from "lucide-react";
import { RetirementAccountTracker } from "@/components/social-security/RetirementAccountTracker";
import { CollapsibleCard } from "@/components/accounts/CollapsibleCard";
import { useAccountManagement } from "@/hooks/useAccountManagement";
import { useDigitalAssets } from "@/hooks/useDigitalAssets";
import { useLiabilities } from "@/context/LiabilitiesContext";
import { useSupabaseAssets } from "@/hooks/useSupabaseAssets";
import { useResponsive } from "@/hooks/use-responsive";
import { cn } from "@/lib/utils";
import { AddAccountTypeDialog } from "@/components/accounts/AddAccountTypeDialog";
import { AccountLinkTypeSelector } from "@/components/accounts/AccountLinkTypeSelector";
import { AddDigitalAssetDialog } from "@/components/accounts/AddDigitalAssetDialog";
import { DigitalAssetsTable } from "@/components/accounts/DigitalAssetsTable";
import { AddLiabilityDialog } from "@/components/liabilities/AddLiabilityDialog";
import { LiabilitiesList } from "@/components/liabilities/LiabilitiesList";
import { AddOtherAssetDialog } from "@/components/assets/AddOtherAssetDialog";
import { OtherAssetsList } from "@/components/assets/OtherAssetsList";
import { AddPrivateEquityDialog } from "@/components/accounts/AddPrivateEquityDialog";
import { PrivateEquityAccountsList } from "@/components/accounts/PrivateEquityAccountsList";
import { usePrivateEquityAccounts } from "@/hooks/usePrivateEquityAccounts";
import { AddPublicStockDialog } from "@/components/accounts/AddPublicStockDialog";
import { PublicStocksList } from "@/components/accounts/PublicStocksList";
import { usePublicStocks } from "@/hooks/usePublicStocks";
import { AddRealEstateDialog } from "@/components/accounts/AddRealEstateDialog";
import { RealEstateList } from "@/components/accounts/RealEstateList";
import { useRealEstate } from "@/hooks/useRealEstate";
import { useInvestmentAccounts } from "@/hooks/useInvestmentAccounts";
import { InvestmentAccountsList } from "@/components/accounts/InvestmentAccountsList";
import { AddInvestmentAccountDialog } from "@/components/accounts/AddInvestmentAccountDialog";
import { useRetirementPlans } from "@/hooks/useRetirementPlans";
import { RetirementPlansList } from "@/components/accounts/RetirementPlansList";
import { AddRetirementPlanDialog } from "@/components/accounts/AddRetirementPlanDialog";
import { AddBankAccountDialog } from "@/components/accounts/AddBankAccountDialog";
import { BankAccountsList } from "@/components/accounts/BankAccountsList";
import { EnhancedBankAccountsList } from "@/components/accounts/EnhancedBankAccountsList";
import { PlaidLinkDialog } from "@/components/accounts/PlaidLinkDialog";
import { AddCreditCardDialog } from "@/components/accounts/AddCreditCardDialog";
import { CreditCardsList } from "@/components/accounts/CreditCardsList";
import { useCreditCards } from "@/context/CreditCardsContext";
import { AccountProgress } from "@/components/accounts/AccountProgress";
import { useBankAccounts } from "@/context/BankAccountsContext";
import { NetWorthSummary } from "@/components/accounts/NetWorthSummary";

const Accounts = () => {
  const { 
    handleManageFunding, 
    handleCompleteSetup,
    handleAddAccount,
    handleAccountTypeSelected,
    handlePlaidSelected,
    handleManualSelected,
    handlePlaidSuccess,
    handleBackToAccountTypes,
    showAddAccountTypeDialog,
    showAccountTypeSelector,
    showPlaidDialog,
    showAddDigitalAssetDialog,
    showAddOtherAssetDialog,
    showAddPrivateEquityDialog,
    showAddPublicStockDialog,
    showAddRealEstateDialog,
    showAddInvestmentAccountDialog,
    showAddRetirementPlanDialog,
    showAddBankAccountDialog,
    showAddCreditCardDialog,
    setShowAddAccountTypeDialog,
    setShowAccountTypeSelector,
    setShowPlaidDialog,
    setShowAddDigitalAssetDialog,
    setShowAddOtherAssetDialog,
    setShowAddPrivateEquityDialog,
    setShowAddPublicStockDialog,
    setShowAddRealEstateDialog,
    setShowAddInvestmentAccountDialog,
    setShowAddRetirementPlanDialog,
    setShowAddBankAccountDialog,
    setShowAddCreditCardDialog
  } = useAccountManagement();
  
  const { getFormattedTotalValue, loading: digitalAssetsLoading } = useDigitalAssets();
  const { getTotalLiabilities } = useLiabilities();
  const { getFormattedTotalValue: getFormattedOtherAssetsValue, loading: otherAssetsLoading } = useSupabaseAssets();
  const { getFormattedTotalValuation, loading: privateEquityLoading } = usePrivateEquityAccounts();
  const { getFormattedTotalValue: getFormattedPublicStockValue, loading: publicStockLoading } = usePublicStocks();
  const { getFormattedTotalValue: getFormattedRealEstateValue, loading: realEstateLoading } = useRealEstate();
  const { getFormattedTotalBalance, loading: investmentAccountsLoading } = useInvestmentAccounts();
  const { getFormattedTotalBalance: getFormattedRetirementBalance, loading: retirementPlansLoading } = useRetirementPlans();
  const { getFormattedTotalBalance: getFormattedBankBalance, loading: bankAccountsLoading } = useBankAccounts();
  const { getFormattedTotalBalance: getFormattedCreditCardBalance, loading: creditCardsLoading } = useCreditCards();
  const { isMobile, isTablet, isSmallScreen, isLargeScreen } = useResponsive();

  // Add state for liability dialog
  const [showAddLiabilityDialog, setShowAddLiabilityDialog] = React.useState(false);

  // Calculate completed accounts for progress tracking
  const completedAccounts = React.useMemo(() => {
    const completed: string[] = [];
    
    // Check if each account type has any data
    if (getFormattedBankBalance() !== '$0.00') completed.push('bank');
    if (getFormattedCreditCardBalance() !== '$0.00') completed.push('credit-card');
    if (getFormattedTotalBalance() !== '$0.00') completed.push('investment');
    if (getFormattedRetirementBalance() !== '$0.00') completed.push('retirement-plan');
    if (getFormattedPublicStockValue() !== '$0.00') completed.push('public-stock');
    if (getFormattedTotalValuation() !== '$0.00') completed.push('private-equity');
    if (getFormattedTotalValue() !== '$0.00') completed.push('digital-assets');
    if (getFormattedRealEstateValue() !== '$0.00') completed.push('property');
    if (getFormattedOtherAssetsValue() !== '$0.00') completed.push('other-assets');
    if (getTotalLiabilities() > 0) completed.push('liability');
    
    return completed;
  }, [
    getFormattedBankBalance,
    getFormattedCreditCardBalance,
    getFormattedTotalBalance,
    getFormattedRetirementBalance,
    getFormattedPublicStockValue,
    getFormattedTotalValuation,
    getFormattedTotalValue,
    getFormattedRealEstateValue,
    getFormattedOtherAssetsValue,
    getTotalLiabilities
  ]);

  const handleAddAccountType = (type: string) => {
    if (type === 'liability' || type === 'Liability') {
      setShowAddAccountTypeDialog(false); // Close the account type dialog first
      setShowAddLiabilityDialog(true);
    } else {
      console.log(`Add ${type} clicked`);
    }
  };

  // Update the handleAccountTypeSelected to handle liability and other assets properly
  const handleAccountTypeSelectedWithLiability = (type: string) => {
    if (type === 'liability') {
      setShowAddAccountTypeDialog(false);
      setShowAddLiabilityDialog(true);
    } else if (type === 'other-assets') {
      setShowAddAccountTypeDialog(false);
      setShowAddOtherAssetDialog(true);
    } else if (type === 'private-equity') {
      setShowAddAccountTypeDialog(false);
      setShowAddPrivateEquityDialog(true);
    } else {
      handleAccountTypeSelected(type);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <ThreeColumnLayout
      activeMainItem="accounts"
      title="Account Overview"
    >
      <div className={cn(
        "container mx-auto max-w-7xl space-y-6",
        isSmallScreen ? "px-3 py-4" : isLargeScreen ? "px-6 py-8" : "px-4 py-6"
      )}>
        {/* Header Section */}
        <div className={cn(
          "flex gap-4 pb-6 border-b border-border",
          isMobile ? "flex-col items-start space-y-4" : 
          isTablet ? "flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0" :
          "flex-row items-center justify-between"
        )}>
          <div className="space-y-2">
            <p className={cn(
              "text-foreground font-medium",
              isMobile ? "text-base" : isTablet ? "text-base sm:text-lg" : "text-lg"
            )}>Manage all your financial accounts in one place</p>
          </div>
          <div className={cn(
            "flex gap-3",
            isMobile ? "w-full flex-col" : 
            isTablet ? "w-full sm:w-auto flex-col sm:flex-row" :
            "flex-row"
          )}>
            <Button 
              onClick={handleAddAccount}
              className={cn(
                isMobile ? "w-full text-sm" : 
                isTablet ? "w-full sm:w-auto text-sm" :
                "text-base"
              )}
            >
              <PlusCircle className={cn(
                "mr-2", 
                isMobile ? "h-3 w-3" : 
                isTablet ? "h-4 w-4" : 
                "h-4 w-4"
              )} />
              Add Account
            </Button>
          </div>
        </div>
        
        {/* Net Worth Summary */}
        <NetWorthSummary />
        
        {/* Progress Indicator */}
        <AccountProgress 
          completedAccounts={completedAccounts} 
          totalAccounts={10} 
          className="mb-6"
        />
        
        <div className="grid gap-6">
          {/* Core Accounts Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-card border-2 border-primary rounded-lg">
              <div className="h-1 bg-primary w-12 rounded-full"></div>
              <h2 className="text-xl font-bold text-foreground">Core Accounts</h2>
              <div className="h-1 bg-primary/30 flex-1 rounded-full"></div>
            </div>
            
            {/* Banking */}
            <CollapsibleCard
              icon={<Banknote className={cn("mr-2 h-5 w-5 text-primary", isSmallScreen && "h-4 w-4")} />}
              title="Banking"
              amount={getFormattedBankBalance()}
              description="Manage your checking, savings, and other bank accounts."
            >
              <div className="space-y-4">
                <EnhancedBankAccountsList />
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => handleAccountTypeSelected('bank')} 
                    variant="outline" 
                    className={cn(
                      isSmallScreen ? "w-full text-sm" : 
                      isTablet ? "w-full md:w-auto" :
                      "w-auto"
                    )}
                  >
                    <PlusCircle className={cn(
                      "mr-2", 
                      isSmallScreen ? "h-3 w-3" : "h-4 w-4"
                    )} />
                    Add Bank Account
                  </Button>
                </div>
              </div>
            </CollapsibleCard>

            {/* Credit Cards */}
            <CollapsibleCard
              icon={<CreditCard className={cn("mr-2 h-5 w-5 text-primary", isSmallScreen && "h-4 w-4")} />}
              title="Credit Cards"
              amount={getFormattedCreditCardBalance()}
              description="Track balances, due dates, and spending."
            >
              <div className="space-y-4">
                <CreditCardsList />
                <Button 
                  onClick={() => handleAccountTypeSelected('credit-card')} 
                  variant="outline" 
                  className={cn(
                    isSmallScreen ? "w-full text-sm" : 
                    isTablet ? "w-full md:w-auto" :
                    "w-auto"
                  )}
                >
                  <PlusCircle className={cn(
                    "mr-2", 
                    isSmallScreen ? "h-3 w-3" : "h-4 w-4"
                  )} />
                  Add Credit Card
                </Button>
              </div>
            </CollapsibleCard>
          </div>

          {/* Investments Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-card border-2 border-success rounded-lg">
              <div className="h-1 bg-success w-12 rounded-full"></div>
              <h2 className="text-xl font-bold text-foreground">Investments</h2>
              <div className="h-1 bg-success/30 flex-1 rounded-full"></div>
            </div>

            {/* Investment */}
            <CollapsibleCard
              icon={<TrendingUp className={cn("mr-2 h-5 w-5 text-primary", isSmallScreen && "h-4 w-4")} />}
              title="Investment"
              amount={getFormattedTotalBalance()}
              description="Track your investment accounts and balances."
            >
              <div className="space-y-4">
                <InvestmentAccountsList />
                <Button 
                  onClick={() => handleAccountTypeSelected('investment')} 
                  variant="outline" 
                  className={cn(
                    isSmallScreen ? "w-full text-sm" : 
                    isTablet ? "w-full md:w-auto" :
                    "w-full sm:w-auto"
                  )}
                >
                  <PlusCircle className={cn(
                    "mr-2", 
                    isSmallScreen ? "h-3 w-3" : "h-4 w-4"
                  )} />
                  Add Investment Account
                </Button>
              </div>
            </CollapsibleCard>

            {/* Retirement Plans */}
            <CollapsibleCard
              icon={<PiggyBank className={cn("mr-2 h-5 w-5 text-primary", isSmallScreen && "h-4 w-4")} />}
              title="Retirement Plans"
              amount={getFormattedRetirementBalance()}
              description="Track your 401(k), 403(b), and 457(b) retirement plans."
            >
              <div className="space-y-4">
                <RetirementPlansList />
                <Button 
                  onClick={() => handleAccountTypeSelected('retirement-plan')} 
                  variant="outline" 
                  className={cn(
                    isSmallScreen ? "w-full text-sm" : 
                    isTablet ? "w-full md:w-auto" :
                    "w-full sm:w-auto"
                  )}
                >
                  <PlusCircle className={cn(
                    "mr-2", 
                    isSmallScreen ? "h-3 w-3" : "h-4 w-4"
                  )} />
                  Add Retirement Plan
                </Button>
              </div>
            </CollapsibleCard>

            {/* Public Stock */}
            <CollapsibleCard
              icon={<TrendingUp className={cn("mr-2 h-5 w-5 text-primary", isSmallScreen && "h-4 w-4")} />}
              title="Public Stock"
              amount={getFormattedPublicStockValue()}
              description="Track your individual stock holdings and equity investments."
            >
              <div className="space-y-4">
                <PublicStocksList />
                <Button 
                  onClick={() => handleAccountTypeSelected('public-stock')} 
                  variant="outline" 
                  className={cn(
                    isSmallScreen ? "w-full text-sm" : 
                    isTablet ? "w-full md:w-auto" :
                    "w-full sm:w-auto"
                  )}
                >
                  <PlusCircle className={cn(
                    "mr-2", 
                    isSmallScreen ? "h-3 w-3" : "h-4 w-4"
                  )} />
                  Add Public Stock
                </Button>
              </div>
            </CollapsibleCard>

            {/* Private Equity */}
            <CollapsibleCard
              icon={<Briefcase className={cn("mr-2 h-5 w-5 text-primary", isSmallScreen && "h-4 w-4")} />}
              title="Private Equity"
              amount={getFormattedTotalValuation()}
              description="Track your private equity investments and holdings."
            >
              <div className="space-y-4">
                <PrivateEquityAccountsList />
                <Button 
                  onClick={() => handleAccountTypeSelectedWithLiability('private-equity')} 
                  variant="outline" 
                  className={cn(
                    isSmallScreen ? "w-full text-sm" : 
                    isTablet ? "w-full md:w-auto" :
                    "w-full sm:w-auto"
                  )}
                >
                  <PlusCircle className={cn(
                    "mr-2", 
                    isSmallScreen ? "h-3 w-3" : "h-4 w-4"
                  )} />
                  Add Private Equity
                </Button>
              </div>
            </CollapsibleCard>
          </div>

          {/* Alternative Assets Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-card border-2 border-accent rounded-lg">
              <div className="h-1 bg-accent w-12 rounded-full"></div>
              <h2 className="text-xl font-bold text-foreground">Alternative Assets</h2>
              <div className="h-1 bg-accent/30 flex-1 rounded-full"></div>
            </div>

            {/* Digital Assets */}
            <CollapsibleCard
              icon={<Coins className={cn("mr-2 h-5 w-5 text-primary", isSmallScreen && "h-4 w-4")} />}
              title="Digital Assets"
              amount={getFormattedTotalValue()}
              description="Track your cryptocurrency and digital asset holdings."
            >
              <div className="space-y-4">
                <DigitalAssetsTable />
                <Button 
                  onClick={() => handleAccountTypeSelected('digital-assets')} 
                  variant="outline" 
                  className={cn(
                    isSmallScreen ? "w-full text-sm" : 
                    isTablet ? "w-full md:w-auto" :
                    "w-full sm:w-auto"
                  )}
                >
                  <PlusCircle className={cn(
                    "mr-2", 
                    isSmallScreen ? "h-3 w-3" : "h-4 w-4"
                  )} />
                  Add Digital Asset
                </Button>
              </div>
            </CollapsibleCard>

            {/* Real Estate */}
            <CollapsibleCard
              icon={<Home className={cn("mr-2 h-5 w-5 text-primary", isSmallScreen && "h-4 w-4")} />}
              title="Real Estate"
              amount={getFormattedRealEstateValue()}
              description="Track your real estate properties and their market values."
            >
              <div className="space-y-4">
                <RealEstateList />
                <Button 
                  onClick={() => handleAccountTypeSelected('real-estate')} 
                  variant="outline" 
                  className={cn(
                    isSmallScreen ? "w-full text-sm" : 
                    isTablet ? "w-full md:w-auto" :
                    "w-full sm:w-auto"
                  )}
                >
                  <PlusCircle className={cn(
                    "mr-2", 
                    isSmallScreen ? "h-3 w-3" : "h-4 w-4"
                  )} />
                  Add Real Estate
                </Button>
              </div>
            </CollapsibleCard>

            {/* Other Assets */}
            <CollapsibleCard
              icon={<Package className={cn("mr-2 h-5 w-5 text-primary", isSmallScreen && "h-4 w-4")} />}
              title="Other Assets"
              amount={getFormattedOtherAssetsValue()}
              description="Track your other valuable assets like vehicles, collectibles, and more."
            >
              <div className="space-y-4">
                <OtherAssetsList />
                <Button 
                  onClick={() => handleAccountTypeSelected('other-assets')} 
                  variant="outline" 
                  className={cn(
                    isSmallScreen ? "w-full text-sm" : 
                    isTablet ? "w-full md:w-auto" :
                    "w-full sm:w-auto"
                  )}
                >
                  <PlusCircle className={cn(
                    "mr-2", 
                    isSmallScreen ? "h-3 w-3" : "h-4 w-4"
                  )} />
                  Add Other Asset
                </Button>
              </div>
            </CollapsibleCard>
          </div>

          {/* Liabilities Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-card border-2 border-destructive rounded-lg">
              <div className="h-1 bg-destructive w-12 rounded-full"></div>
              <h2 className="text-xl font-bold text-foreground">Liabilities</h2>
              <div className="h-1 bg-destructive/30 flex-1 rounded-full"></div>
            </div>

            {/* Liability */}
            <CollapsibleCard
              icon={<AlertTriangle className={cn("mr-2 h-5 w-5 text-primary", isSmallScreen && "h-4 w-4")} />}
              title="Liability"
              amount={formatCurrency(getTotalLiabilities())}
              description="Track your debts and liabilities."
            >
              <div className="space-y-4">
                <LiabilitiesList />
                <Button 
                  onClick={() => handleAddAccountType('Liability')} 
                  variant="outline" 
                  className={cn(
                    isSmallScreen ? "w-full text-sm" : 
                    isTablet ? "w-full md:w-auto" :
                    "w-full sm:w-auto"
                  )}
                >
                  <PlusCircle className={cn(
                    "mr-2", 
                    isSmallScreen ? "h-3 w-3" : "h-4 w-4"
                  )} />
                  Add Liability
                </Button>
              </div>
            </CollapsibleCard>
          </div>
        </div>
      </div>

      {/* Add Account Type Dialog */}
      <AddAccountTypeDialog 
        open={showAddAccountTypeDialog}
        onOpenChange={setShowAddAccountTypeDialog}
        onAccountTypeSelect={handleAccountTypeSelectedWithLiability}
      />

      {/* Account Link Type Selector Dialog */}
      {showAccountTypeSelector && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={cn(
            "bg-background rounded-lg shadow-lg w-full p-6",
            isSmallScreen ? "max-w-sm mx-4" : 
            isTablet ? "max-w-md mx-4" :
            "max-w-md"
          )}>
            <AccountLinkTypeSelector
              onSelectPlaid={handlePlaidSelected}
              onSelectManual={handleManualSelected}
              onBack={handleBackToAccountTypes}
            />
          </div>
        </div>
      )}

      {/* Add Digital Asset Dialog */}
      <AddDigitalAssetDialog
        open={showAddDigitalAssetDialog}
        onOpenChange={setShowAddDigitalAssetDialog}
        onBack={handleBackToAccountTypes}
      />

      {/* Add Liability Dialog */}
      <AddLiabilityDialog
        open={showAddLiabilityDialog}
        onOpenChange={setShowAddLiabilityDialog}
      />

      {/* Add Other Asset Dialog */}
      <AddOtherAssetDialog
        open={showAddOtherAssetDialog}
        onOpenChange={setShowAddOtherAssetDialog}
      />

      {/* Add Private Equity Dialog */}
      <AddPrivateEquityDialog
        open={showAddPrivateEquityDialog}
        onOpenChange={setShowAddPrivateEquityDialog}
        onBack={handleBackToAccountTypes}
      />

      {/* Add Public Stock Dialog */}
      <AddPublicStockDialog
        open={showAddPublicStockDialog}
        onOpenChange={setShowAddPublicStockDialog}
        onBack={handleBackToAccountTypes}
      />

      {/* Add Real Estate Dialog */}
      <AddRealEstateDialog
        open={showAddRealEstateDialog}
        onOpenChange={setShowAddRealEstateDialog}
        onBack={handleBackToAccountTypes}
      />

      {/* Add Investment Account Dialog */}
      <AddInvestmentAccountDialog
        open={showAddInvestmentAccountDialog}
        onOpenChange={setShowAddInvestmentAccountDialog}
        onBack={handleBackToAccountTypes}
      />

      {/* Add Retirement Plan Dialog */}
      <AddRetirementPlanDialog
        open={showAddRetirementPlanDialog}
        onOpenChange={setShowAddRetirementPlanDialog}
        onBack={handleBackToAccountTypes}
      />

      {/* Add Bank Account Dialog */}
      <AddBankAccountDialog
        open={showAddBankAccountDialog}
        onOpenChange={setShowAddBankAccountDialog}
        onBack={handleBackToAccountTypes}
      />
      
      {/* Plaid Link Dialog */}
      <PlaidLinkDialog
        isOpen={showPlaidDialog}
        onClose={() => setShowPlaidDialog(false)}
        onSuccess={handlePlaidSuccess}
      />

      {/* Add Credit Card Dialog */}
      <AddCreditCardDialog
        open={showAddCreditCardDialog}
        onOpenChange={setShowAddCreditCardDialog}
        onComplete={handleBackToAccountTypes}
      />
      
    </ThreeColumnLayout>
  );
};

export default Accounts;
