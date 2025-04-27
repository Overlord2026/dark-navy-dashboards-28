import React, { useState, useEffect } from "react";
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
import { usePagePerformance } from "@/hooks/usePagePerformance";
import { AudienceSegmentBanner } from "@/components/dashboard/AudienceSegmentBanner";

export default function Dashboard() {
  const { userProfile } = useUser();
  const { isInFreeTrial } = useSubscription();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  
  usePagePerformance('/dashboard');
  
  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "system_administrator";

  const handleDismissBanner = () => {
    setShowWelcomeBanner(false);
  };

  useEffect(() => {
    console.log('Dashboard component rendered:', new Date().toISOString());
    
    return () => {
      console.log('Dashboard component unmounted:', new Date().toISOString());
    };
  }, []);

  return (
    <ThreeColumnLayout title="Dashboard">
      <div className="space-y-4 px-4 py-2 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-8 space-y-4">
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
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-4">
            <AudienceSegmentBanner />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
