
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { PropertyManager } from "@/components/properties/PropertyManager";

const Properties = () => {
  return (
    <ThreeColumnLayout title="Properties">
      <div className="container mx-auto px-4 py-6">
        <PropertyManager />
      </div>
    </ThreeColumnLayout>
  );
};

export default Properties;
