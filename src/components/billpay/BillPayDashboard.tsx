import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillPayOverview } from "./BillPayOverview";
import { ManualBillEntry } from "./ManualBillEntry";
import { AutomatedPayments } from "./AutomatedPayments";
import { BillAnalytics } from "./BillAnalytics";
import { SecurityPrivacyBadges } from "./SecurityPrivacyBadges";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

export const BillPayDashboard: React.FC = () => {
  const { checkFeatureAccess } = useSubscriptionAccess();
  const [activeTab, setActiveTab] = useState("overview");
  
  const hasPremiumAccess = checkFeatureAccess('bill_pay_premium');
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bill Pay</h1>
          <p className="text-muted-foreground">Manage and automate your bill payments</p>
        </div>
        <SecurityPrivacyBadges />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="automated" disabled={!hasPremiumAccess}>
            Automated {!hasPremiumAccess && "🔒"}
          </TabsTrigger>
          <TabsTrigger value="analytics" disabled={!hasPremiumAccess}>
            Analytics {!hasPremiumAccess && "🔒"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <BillPayOverview />
        </TabsContent>

        <TabsContent value="manual">
          <ManualBillEntry />
        </TabsContent>

        <TabsContent value="automated">
          <AutomatedPayments />
        </TabsContent>

        <TabsContent value="analytics">
          <BillAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};