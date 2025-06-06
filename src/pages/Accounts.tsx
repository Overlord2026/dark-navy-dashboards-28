
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Shield, TrendingUp, CreditCard, Building, Banknote, Wallet } from "lucide-react";
import { RetirementAccountTracker } from "@/components/social-security/RetirementAccountTracker";
import { FundingAccountsOverview } from "@/components/accounts/FundingAccountsOverview";
import { CollapsibleCard } from "@/components/accounts/CollapsibleCard";
import { useAccountManagement } from "@/hooks/useAccountManagement";

const Accounts = () => {
  const { fundingAccounts, handleManageFunding, handleCompleteSetup } = useAccountManagement();

  const handleAddAccount = (type: string) => {
    console.log(`Add ${type} clicked`);
  };

  return (
    <ThreeColumnLayout
      activeMainItem="accounts"
      title="Accounts"
    >
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground">Manage all your financial accounts in one place</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleManageFunding} variant="outline">
              <Wallet className="mr-2 h-4 w-4" />
              Manage Funding
            </Button>
            <Button onClick={() => handleAddAccount('General')}>
              <PlusCircle className="mr-2 h-4 w-4" />
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
            icon={<Shield className="mr-2 h-5 w-5 text-primary" />}
            title="BFO Managed"
            amount="$0.00"
            description="Complete your account setup to view managed accounts."
          >
            <Button onClick={handleCompleteSetup} className="w-full sm:w-auto">
              Complete Setup
            </Button>
          </CollapsibleCard>

          {/* 401K/457/403B Plans */}
          <CollapsibleCard
            icon={<TrendingUp className="mr-2 h-5 w-5 text-primary" />}
            title="401K/457/403B Plans"
            amount="$0.00"
            description="Track and manage your retirement accounts"
            defaultExpanded={true}
          >
            <RetirementAccountTracker />
          </CollapsibleCard>

          {/* External Investment */}
          <CollapsibleCard
            icon={<TrendingUp className="mr-2 h-5 w-5 text-primary" />}
            title="External Investment"
            amount="$0.00"
            description="No external investment accounts linked."
          >
            <Button onClick={() => handleAddAccount('Investment Account')} variant="outline" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Investment Account
            </Button>
          </CollapsibleCard>

          {/* External Manually-Tracked */}
          <CollapsibleCard
            icon={<CreditCard className="mr-2 h-5 w-5 text-primary" />}
            title="External Manually-Tracked"
            amount="$0.00"
            description="No manually tracked accounts added."
          >
            <Button onClick={() => handleAddAccount('Manual Account')} variant="outline" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Manual Account
            </Button>
          </CollapsibleCard>

          {/* External Loans */}
          <CollapsibleCard
            icon={<Building className="mr-2 h-5 w-5 text-primary" />}
            title="External Loans"
            amount="$0.00"
            description="No loan accounts linked."
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Loan Type</label>
                <Select defaultValue="mortgage">
                  <SelectTrigger className="w-full sm:w-48">
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
              <Button onClick={() => handleAddAccount('Loan')} variant="outline" className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Loan
              </Button>
            </div>
          </CollapsibleCard>

          {/* External Banking */}
          <CollapsibleCard
            icon={<Banknote className="mr-2 h-5 w-5 text-primary" />}
            title="External Banking"
            amount="$0.00"
            description="No banking accounts linked."
          >
            <Button onClick={() => handleAddAccount('Bank Account')} variant="outline" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Bank Account
            </Button>
          </CollapsibleCard>

          {/* External Credit Cards */}
          <CollapsibleCard
            icon={<CreditCard className="mr-2 h-5 w-5 text-primary" />}
            title="External Credit Cards"
            amount="$0.00"
            description="No credit card accounts linked."
          >
            <Button onClick={() => handleAddAccount('Credit Card')} variant="outline" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Credit Card
            </Button>
          </CollapsibleCard>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Accounts;
