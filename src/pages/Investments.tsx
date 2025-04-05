
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { InvestmentDashboard } from "@/components/investments/InvestmentDashboard";
import { MarketOverview } from "@/components/investments/MarketOverview";
import { PortfolioOverview } from "@/components/investments/PortfolioOverview";
import { AlternativesSection } from "@/components/investments/AlternativesSection";
import StockScreener from "@/components/investments/StockScreener";

const Investments = () => {
  return (
    <ThreeColumnLayout activeMainItem="investments">
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6">Investments</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <MarketOverview />
          <PortfolioOverview />
        </div>
        
        <InvestmentDashboard />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Stock Screener</h2>
          <StockScreener />
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Alternative Investments</h2>
          <AlternativesSection />
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Investments;
