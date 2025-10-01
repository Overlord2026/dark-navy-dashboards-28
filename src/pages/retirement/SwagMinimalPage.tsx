import HeaderSpacer from "@/components/layout/HeaderSpacer";
import SwagScenarioBar from "@/components/retirement/SwagScenarioBar";

export default function SwagMinimalPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-bfo-ivory">
      <HeaderSpacer />
      <header className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">SWAG Analyzer</h1>
        <p className="text-white/70">Quick retirement scenario testing with minimal inputs.</p>
      </header>
      <SwagScenarioBar />
    </div>
  );
}
