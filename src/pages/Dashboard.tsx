
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { WelcomeTrialBanner } from "@/components/dashboard/WelcomeTrialBanner";
import { usePagePerformance } from "@/hooks/usePagePerformance";
import { DashboardSkeleton } from "@/components/ui/SkeletonLoader";
import { useOptimizedDashboard } from "@/hooks/useOptimizedDashboard";

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { isInFreeTrial } = useSubscription();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const { loading } = useOptimizedDashboard();
  
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

  // Show skeleton loader while bootstrap data is loading
  if (loading) {
    return (
      <ThreeColumnLayout>
        <div className="space-y-4 px-4 py-2 max-w-7xl mx-auto">
          <DashboardSkeleton />
        </div>
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout>
      <div className="space-y-4 px-4 py-2 max-w-7xl mx-auto">
        {isInFreeTrial && showWelcomeBanner && (
          <WelcomeTrialBanner onDismiss={handleDismissBanner} />
        )}
        
        <div>
          <NetWorthSummary />
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
