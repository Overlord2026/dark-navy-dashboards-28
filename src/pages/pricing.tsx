import React from "react";
import PricingTableSite from "@/components/pricing/PricingTableSite";
import AdvisorPricingSite from "@/components/pricing/AdvisorPricingSite";
import RiaSeatTable from "@/components/pricing/RiaSeatTable";
import LegacyBetaSection from "@/components/pricing/LegacyBetaSection";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-bfo-navy text-bfo-ivory">
      {/* Families */}
      <PricingTableSite />

      {/* Advisor */}
      <AdvisorPricingSite />

      {/* RIA */}
      <RiaSeatTable />

      {/* Legacy (Beta) */}
      <LegacyBetaSection />
    </main>
  );
}
