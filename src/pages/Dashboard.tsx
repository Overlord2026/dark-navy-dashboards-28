
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useLocation } from "react-router-dom";
import { AspiringDashboard } from "@/components/dashboard/AspiringDashboard";
import { PreRetireesDashboard } from "@/components/dashboard/PreRetireesDashboard";
import { UltraHNWDashboard } from "@/components/dashboard/UltraHNWDashboard";
import { AdvisorDashboard } from "@/components/dashboard/AdvisorDashboard";
import { DefaultDashboard } from "@/components/dashboard/DefaultDashboard";
import { useAudience } from "@/context/AudienceContext";

export default function Dashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const segmentParam = queryParams.get('segment');
  
  const { currentSegment } = useAudience();
  
  // Use the segment from URL params if provided, otherwise use the one from context ONLY if explicitly set
  const segment = segmentParam || currentSegment || null;

  const renderSegmentDashboard = () => {
    // Only render segment-specific content when explicitly requested via URL or user selection
    switch (segment) {
      case 'aspiring':
        return <AspiringDashboard />;
      case 'preretirees':
        return <PreRetireesDashboard />;
      case 'ultrahnw':
        return <UltraHNWDashboard />;
      case 'advisor':
        return <AdvisorDashboard />;
      default:
        // Show the default dashboard when no segment is specified
        return <DefaultDashboard />;
    }
  };

  return (
    <ThreeColumnLayout activeMainItem="integration">
      <div className="px-6 py-6">
        {renderSegmentDashboard()}
      </div>
    </ThreeColumnLayout>
  );
}
