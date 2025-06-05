
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { PropertySummaryCard } from "@/components/dashboard/PropertySummaryCard";
import { useUser } from "@/context/UserContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { WelcomeTrialBanner } from "@/components/dashboard/WelcomeTrialBanner";
import { usePagePerformance } from "@/hooks/usePagePerformance";

export default function Dashboard() {
  const { userProfile } = useUser();
  const { isInFreeTrial } = useSubscription();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  
  usePagePerformance('/client-dashboard');
  
  console.log('Dashboard: AdminActions component completely removed');

  const handleDismissBanner = () => {
    setShowWelcomeBanner(false);
  };

  useEffect(() => {
    console.log('Dashboard component rendered:', new Date().toISOString());
    console.log('Dashboard: NO AdminActions component rendered');
    
    return () => {
      console.log('Dashboard component unmounted:', new Date().toISOString());
    };
  }, []);

  return (
    <ThreeColumnLayout>
      <div className="space-y-4 px-4 py-2 max-w-7xl mx-auto">
        {isInFreeTrial && showWelcomeBanner && (
          <WelcomeTrialBanner onDismiss={handleDismissBanner} />
        )}
        
        <div id="financial-overview-section">
          <FinancialOverview />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <NetWorthSummary />
          </div>
          <div>
            <PropertySummaryCard />
          </div>
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
