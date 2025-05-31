
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { useUser } from "@/context/UserContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { WelcomeTrialBanner } from "@/components/dashboard/WelcomeTrialBanner";
import { usePagePerformance } from "@/hooks/usePagePerformance";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { userProfile } = useUser();
  const { isInFreeTrial } = useSubscription();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const { metrics, loading, refreshMetrics } = useRealTimeData();
  
  usePagePerformance('/client-dashboard');
  
  console.log('Dashboard: Real-time data loaded', metrics);

  const handleDismissBanner = () => {
    setShowWelcomeBanner(false);
  };

  const handleRefresh = () => {
    console.log('Dashboard: Manual refresh triggered');
    refreshMetrics();
  };

  useEffect(() => {
    console.log('Dashboard component rendered:', new Date().toISOString());
    console.log('Dashboard: Real-time metrics updated', metrics);
    
    return () => {
      console.log('Dashboard component unmounted:', new Date().toISOString());
    };
  }, [metrics]);

  if (loading) {
    return (
      <ThreeColumnLayout>
        <div className="space-y-4 px-4 py-2 max-w-7xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">Loading dashboard data...</span>
              </div>
            </CardContent>
          </Card>
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
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Last updated: {new Date(metrics.lastUpdated).toLocaleString()}
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <div id="financial-overview-section">
          <FinancialOverview />
        </div>
        
        <div>
          <NetWorthSummary />
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
