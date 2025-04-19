
import React, { useEffect, useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { TaxPlanningSummary } from "@/components/dashboard/TaxPlanningSummary";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ReportsGenerator } from "@/components/dashboard/ReportsGenerator";
import { useNetWorth } from "@/context/NetWorthContext";
import { WelcomeTrialBanner } from "@/components/dashboard/WelcomeTrialBanner";
import { TrialEndingSoonBanner } from "@/components/dashboard/TrialEndingSoonBanner";
import { MidTrialBanner } from "@/components/dashboard/MidTrialBanner";
import { useSubscription } from "@/context/SubscriptionContext";
import { QuickActionsMenu } from "@/components/dashboard/QuickActionsMenu";
import { useUser } from "@/context/UserContext";
import { measureRouteLoad } from "@/utils/performance";
import { usePagePerformance } from "@/hooks/usePagePerformance";

export default function Index() {
  console.log('Index page rendering');
  
  // Use the performance hook
  usePagePerformance('/');
  
  try {
    // Access context hooks
    const { assets } = useNetWorth();
    console.log('Index: useNetWorth hook loaded successfully', assets.length);
    
    const { isInFreeTrial, daysRemainingInTrial } = useSubscription();
    console.log('Index: useSubscription hook loaded successfully', { isInFreeTrial, daysRemainingInTrial });
    
    const { userProfile } = useUser();
    console.log('Index: useUser hook loaded successfully', userProfile?.role);
    
    const [dashboardKey, setDashboardKey] = useState(Date.now());
    const userRole = userProfile?.role || "client";
    const isAdmin = userRole === "admin" || userRole === "system_administrator";

    useEffect(() => {
      setDashboardKey(Date.now());
      
      // Log dashboard rendering time
      const cleanup = measureRouteLoad('/');
      
      // Console log for debugging
      console.log(`Dashboard component rendered: ${new Date().toISOString()}`);
      
      return () => {
        cleanup();
        console.log(`Dashboard component unmounted: ${new Date().toISOString()}`);
      };
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
      <ThreeColumnLayout title="Dashboard">
        <div key={dashboardKey} className="space-y-4 px-4 py-2 max-w-7xl mx-auto">
          {renderTrialBanner()}
          
          {isAdmin && (
            <div className="mt-1">
              <QuickActionsMenu />
            </div>
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
              <TaxPlanningSummary />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <RecentActivity />
          </div>
        </div>
      </ThreeColumnLayout>
    );
  } catch (error) {
    console.error('Error in Index page:', error);
    return (
      <ThreeColumnLayout title="Dashboard">
        <div className="space-y-4 px-4 py-2 max-w-7xl mx-auto">
          <div className="p-8 text-center bg-red-900/20 rounded-lg border border-red-800">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-300">
              We encountered an error while loading your dashboard. Please try refreshing the page.
            </p>
            <pre className="mt-4 text-left bg-gray-900 p-4 rounded text-xs overflow-auto">
              {String(error)}
            </pre>
          </div>
        </div>
      </ThreeColumnLayout>
    );
  }
}
