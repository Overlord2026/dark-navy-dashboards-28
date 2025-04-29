
import React from "react";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { SegmentAwareHero } from "./SegmentAwareHero";
import { FreeTrialCallout } from "./FreeTrialCallout";
import { TrendingUpIcon, LayoutDashboardIcon, BookIcon } from "lucide-react";

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
      
      {/* Main Content - Segment Specific Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Your Goal Progress</h2>
            <TrendingUpIcon className="h-6 w-6 text-green-500" />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Track the progress towards your financial goals
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Investment Blueprint</h2>
            <LayoutDashboardIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Customize your investment strategy
          </div>
        </Card>
        
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
