
import React, { useEffect } from "react";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import NavigationDiagnosticModule from "@/components/diagnostics/NavigationDiagnosticModule";
import { measureRouteLoad } from "@/utils/performance";

const NavigationDiagnostics: React.FC = () => {
  // Measure page load performance
  useEffect(() => {
    const cleanup = measureRouteLoad('/navigation-diagnostics');
    return cleanup;
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="Navigation Diagnostics" 
        text="Comprehensive health check of all navigation routes and components"
      />
      
      <div className="grid grid-cols-1 gap-6">
        <NavigationDiagnosticModule />
      </div>
    </div>
  );
};

export default NavigationDiagnostics;
