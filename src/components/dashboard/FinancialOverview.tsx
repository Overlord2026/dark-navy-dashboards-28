
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
      <div className="space-y-6">
        {/* Asset Allocation Section */}
        <div>
          <ComprehensiveAssetsSummary hideInternalTabs={true} />
        </div>
        
        {/* Separator */}
        <Separator className="my-6" />
        
        {/* Properties Section */}
        <div>
          <PropertySection />
        </div>
      </div>
    </DashboardCard>
  );
};
