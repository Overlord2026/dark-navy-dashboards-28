
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { SegmentAwareHero } from "./SegmentAwareHero";
import { FreeTrialCallout } from "./FreeTrialCallout";
import { FileTextIcon, BarChart3Icon } from "lucide-react";
import { educationNavItems } from "@/components/navigation/tabs/EducationTab";

interface PreRetieesDashboardProps {
  segment?: string;
}

export function PreRetireesDashboard({ segment }: PreRetieesDashboardProps) {
  const { profile, loading } = useProfile();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
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
      </div>
      
      {/* Free Trial Callout */}
      <FreeTrialCallout />
      
      {/* Assets Summary Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Assets Summary</h2>
          <BarChart3Icon className="h-6 w-6 text-amber-500" />
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <p className="text-center">Your Plaid-connected assets will appear here</p>
        </div>
      </Card>
      
      {/* Estate & Legacy Guide */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Estate & Legacy Guide</h2>
          <FileTextIcon className="h-6 w-6 text-amber-500" />
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
          Comprehensive estate planning resources
        </div>
      </Card>
      
      {/* Education & Solutions Modules */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Education & Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {educationNavItems.slice(0, 6).map((item) => (
            <Card key={item.href} className="hover:shadow-lg transition-all">
              <CardContent className="p-4 flex items-center gap-3">
                {item.icon && <item.icon className="h-5 w-5 text-primary" />}
                <span className="font-medium">{item.title}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PreRetireesDashboard;
