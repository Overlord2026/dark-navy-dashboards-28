
import React from "react";
import { useSearchParams } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { AspiringDashboard } from "@/components/dashboard/AspiringDashboard";
import { PreRetireesDashboard } from "@/components/dashboard/PreRetireesDashboard";
import { UltraHNWDashboard } from "@/components/dashboard/UltraHNWDashboard";
import { AdvisorDashboard } from "@/components/dashboard/AdvisorDashboard";

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const segment = searchParams.get("segment") || "preretirees"; // Default to preretirees if no segment

  // Render the appropriate dashboard based on segment
  const renderDashboard = () => {
    switch (segment) {
      case "aspiring":
        return <AspiringDashboard segment={segment} />;
      case "preretirees":
        return <PreRetireesDashboard segment={segment} />;
      case "ultrahnw":
        return <UltraHNWDashboard segment={segment} />;
      case "advisor":
        return <AdvisorDashboard segment={segment} />;
      default:
        return <PreRetireesDashboard segment="preretirees" />; // Fallback to preretirees
    }
  };

  return (
    <ThreeColumnLayout title={segment === "integration" ? "Integration" : undefined}>
      {renderDashboard()}
    </ThreeColumnLayout>
  );
};

export default Dashboard;
