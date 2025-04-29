
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useLocation } from "react-router-dom";
import { AspiringDashboard } from "@/components/dashboard/AspiringDashboard";
import { PreRetireesDashboard } from "@/components/dashboard/PreRetireesDashboard";
import { UltraHNWDashboard } from "@/components/dashboard/UltraHNWDashboard";
import { AdvisorDashboard } from "@/components/dashboard/AdvisorDashboard";
import { BrandedHeader } from "@/components/layout/BrandedHeader";

export default function Dashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const segment = queryParams.get('segment');

  const renderSegmentDashboard = () => {
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
        return <AspiringDashboard />;
    }
  };

  return (
    <>
      <BrandedHeader />
      <ThreeColumnLayout>
        <div className="px-6 py-6">
          {renderSegmentDashboard()}
        </div>
      </ThreeColumnLayout>
    </>
  );
}
