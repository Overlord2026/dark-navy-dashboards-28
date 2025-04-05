
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import StockScreener from "@/components/investments/StockScreener";
import { useMarketData } from "@/hooks/useMarketData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Create these components inline since the imports were causing issues
const MarketOverview = () => {
  const { data, isLoading } = useMarketData();
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading market data...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between">
                <span>DOW</span>
                <span className={data.marketSummary.dow.change >= 0 ? "text-green-500" : "text-red-500"}>
                  {data.marketSummary.dow.value.toLocaleString()} ({data.marketSummary.dow.change > 0 ? "+" : ""}
                  {data.marketSummary.dow.change.toLocaleString()})
                </span>
              </div>
              <div className="flex justify-between">
                <span>S&P 500</span>
                <span className={data.marketSummary.sp500.change >= 0 ? "text-green-500" : "text-red-500"}>
                  {data.marketSummary.sp500.value.toLocaleString()} ({data.marketSummary.sp500.change > 0 ? "+" : ""}
                  {data.marketSummary.sp500.change.toLocaleString()})
                </span>
              </div>
              <div className="flex justify-between">
                <span>NASDAQ</span>
                <span className={data.marketSummary.nasdaq.change >= 0 ? "text-green-500" : "text-red-500"}>
                  {data.marketSummary.nasdaq.value.toLocaleString()} ({data.marketSummary.nasdaq.change > 0 ? "+" : ""}
                  {data.marketSummary.nasdaq.change.toLocaleString()})
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PortfolioOverview = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Portfolio Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-4">
          <p>Your investment portfolio summary will appear here.</p>
        </div>
      </CardContent>
    </Card>
  );
};

const InvestmentDashboard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-4">
          <p>Your investment activity and allocations will appear here.</p>
        </div>
      </CardContent>
    </Card>
  );
};

const AlternativesSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alternative Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center p-4">
          <p>Explore alternative investment opportunities.</p>
        </div>
      </CardContent>
    </Card>
  );
};

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
