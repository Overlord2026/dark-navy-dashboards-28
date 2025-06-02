
import React from "react";
import { Sidebar } from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { PropertyManager } from "@/components/properties/PropertyManager";
import { useSearchParams } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  return (
    <ThreeColumnLayout title="" activeMainItem="family-wealth">
      <PropertyManager initialFilter={filter} />
    </ThreeColumnLayout>
  );
};

export default Properties;
