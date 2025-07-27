import React from "react";
import { useFamilyOfficeData } from "@/hooks/useFamilyOfficeData";
import { PersonalizedWelcome } from "./sections/PersonalizedWelcome";
import { GoalsAndMilestones } from "./sections/GoalsAndMilestones";
import { AssetMap } from "./sections/AssetMap";
import { CashFlowSnapshot } from "./sections/CashFlowSnapshot";
import { HealthspanWidget } from "./sections/HealthspanWidget";
import { GiftingLegacy } from "./sections/GiftingLegacy";
import { ExperienceReturn } from "./sections/ExperienceReturn";
import { QuickActions } from "./sections/QuickActions";
import { AlertsInsights } from "./sections/AlertsInsights";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

export const BoutiqueFamilyOfficeDashboard: React.FC = () => {
  const { data: familyData, loading } = useFamilyOfficeData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Loading your family office dashboard...</span>
      </div>
    );
  }

  if (!familyData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Unable to load dashboard data</p>
          <p className="text-sm text-muted-foreground">Please refresh the page or contact support</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Boutique Family Office Badge */}
      <div className="flex justify-center mb-6">
        <Badge variant="outline" className="px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <Crown className="h-4 w-4 mr-2 text-amber-600" />
          <span className="text-amber-800 font-medium">Boutique Family Office Experience</span>
        </Badge>
      </div>

      {/* A. Personalized Welcome & Quick Summary */}
      <PersonalizedWelcome familyData={familyData} />

      {/* B. Goals & Milestones: Experience-Centric */}
      {/* <GoalsAndMilestones goals={familyData.goals} /> */}
      <div className="p-6 text-center text-muted-foreground">
        Goals integration coming soon - visit <a href="/goals" className="text-primary underline">/goals</a> for full functionality
      </div>

      {/* C. Asset Map & Income Streams */}
      <AssetMap incomeStreams={familyData.incomeStreams} />

      {/* D. Cash Flow / Budget Snapshot */}
      <CashFlowSnapshot incomeStreams={familyData.incomeStreams} />

      {/* E. Healthspan & Longevity Widget */}
      <HealthspanWidget healthData={familyData.health} />

      {/* F. Gifting & Legacy */}
      <GiftingLegacy giftingGoals={familyData.gifting} />

      {/* G. Experience Return / Family Life */}
      <ExperienceReturn experiences={familyData.experiences} />

      {/* H. Quick Actions Panel */}
      <QuickActions />

      {/* I. Alerts/Insights/AI Suggestions */}
      <AlertsInsights />

      {/* Footer Attribution */}
      <div className="text-center py-8 border-t">
        <p className="text-sm text-muted-foreground">
          Powered by your boutique family office • Designed for multi-generational wealth
        </p>
      </div>
    </div>
  );
};