import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { AnnuitiesDashboard } from "@/components/annuities/AnnuitiesDashboard";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export const AnnuitiesPage = () => {
  return (
    <ThreeColumnLayout title="Annuities" activeMainItem="annuities">
      <div className="container max-w-7xl mx-auto p-6">
        {/* Header with Share Button */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Annuities—Education, Marketplace & Review</h1>
            <p className="text-muted-foreground">
              Explore annuities with the clarity and transparency you deserve.
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share this resource
          </Button>
        </div>
        <AnnuitiesDashboard />
      </div>
    </ThreeColumnLayout>
  );
};