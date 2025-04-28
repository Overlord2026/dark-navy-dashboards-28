
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { AudienceSegmentBanner } from "@/components/dashboard/AudienceSegmentBanner";
import { useAudience } from "@/context/AudienceContext";
import { 
  FileLineChart, 
  Building, 
  Landmark, 
  Shield, 
  Briefcase, 
  Users, 
  FileText, 
  CreditCard,
  User
} from "lucide-react";

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
    
    const { currentSegment } = useAudience();
    const isRetireOrUHNW = currentSegment === 'retiree' || currentSegment === 'uhnw';
    
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

    // Core feature buttons for Retiree and UHNW segments
    const renderCoreFeatureButtons = () => {
      if (!isRetireOrUHNW) return null;
      
      const features = currentSegment === 'retiree' ? [
        { title: "Retirement Planning", icon: <Landmark className="h-5 w-5" />, link: "/financial-plans" },
        { title: "Estate Planning", icon: <FileText className="h-5 w-5" />, link: "/estate-planning" },
        { title: "Tax Optimization", icon: <FileLineChart className="h-5 w-5" />, link: "/tax-planning" },
        { title: "Healthcare Planning", icon: <Shield className="h-5 w-5" />, link: "/healthcare" }
      ] : [
        { title: "Wealth Preservation", icon: <Briefcase className="h-5 w-5" />, link: "/wealth-management" },
        { title: "Legacy Planning", icon: <Users className="h-5 w-5" />, link: "/estate-planning" },
        { title: "Family Office Services", icon: <Building className="h-5 w-5" />, link: "/family-office" },
        { title: "Advisor Connection", icon: <User className="h-5 w-5" />, link: "/profile" }
      ];
      
      return (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentSegment === 'retiree' ? 'Retirement Planning Tools' : 'Family Office Services'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="hover:bg-muted/5 transition-colors">
                <Link to={feature.link}>
                  <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      {feature.icon}
                    </div>
                    <h3 className="font-medium">{feature.title}</h3>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      );
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
          
          {/* AudienceSegmentBanner will only show for Aspiring segment */}
          <AudienceSegmentBanner />
          
          {/* Quick access buttons for Retiree and UHNW */}
          {renderCoreFeatureButtons()}
          
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
