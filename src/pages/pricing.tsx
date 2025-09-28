import React from "react";
import { Routes, Route } from "react-router-dom";
import PricingTableSite from "@/components/pricing/PricingTableSite";
import AdvisorPricingSite from "@/components/pricing/AdvisorPricingSite";
import RiaSeatTable from "@/components/pricing/RiaSeatTable";
import PricingFAQ from "@/components/pricing/PricingFAQ";
import CheckoutRouter from "@/pages/pricing/CheckoutRouter";

export default function PricingPage() {
  return (
    <>
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

      {/* Checkout Router - handles /pricing/checkout route */}
      <Routes>
        <Route path="/checkout" element={<CheckoutRouter />} />
      </Routes>
    </>
  );
}
