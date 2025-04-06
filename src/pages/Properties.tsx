
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { PropertyManager } from "@/components/properties/PropertyManager";
import { useSearchParams } from "react-router-dom";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  return (
    <ThreeColumnLayout title="Real Estate & Properties" activeMainItem="family-wealth">
      <div className="container mx-auto p-4 max-w-7xl">
        <PropertyManager initialFilter={filter} />
      </div>
    </ThreeColumnLayout>
  );
};

export default Properties;
