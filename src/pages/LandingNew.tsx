import Hero from "@/components/landing/Hero";
import CatalogGrid from "@/components/catalog/CatalogGrid";
import PricingTable from "@/components/pricing/PricingTable";

export default function LandingNew() {
  return (
    <main className="min-h-screen bg-bfo-navy">
      <Hero />
      <CatalogGrid />
      {/* TODO: ToolsOverview */}
      {/* TODO: HowItWorks */}
      <PricingTable />
    </main>
  );
}