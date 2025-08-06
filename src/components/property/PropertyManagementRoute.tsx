import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { PropertyManagementDashboard } from "./PropertyManagementDashboard";

export default function PropertyManagementRoute() {
  return (
    <ThreeColumnLayout title="Property Management">
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <PropertyManagementDashboard />
      </div>
    </ThreeColumnLayout>
  );
}