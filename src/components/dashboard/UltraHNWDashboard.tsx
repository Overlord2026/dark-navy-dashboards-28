
import React from "react";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { SegmentAwareHero } from "./SegmentAwareHero";
import { FreeTrialCallout } from "./FreeTrialCallout";
import { DatabaseIcon } from "lucide-react";

interface UltraHNWDashboardProps {
  segment?: string;
}

export function UltraHNWDashboard({ segment }: UltraHNWDashboardProps) {
  const { profile, loading } = useProfile();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Hero Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-[#1B1B32] to-[#2D2D44] rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[#d4af37] text-xl font-semibold animate-pulse">
            Organize
          </span>
          <SegmentAwareHero />
          <span className="text-[#d4af37] text-xl font-semibold animate-pulse">
            Maximize
          </span>
        </div>
      </div>
      
      {/* Free Trial Callout */}
      <FreeTrialCallout />
      
      {/* Main Content - Simplified to single column */}
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Trust & Estate Dashboard</h2>
            <DatabaseIcon className="h-6 w-6 text-indigo-500" />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Comprehensive trust and estate management
          </div>
        </Card>
      </div>
    </div>
  );
}

export default UltraHNWDashboard;
