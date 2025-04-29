
import React from "react";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { SegmentAwareHero } from "./SegmentAwareHero";
import { FreeTrialCallout } from "./FreeTrialCallout";

interface AdvisorDashboardProps {
  segment?: string;
}

export function AdvisorDashboard({ segment }: AdvisorDashboardProps) {
  const { profile, loading } = useProfile();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Animated Header Banner */}
      <div className="mb-8 p-6 bg-[#162B4D] rounded-lg shadow-md border border-[#2A3E5C]">
        <div className="flex items-center justify-between">
          <span className="text-[#FFC700] text-xl font-semibold animate-pulse">
            Organize
          </span>
          <SegmentAwareHero />
          <span className="text-[#FFC700] text-xl font-semibold animate-pulse">
            Maximize
          </span>
        </div>
        <p className="text-white max-w-3xl mt-4 text-center mx-auto">
          Manage your client relationships, access specialized tools, and leverage our platform
          to deliver exceptional service to your high-value clientele.
        </p>
      </div>
      
      {/* Free Trial Callout */}
      <FreeTrialCallout />
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-[#162B4D] border-[#2A3E5C] shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#FFC700]">Client Management</h2>
          <div className="bg-[#0F1E3A] p-4 rounded-md text-center text-white">
            Your client tools go here
          </div>
        </Card>
        
        <Card className="p-6 bg-[#162B4D] border-[#2A3E5C] shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#FFC700]">Portfolio Analytics</h2>
          <div className="bg-[#0F1E3A] p-4 rounded-md text-center text-white">
            Your analytics tools go here
          </div>
        </Card>
        
        <Card className="p-6 bg-[#162B4D] border-[#2A3E5C] shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-[#FFC700]">Practice Growth</h2>
          <div className="bg-[#0F1E3A] p-4 rounded-md text-center text-white">
            Your business development resources go here
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdvisorDashboard;
