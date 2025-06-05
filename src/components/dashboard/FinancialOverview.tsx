
import React from "react";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { ComprehensiveAssetsSummary } from "@/components/assets/ComprehensiveAssetsSummary";
import { PropertySection } from "./PropertySection";
import { Separator } from "@/components/ui/separator";
import { BarChart3 } from "lucide-react";

export const FinancialOverview = () => {
  return (
    <DashboardCard 
      title="Financial Overview" 
      icon={<BarChart3 className="h-5 w-5" />}
      className="col-span-1 md:col-span-2"
    >
      <div className="space-y-8">
        {/* Asset Allocation Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Asset Allocation</h3>
          <div className="bg-muted/30 p-6 rounded-lg">
            <ComprehensiveAssetsSummary hideInternalTabs={true} />
          </div>
        </div>
        
        {/* Separator */}
        <Separator className="my-8" />
        
        {/* Properties Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Properties Overview</h3>
          <div className="bg-muted/30 p-6 rounded-lg">
            <PropertySection />
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
