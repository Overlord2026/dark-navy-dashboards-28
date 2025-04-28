
import React from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { AspiringDashboard } from "@/components/dashboard/AspiringDashboard";
import { PreRetireesDashboard } from "@/components/dashboard/PreRetireesDashboard";
import { UltraHNWDashboard } from "@/components/dashboard/UltraHNWDashboard";
import { AdvisorDashboard } from "@/components/dashboard/AdvisorDashboard";

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const segment = searchParams.get("segment");

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
        return <Navigate to="/landing" replace />;
    }
  };

  return (
    <ThreeColumnLayout showAdmin={false}>
      {renderDashboard()}
    </ThreeColumnLayout>
  );
};

export default Dashboard;
