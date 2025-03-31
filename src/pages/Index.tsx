
import React, { useEffect, useState } from "react";
import { ModularLayout } from "@/components/layout/ModularLayout";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { ExpenseOptimizationCard } from "@/components/dashboard/ExpenseOptimizationCard";
import { TaxPlanningSummary } from "@/components/dashboard/TaxPlanningSummary";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UpcomingBillsCard } from "@/components/dashboard/UpcomingBillsCard";
import { useNetWorth } from "@/context/NetWorthContext";
import { WelcomeTrialBanner } from "@/components/dashboard/WelcomeTrialBanner";
import { TrialEndingSoonBanner } from "@/components/dashboard/TrialEndingSoonBanner";
import { MidTrialBanner } from "@/components/dashboard/MidTrialBanner";
import { useSubscription } from "@/context/SubscriptionContext";
import { QuickActionsMenu } from "@/components/dashboard/QuickActionsMenu";
import { useUser } from "@/context/UserContext";
import { SystemDiagnosticsButton } from "@/components/diagnostics/SystemDiagnosticsButton";
import { DiagnosticsOverview } from "@/components/diagnostics/DiagnosticsOverview";
import { QuickDiagnosticsButton } from "@/components/diagnostics/QuickDiagnosticsButton";

export default function Index() {
  const { assets } = useNetWorth();
  const { isInFreeTrial, daysRemainingInTrial } = useSubscription();
  const { userProfile } = useUser();
  const [dashboardKey, setDashboardKey] = useState(Date.now());
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";

  useEffect(() => {
    setDashboardKey(Date.now());
  }, [userProfile]);

  const renderTrialBanner = () => {
    if (!isInFreeTrial) return null;
    
    if (daysRemainingInTrial && daysRemainingInTrial >= 10) {
      return <WelcomeTrialBanner onDismiss={() => {}} />;
    } else if (daysRemainingInTrial && daysRemainingInTrial >= 5) {
      return <MidTrialBanner onDismiss={() => {}} />;
    } else {
      return <TrialEndingSoonBanner onDismiss={() => {}} />;
    }
  };

  return (
    <ModularLayout title="Dashboard" activeMainItem="home">
      <div key={dashboardKey} className="space-y-4 px-4 py-2 max-w-7xl mx-auto">
        {renderTrialBanner()}
        
        <div className="mt-1 flex justify-between items-center">
          <QuickDiagnosticsButton />
          <QuickActionsMenu />
        </div>
        
        <div id="financial-overview-section">
          <FinancialOverview />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <NetWorthSummary />
          <div className="space-y-5">
            <ExpenseOptimizationCard />
            <TaxPlanningSummary />
          </div>
          <DiagnosticsOverview />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <RecentActivity />
          <UpcomingBillsCard />
        </div>
      </div>
    </ModularLayout>
  );
}
