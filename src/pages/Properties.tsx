
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { PropertyManager } from "@/components/properties/PropertyManager";
import { DashboardHeader } from "@/components/ui/DashboardHeader";

const Properties = () => {
  return (
    <ThreeColumnLayout title="Properties">
      <div className="container mx-auto px-4 py-6">
        <DashboardHeader 
          heading="Properties" 
          text="Manage your real estate assets and track their performance."
        />
        <PropertyManager />
      </div>
    </ThreeColumnLayout>
  );
};

export default Properties;
