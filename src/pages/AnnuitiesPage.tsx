import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { EnhancedAnnuitiesDashboard } from "@/components/annuities/EnhancedAnnuitiesDashboard";

export const AnnuitiesPage = () => {
  return (
    <ThreeColumnLayout title="Annuities" activeMainItem="annuities">
      <EnhancedAnnuitiesDashboard />
    </ThreeColumnLayout>
  );
};