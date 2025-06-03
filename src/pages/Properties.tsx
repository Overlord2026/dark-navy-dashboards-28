
import React from "react";
import { PropertyManager } from "@/components/properties/PropertyManager";
import { useSearchParams } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  return (
    <ThreeColumnLayout title="Property Management" activeMainItem="family-wealth">
      <div className="w-full max-w-7xl mx-auto mt-8">
        <PropertyManager initialFilter={filter} />
      </div>
    </ThreeColumnLayout>
  );
};

export default Properties;
