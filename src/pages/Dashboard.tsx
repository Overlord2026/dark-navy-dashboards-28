
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { ExpenseOptimizationCard } from "@/components/dashboard/ExpenseOptimizationCard";
import { TaxPlanningSummary } from "@/components/dashboard/TaxPlanningSummary";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AdminActions } from "@/components/dashboard/AdminActions";
import { ReportsGenerator } from "@/components/dashboard/ReportsGenerator";
import { useUser } from "@/context/UserContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { WelcomeTrialBanner } from "@/components/dashboard/WelcomeTrialBanner";

export default function Dashboard() {
  const { userProfile } = useUser();
  const { isInFreeTrial } = useSubscription();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  
  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "system_administrator";

  const handleDismissBanner = () => {
    setShowWelcomeBanner(false);
  };

  return (
    <ThreeColumnLayout title="Dashboard">
      <div className="space-y-4 px-4 py-2 max-w-7xl mx-auto">
        {isAdmin && (
          <div className="mt-1">
            <AdminActions />
          </div>
        )}
        
        {isInFreeTrial && showWelcomeBanner && (
          <WelcomeTrialBanner onDismiss={handleDismissBanner} />
        )}
        
        <div id="financial-overview-section">
          <FinancialOverview />
        </div>
        
        <div id="reports-section">
          <ReportsGenerator />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <NetWorthSummary />
          <div className="space-y-5">
            <ExpenseOptimizationCard />
            <TaxPlanningSummary />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <RecentActivity />
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
