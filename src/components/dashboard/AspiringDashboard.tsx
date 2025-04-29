
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { SegmentAwareHero } from "./SegmentAwareHero";
import { FreeTrialCallout } from "./FreeTrialCallout";
import { BookIcon, BarChart3Icon } from "lucide-react";
import { educationNavItems } from "@/components/navigation/tabs/EducationTab";

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
      
      {/* Assets Summary Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Assets Summary</h2>
          <BarChart3Icon className="h-6 w-6 text-purple-500" />
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <p className="text-center">Your Plaid-connected assets will appear here</p>
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

export default AspiringDashboard;
