
import React from "react";
import { useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { AdvisorModules } from "@/components/advisor/AdvisorModules";

export default function AdvisorModuleMarketplace() {
  const navigate = useNavigate();

  return (
    <ThreeColumnLayout activeMainItem="advisor" title="Module Marketplace">
      <div className="w-full max-w-6xl mx-auto p-4">
        <AdvisorModules />
      </div>
    </ThreeColumnLayout>
  );
}
