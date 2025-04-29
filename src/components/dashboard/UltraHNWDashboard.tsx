
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { SegmentAwareHero } from "./SegmentAwareHero";
import { FreeTrialCallout } from "./FreeTrialCallout";
import { DatabaseIcon, BarChart3Icon } from "lucide-react";
import { educationNavItems } from "@/components/navigation/tabs/EducationTab";

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
      
      {/* Assets Summary Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Assets Summary</h2>
          <BarChart3Icon className="h-6 w-6 text-indigo-500" />
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <p className="text-center">Your Plaid-connected assets will appear here</p>
        </div>
      </Card>
      
      {/* Trust & Estate Dashboard */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Trust & Estate Dashboard</h2>
          <DatabaseIcon className="h-6 w-6 text-indigo-500" />
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center">
          Comprehensive trust and estate management
        </div>
      </Card>
      
      {/* Education & Solutions Modules */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Premium Solutions</h2>
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

export default UltraHNWDashboard;
