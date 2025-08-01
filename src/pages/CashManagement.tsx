import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { BankAccountsList } from "@/components/accounts/BankAccountsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIBookkeepingDashboard } from "@/components/bookkeeping/AIBookkeepingDashboard";

const CashManagement = () => {
  const [activeTab, setActiveTab] = useState("accounts");

  return (
    <ThreeColumnLayout activeMainItem="cash-management" title="Cash Management">
      <div className="w-full space-y-6 animate-fade-in">
        <div>
          <p className="text-muted-foreground">
            Manage your bank accounts and automated bookkeeping with AI-powered categorization.
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="accounts">Bank Accounts</TabsTrigger>
            <TabsTrigger value="bookkeeping">AI Bookkeeping</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts">
            <BankAccountsList />
          </TabsContent>

          <TabsContent value="bookkeeping">
            <AIBookkeepingDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default CashManagement;