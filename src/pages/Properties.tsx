
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import { PropertyManager } from "@/components/properties/PropertyManager";

const Properties = () => {
  return (
    <ThreeColumnLayout title="Properties">
      <div className="container mx-auto px-4 py-6">
        <DashboardHeader 
          heading="Properties" 
          text="Manage your real estate portfolio and track property valuations"
        />
        <div className="mt-6">
          <PropertyManager />
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Properties;
