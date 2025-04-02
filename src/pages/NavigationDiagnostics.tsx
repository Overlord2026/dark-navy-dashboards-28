
import React from "react";
import { DashboardHeader } from "@/components/ui/Header";
import NavigationDiagnosticModule from "@/components/diagnostics/NavigationDiagnosticModule";

const NavigationDiagnostics: React.FC = () => {
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
