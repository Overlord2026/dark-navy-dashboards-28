import React from "react";
import PricingTableSite from "@/components/pricing/PricingTableSite";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-bfo-navy text-bfo-ivory">
      {/* Families section */}
      <PricingTableSite />

      {/* Placeholders for next PRs to preserve anchors */}
      <section id="advisor" className="container mx-auto px-4 py-24">
        <h2 className="text-xl font-semibold opacity-60">Advisor — Solo</h2>
        <p className="mt-2 text-sm opacity-60">
          Advisor pricing cards render here in PR2.
        </p>
      </section>

      <section id="ria" className="container mx-auto px-4 py-24">
        <h2 className="text-xl font-semibold opacity-60">RIA Teams</h2>
        <p className="mt-2 text-sm opacity-60">
          RIA seat table renders here in PR3.
        </p>
      </section>
    </main>
  );
}
