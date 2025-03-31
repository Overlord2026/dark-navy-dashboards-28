
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { DataImportInterface } from "@/components/familyoffice/DataImportInterface";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function DataImportPage() {
  return (
    <ThreeColumnLayout title="Data Import Tools - Admin">
      <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/marketplace" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> 
              Back to Marketplace
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-md mb-6">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          <p className="text-sm text-amber-800">
            This admin interface is for authorized personnel only. All data imports must comply with relevant regulations, terms of service, and privacy policies.
          </p>
        </div>

        <DataImportInterface />
      </div>
    </ThreeColumnLayout>
  );
}
