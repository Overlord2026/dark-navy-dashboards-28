
import React from "react";
import { PropertyManager } from "@/components/properties/PropertyManager";
import { useSearchParams } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  return (
    <ThreeColumnLayout title="Property Management" activeMainItem="family-wealth">
      <div className="w-full max-w-7xl mx-auto -mt-4">
        <div className="mt-6 mb-4">
          <h1 className="text-2xl font-bold text-foreground">Property Management</h1>
        </div>
        <PropertyManager initialFilter={filter} />
      </div>
    </ThreeColumnLayout>
  );
};

export default Properties;
