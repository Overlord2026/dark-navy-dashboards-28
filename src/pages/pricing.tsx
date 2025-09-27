import React from "react";
import PricingTableSite from "@/components/pricing/PricingTableSite";
import AdvisorPricingSite from "@/components/pricing/AdvisorPricingSite";
import RiaSeatTable from "@/components/pricing/RiaSeatTable";
import PricingFAQ from "@/components/pricing/PricingFAQ";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-bfo-navy text-bfo-ivory">
      {/* Families */}
      <PricingTableSite />

      {/* Advisor */}
      <AdvisorPricingSite />

      {/* RIA */}
      <RiaSeatTable />

      {/* FAQ */}
      <PricingFAQ />
    </main>
  );
}
