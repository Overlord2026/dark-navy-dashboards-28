
import React from "react";
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
import { Button } from "@/components/ui/button";
import { QuickActionsMenu } from "@/components/dashboard/QuickActionsMenu";
import { useUser } from "@/context/UserContext";
import { UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  const { assets } = useNetWorth();
  const { isInFreeTrial, daysRemainingInTrial } = useSubscription();
  const { userProfile } = useUser();

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
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        {renderTrialBanner()}
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome Back, {userProfile.firstName}</h1>
            <p className="text-muted-foreground mt-1">Here's your financial overview</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/customer-profile">
              <Button variant="outline" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                <span>Your Profile</span>
              </Button>
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
