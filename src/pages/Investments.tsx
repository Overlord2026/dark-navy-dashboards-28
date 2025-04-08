
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import OfferingsList from "@/components/investments/OfferingsList";

// Sample investment offerings data
const sampleOfferings = [
  {
    id: "1",
    name: "Private Equity Fund I",
    description: "A diversified portfolio of private equity investments across multiple sectors and geographies.",
    category: "private-equity",
    firm: "BlackRock Investments",
    minimumInvestment: "$250,000",
    tags: ["Private Equity", "Growth", "Diversified"],
    performance: "12.5% IRR",
    lockupPeriod: "5 years"
  },
  {
    id: "2",
    name: "Real Estate Opportunities Fund",
    description: "Commercial real estate portfolio focused on high-growth markets with stable income potential.",
    category: "real-assets",
    firm: "Vanguard Real Estate",
    minimumInvestment: "$100,000",
    tags: ["Real Estate", "Income", "Commercial"],
    performance: "8.2% Annual Yield",
    lockupPeriod: "3 years"
  },
  {
    id: "3",
    name: "Venture Capital Fund III",
    description: "Early and growth stage investments in technology companies with disruptive potential.",
    category: "private-equity",
    firm: "Sequoia Partners",
    minimumInvestment: "$500,000",
    tags: ["Venture Capital", "Tech", "Growth"],
    performance: "18.7% IRR",
    lockupPeriod: "7 years"
  },
  {
    id: "4",
    name: "Fixed Income Alternative Fund",
    description: "Alternative fixed income investments providing uncorrelated returns to traditional bond markets.",
    category: "private-debt",
    firm: "PIMCO Alternatives",
    minimumInvestment: "$150,000",
    tags: ["Fixed Income", "Alternative", "Low Volatility"],
    performance: "7.5% Annual Return",
    lockupPeriod: "2 years"
  },
  {
    id: "5",
    name: "Digital Assets Fund",
    description: "Professionally managed portfolio of blockchain assets and digital infrastructure investments.",
    category: "digital-assets",
    firm: "Grayscale Investments",
    minimumInvestment: "$75,000",
    tags: ["Digital Assets", "Blockchain", "High Growth"],
    performance: "22.3% IRR",
    lockupPeriod: "1 year"
  }
];

const Investments: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  
  // Filter offerings based on active category
  const filteredOfferings = activeCategoryId === "all" 
    ? sampleOfferings 
    : sampleOfferings.filter(offering => offering.category === activeCategoryId);
  
  return (
    <ThreeColumnLayout title="Investment Offerings">
      <div className="w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-4">Alternative Investments</h2>
          <p className="text-gray-400 mb-6">
            Explore exclusive alternative investment opportunities available through our platform. 
            Each offering has been carefully selected to provide diversification and potentially enhanced returns.
          </p>
          
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button 
              onClick={() => setActiveCategoryId("all")}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeCategoryId === "all" 
                  ? "bg-primary text-white" 
                  : "bg-[#1a283e] text-gray-300 hover:bg-gray-800"
              }`}
            >
              All Offerings
            </button>
            <button 
              onClick={() => setActiveCategoryId("private-equity")}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeCategoryId === "private-equity" 
                  ? "bg-primary text-white" 
                  : "bg-[#1a283e] text-gray-300 hover:bg-gray-800"
              }`}
            >
              Private Equity
            </button>
            <button 
              onClick={() => setActiveCategoryId("private-debt")}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeCategoryId === "private-debt" 
                  ? "bg-primary text-white" 
                  : "bg-[#1a283e] text-gray-300 hover:bg-gray-800"
              }`}
            >
              Private Debt
            </button>
            <button 
              onClick={() => setActiveCategoryId("real-assets")}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeCategoryId === "real-assets" 
                  ? "bg-primary text-white" 
                  : "bg-[#1a283e] text-gray-300 hover:bg-gray-800"
              }`}
            >
              Real Assets
            </button>
            <button 
              onClick={() => setActiveCategoryId("digital-assets")}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeCategoryId === "digital-assets" 
                  ? "bg-primary text-white" 
                  : "bg-[#1a283e] text-gray-300 hover:bg-gray-800"
              }`}
            >
              Digital Assets
            </button>
          </div>
          
          {/* Display offerings */}
          <OfferingsList 
            offerings={filteredOfferings}
            categoryId={activeCategoryId}
          />
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Investments;
