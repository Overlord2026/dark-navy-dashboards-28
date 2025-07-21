import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { AnnuitiesDashboard } from "@/components/annuities/AnnuitiesDashboard";

export const AnnuitiesPage = () => {
  return (
    <ThreeColumnLayout title="Annuities" activeMainItem="annuities">
      <div className="container p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Annuities—Education, Marketplace & Review</h1>
          <p className="text-muted-foreground">
            Comprehensive platform for annuity education, product comparison, and fiduciary review
          </p>
        </div>
        <AnnuitiesDashboard />
      </div>
    </ThreeColumnLayout>
  );
};