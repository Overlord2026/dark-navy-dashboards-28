
import React, { useEffect } from "react";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import NavigationDiagnosticModule from "@/components/diagnostics/NavigationDiagnosticModule";
import { measureRoutePerformance } from "@/services/performance/performanceMonitorService";
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const NavigationDiagnostics: React.FC = () => {
  // Check if user has admin permissions
  const { userProfile } = useUser();
  const userRole = userProfile?.role || "client";
  const isAdmin = userRole === "admin" || userRole === "system_administrator";
  
  // Measure page load performance (for admins only)
  useEffect(() => {
    if (isAdmin) {
      const stopMeasuring = measureRoutePerformance('/navigation-diagnostics');
      return () => {
        stopMeasuring(); // Call the function without using the return value
      };
    }
  }, [isAdmin]);

  // If not admin, redirect to dashboard with error message
  if (!isAdmin) {
    toast.error("You don't have permission to access Navigation Diagnostics");
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="Admin Tools: Navigation Diagnostics" 
        text="Comprehensive health check of all navigation routes and components"
      />
      
      <div className="grid grid-cols-1 gap-6">
        <NavigationDiagnosticModule />
      </div>
    </div>
  );
};

export default NavigationDiagnostics;
