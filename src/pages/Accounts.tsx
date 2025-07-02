
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Shield, TrendingUp, CreditCard, Building, Banknote, Wallet } from "lucide-react";
import { RetirementAccountTracker } from "@/components/social-security/RetirementAccountTracker";
import { FundingAccountsOverview } from "@/components/accounts/FundingAccountsOverview";
import { CollapsibleCard } from "@/components/accounts/CollapsibleCard";
import { useAccountManagement } from "@/hooks/useAccountManagement";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Accounts = () => {
  const { fundingAccounts, handleManageFunding, handleCompleteSetup } = useAccountManagement();
  const isMobile = useIsMobile();

  const handleAddAccount = (type: string) => {
    console.log(`Add ${type} clicked`);
  };

  return (
    <ThreeColumnLayout
      activeMainItem="accounts"
      title="Account Overview"
    >
      <div className={cn(
        "container mx-auto max-w-7xl space-y-6",
        isMobile ? "px-3 py-4" : "px-4 py-6"
      )}>
        {/* Header Section */}
        <div className={cn(
          "flex gap-4 pb-6 border-b border-border",
          isMobile ? "flex-col items-start" : "flex-col sm:flex-row sm:items-center sm:justify-between"
        )}>
          <div className="space-y-2">
            <p className={cn(
              "text-muted-foreground",
              isMobile ? "text-sm" : "text-base"
            )}>Manage all your financial accounts in one place</p>
          </div>
          <div className={cn(
            "flex gap-3",
            isMobile ? "w-full flex-col" : "flex-row"
          )}>
            <Button 
              onClick={handleManageFunding} 
              variant="outline"
              className={cn(
                isMobile ? "w-full text-sm" : ""
              )}
            >
              <Wallet className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Manage Funding
            </Button>
            <Button 
              onClick={() => handleAddAccount('General')}
              className={cn(
                isMobile ? "w-full text-sm" : ""
              )}
            >
              <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Add Account
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6">
          {/* Funding Accounts Section */}
          <FundingAccountsOverview 
            accounts={fundingAccounts} 
            onManageFunding={handleManageFunding} 
          />

          {/* BFO Managed */}
          <CollapsibleCard
            icon={<Shield className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="BFO Managed"
            amount="$0.00"
            description="Complete your account setup to view managed accounts."
          >
            <Button 
              onClick={handleCompleteSetup} 
              className={cn(
                isMobile ? "w-full text-sm" : "w-full sm:w-auto"
              )}
            >
              Complete Setup
            </Button>
          </CollapsibleCard>

          {/* 401K/457/403B Plans */}
          <CollapsibleCard
            icon={<TrendingUp className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="401K/457/403B Plans"
            amount="$0.00"
            description="Track and manage your retirement accounts"
          >
            <RetirementAccountTracker />
          </CollapsibleCard>

          {/* Investment */}
          <CollapsibleCard
            icon={<TrendingUp className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="Investment"
            amount="$0.00"
            description="No investment accounts linked."
          >
            <Button 
              onClick={() => handleAddAccount('Investment Account')} 
              variant="outline" 
              className={cn(
                isMobile ? "w-full text-sm" : "w-full sm:w-auto"
              )}
            >
              <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Add Investment Account
            </Button>
          </CollapsibleCard>

          {/* Manually-Tracked */}
          <CollapsibleCard
            icon={<CreditCard className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="Manually-Tracked"
            amount="$0.00"
            description="No manually tracked accounts added."
          >
            <Button 
              onClick={() => handleAddAccount('Manual Account')} 
              variant="outline" 
              className={cn(
                isMobile ? "w-full text-sm" : "w-full sm:w-auto"
              )}
            >
              <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Add Manual Account
            </Button>
          </CollapsibleCard>

          {/* Loans */}
          <CollapsibleCard
            icon={<Building className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="Loans"
            amount="$0.00"
            description="No loan accounts linked."
          >
            <div className="space-y-4">
              <div>
                <label className={cn(
                  "block font-medium mb-2",
                  isMobile ? "text-sm" : "text-sm"
                )}>Loan Type</label>
                <Select defaultValue="mortgage">
                  <SelectTrigger className={cn(
                    isMobile ? "w-full text-sm" : "w-full sm:w-48"
                  )}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                    <SelectItem value="auto">Auto Loan</SelectItem>
                    <SelectItem value="student">Student Loan</SelectItem>
                    <SelectItem value="business">Business Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => handleAddAccount('Loan')} 
                variant="outline" 
                className={cn(
                  isMobile ? "w-full text-sm" : "w-full sm:w-auto"
                )}
              >
                <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                Add Loan
              </Button>
            </div>
          </CollapsibleCard>

          {/* Banking */}
          <CollapsibleCard
            icon={<Banknote className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="Banking"
            amount="$0.00"
            description="No banking accounts linked."
          >
            <Button 
              onClick={() => handleAddAccount('Bank Account')} 
              variant="outline" 
              className={cn(
                isMobile ? "w-full text-sm" : "w-full sm:w-auto"
              )}
            >
              <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Add Bank Account
            </Button>
          </CollapsibleCard>

          {/* Credit Cards */}
          <CollapsibleCard
            icon={<CreditCard className={cn("mr-2 h-5 w-5 text-primary", isMobile && "h-4 w-4")} />}
            title="Credit Cards"
            amount="$0.00"
            description="No credit card accounts linked."
          >
            <Button 
              onClick={() => handleAddAccount('Credit Card')} 
              variant="outline" 
              className={cn(
                isMobile ? "w-full text-sm" : "w-full sm:w-auto"
              )}
            >
              <PlusCircle className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
              Add Credit Card
            </Button>
          </CollapsibleCard>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Accounts;
