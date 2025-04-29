
import React from "react";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { SegmentAwareHero } from "./SegmentAwareHero";
import { FreeTrialCallout } from "./FreeTrialCallout";
import { BookIcon } from "lucide-react";

interface AspiringDashboardProps {
  segment?: string;
}

export function AspiringDashboard({ segment }: AspiringDashboardProps) {
  const { profile, loading } = useProfile();
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Animated Header Banner */}
      <div className="mb-8 p-6 bg-[#1a202c] rounded-lg shadow-md">
        {isMobile ? (
          <div className="text-center">
            <SegmentAwareHero />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[#d4af37] text-xl font-semibold animate-pulse">
                Organize
              </span>
              <SegmentAwareHero />
              <span className="text-[#d4af37] text-xl font-semibold animate-pulse">
                Maximize
              </span>
            </div>
          </>
        )}
      </div>
      
      {/* Free Trial Callout */}
      <FreeTrialCallout />
      
      {/* Main Content - Simplified to single column */}
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Learning Modules</h2>
            <BookIcon className="h-6 w-6 text-purple-500" />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Financial education resources for growth
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AspiringDashboard;
