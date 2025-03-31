
import React from "react";
import { useSearchParams } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { PropertyManager } from "@/components/properties/PropertyManager";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  return (
    <ThreeColumnLayout title="Properties Management" activeMainItem="properties">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <PropertyManager initialFilter={filter} />
      </div>
    </ThreeColumnLayout>
  );
};

export default Properties;
