import React from "react";
import PricingTableSite from "@/components/pricing/PricingTableSite";
import AdvisorPricingSite from "@/components/pricing/AdvisorPricingSite";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-bfo-navy text-bfo-ivory">
      {/* Families */}
      <PricingTableSite />

      {/* Advisor */}
      <AdvisorPricingSite />

      {/* Keep RIA anchor placeholder for PR3 */}
      <section id="ria" className="container mx-auto px-4 py-24" />
    </main>
  );
}
