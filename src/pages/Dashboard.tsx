
import React from "react";
import { useSearchParams } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { AspiringDashboard } from "@/components/dashboard/AspiringDashboard";
import { PreRetireesDashboard } from "@/components/dashboard/PreRetireesDashboard";
import { UltraHNWDashboard } from "@/components/dashboard/UltraHNWDashboard";
import { AdvisorDashboard } from "@/components/dashboard/AdvisorDashboard";
import { AdminIntegrationDashboard } from "@/components/dashboard/AdminIntegrationDashboard";
import { useUser } from "@/context/UserContext";

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const segment = searchParams.get("segment") || "preretirees"; // Default to preretirees if no segment
  const { userProfile } = useUser();
  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "system_administrator";

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
      case "integration":
        // Only render integration dashboard for admins
        return isAdmin ? <AdminIntegrationDashboard /> : <PreRetireesDashboard segment="preretirees" />;
      default:
        return <PreRetireesDashboard segment="preretirees" />; // Fallback to preretirees
    }
  };

  // If user is not an admin but trying to access the integration dashboard,
  // we still show the regular dashboard based on segment, not the integration dashboard
  if (segment === "integration" && !isAdmin) {
    return (
      <ThreeColumnLayout>
        <PreRetireesDashboard segment="preretirees" />
      </ThreeColumnLayout>
    );
  }

  return (
    <ThreeColumnLayout title={segment === "integration" && isAdmin ? "Integration" : undefined}>
      {renderDashboard()}
    </ThreeColumnLayout>
  );
};

export default Dashboard;
