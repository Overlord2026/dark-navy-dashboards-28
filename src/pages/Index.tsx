
import React, { useEffect, useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
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
import { UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const { assets } = useNetWorth();
  const { isInFreeTrial, daysRemainingInTrial } = useSubscription();
  const { userProfile } = useUser();
  const [dashboardKey, setDashboardKey] = useState(Date.now());

  // Force refresh of dashboard when profile changes
  useEffect(() => {
    setDashboardKey(Date.now());
  }, [userProfile]);

  // Determine which banner to show based on trial status
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
    <ThreeColumnLayout title="Dashboard">
      <div key={dashboardKey} className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        {renderTrialBanner()}
        
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-3">
            <Link to="/customer-profile">
              <div className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-md transition-colors cursor-pointer">
                <UserCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Profile</span>
              </div>
            </Link>
            <QuickActionsMenu />
          </div>
        </div>
        
        <FinancialOverview />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NetWorthSummary />
          <div className="space-y-6">
            <ExpenseOptimizationCard />
            <TaxPlanningSummary />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentActivity />
          <UpcomingBillsCard />
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
