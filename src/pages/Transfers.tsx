
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Building2, CreditCard, ArrowRightLeft, History, Users } from "lucide-react";
import { useBankAccounts } from "@/hooks/useBankAccounts";
import { TransferForm } from "@/components/transfers/TransferForm";
import { TransferHistory } from "@/components/transfers/TransferHistory";
import { BankAccountsList } from "@/components/accounts/BankAccountsList";

const Transfers = () => {
  const navigate = useNavigate();
  const { accounts, getFormattedTotalBalance } = useBankAccounts();
  const [activeTab, setActiveTab] = useState("transfer");

  const handleAddFundingAccount = () => {
    // TODO: Navigate to add funding account page or open modal
    console.log("Add funding account clicked");
  };

  const handleTransferSuccess = () => {
    // Switch to history tab after successful transfer
    setActiveTab("history");
  };

  return (
    <ThreeColumnLayout title="Transfers">
      <div className="p-6">
        <div className="w-full max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold">Transfers</h1>
              <p className="text-muted-foreground mt-2">
                Manage transfers between your accounts
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-xl font-semibold">{getFormattedTotalBalance()}</p>
              </div>
              <Button onClick={handleAddFundingAccount} variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Account
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transfer" className="flex items-center gap-2">
                <ArrowRightLeft className="h-4 w-4" />
                Transfer
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="accounts" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Accounts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transfer" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TransferForm onSuccess={handleTransferSuccess} />
                <div className="space-y-6">
                  {accounts.length >= 2 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                        <CardDescription>
                          Common transfer scenarios
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Building2 className="h-4 w-4 mr-2" />
                          Emergency Fund → Checking
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Checking → Savings
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Transfer Limits</CardTitle>
                      <CardDescription>
                        Current daily limits and fees
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Daily limit:</span>
                        <span className="font-medium">$50,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Transfer fee:</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Processing time:</span>
                        <span className="font-medium">Instant</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <TransferHistory />
            </TabsContent>

            <TabsContent value="accounts" className="space-y-6">
              <BankAccountsList />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Transfers;
