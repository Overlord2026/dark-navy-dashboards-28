
import React from "react";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { SegmentAwareHero } from "./SegmentAwareHero";
import { FreeTrialCallout } from "./FreeTrialCallout";
import { WalletIcon, ShieldIcon, FileTextIcon } from "lucide-react";
import { BrandedHeader } from "@/components/layout/BrandedHeader";

interface PreRetireesDashboardProps {
  segment?: string;
}

export function PreRetireesDashboard({ segment }: PreRetireesDashboardProps) {
  const { profile, loading } = useProfile();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl mt-20">
      <BrandedHeader />
      
      {/* Animated Header Banner */}
      <div className="mb-8 p-6 bg-[#1a202c] rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[#d4af37] text-xl font-semibold animate-pulse">
            Organize
          </span>
          <SegmentAwareHero />
          <span className="text-[#d4af37] text-xl font-semibold animate-pulse">
            Maximize
          </span>
        </div>
        <p className="text-gray-200 max-w-3xl mt-4 text-center mx-auto">
          Welcome to your personalized wealth-building journey. Track your progress, discover strategies, 
          and accelerate your path to financial independence.
        </p>
      </div>
      
      {/* Free Trial Callout */}
      <FreeTrialCallout />
      
      {/* Main Content - Segment Specific Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Income & Withdrawal Planner</h2>
            <WalletIcon className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Plan your retirement income strategy
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Risk Protection Tools</h2>
            <ShieldIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Safeguard your retirement assets
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Estate & Legacy Guide</h2>
            <FileTextIcon className="h-6 w-6 text-amber-500" />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
            Comprehensive estate planning resources
          </div>
        </Card>
      </div>
    </div>
  );
}

export default PreRetireesDashboard;
