
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useLocation, useSearchParams } from "react-router-dom";
import { DefaultDashboard } from "@/components/dashboard/DefaultDashboard";
import { AspiringDashboard } from "@/components/dashboard/AspiringDashboard";
import { PreRetireesDashboard } from "@/components/dashboard/PreRetireesDashboard";
import { UltraHNWDashboard } from "@/components/dashboard/UltraHNWDashboard";
import { AdminActions } from "@/components/dashboard/AdminActions";
import { useUser } from "@/context/UserContext";

export default function Dashboard() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const segment = searchParams.get('segment');
  const { userProfile } = useUser();
  
  const isAdmin = userProfile?.role === "admin" || userProfile?.role === "system_administrator";
  
  const renderDashboardContent = () => {
    switch (segment) {
      case 'aspiring':
        return <AspiringDashboard segment={segment} />;
      case 'preretirees':
        return <PreRetireesDashboard segment={segment} />;
      case 'ultrahnw':
        return <UltraHNWDashboard segment={segment} />;
      default:
        return <DefaultDashboard />;
    }
  };
  
  return (
    <ThreeColumnLayout activeMainItem="dashboard">
      <div className="space-y-6">
        {/* Main dashboard content */}
        {renderDashboardContent()}
        
        {/* Admin actions - only visible to admin users */}
        {isAdmin && <AdminActions />}
      </div>
    </ThreeColumnLayout>
  );
}
