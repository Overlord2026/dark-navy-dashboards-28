
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import InterestedButton from "@/components/common/InterestedButton";
import ScheduleMeetingDialog from "@/components/common/ScheduleMeetingDialog";

interface AssetCategoryOfferingsProps {
  category: {
    id: string;
    name: string;
    description: string;
  };
  onBack: () => void;
}

// Sample offerings data by category
const offeringsByCategory: Record<string, any[]> = {
  "private-equity": [
    {
      id: "pe-1",
      name: "AMG Pantheon Fund, LLC",
      description: "A diversified private equity solution providing access to a global portfolio of private equity investments across multiple sectors, geographies, and strategies.",
      firm: "Pantheon Ventures",
      minimumInvestment: "$50,000",
      tags: ["Private Equity", "Global", "Diversified"]
    },
    {
      id: "pe-2",
      name: "Hamilton Lane Private Assets Fund",
      description: "Provides exposure to a diversified portfolio of private equity and private credit investments through a single allocation.",
      firm: "Hamilton Lane",
      minimumInvestment: "$25,000",
      tags: ["Private Equity", "Private Credit", "Semi-Liquid"]
    }
  ],
  "private-debt": [
    {
      id: "pd-1",
      name: "Cliffwater Corporate Lending Fund",
      description: "Focused on direct lending to middle market companies, providing income generation and capital preservation.",
      firm: "Cliffwater LLC",
      minimumInvestment: "$25,000",
      tags: ["Direct Lending", "Middle Market", "Income"]
    }
  ],
  "hedge-fund": [
    {
      id: "hf-1",
      name: "BlackRock Alternative Capital Fund",
      description: "Multi-strategy hedge fund solution providing diversified exposure to various alternative strategies.",
      firm: "BlackRock",
      minimumInvestment: "$100,000",
      tags: ["Multi-Strategy", "Liquid Alternatives"]
    }
  ],
  "venture-capital": [
    {
      id: "vc-1",
      name: "Forge Global Private Market Fund",
      description: "Access to late-stage venture-backed companies before they go public.",
      firm: "Forge Global",
      minimumInvestment: "$100,000",
      tags: ["Late-Stage Venture", "Pre-IPO", "Growth"]
    }
  ],
  "digital-assets": [
    {
      id: "da-1",
      name: "Grayscale Digital Large Cap Fund",
      description: "Diversified exposure to large-cap digital assets through a market cap-weighted portfolio.",
      firm: "Grayscale Investments",
      minimumInvestment: "$50,000",
      tags: ["Digital Assets", "Diversified", "Large Cap"]
    }
  ],
  "real-assets": [
    {
      id: "ra-1",
      name: "Starwood Real Estate Income Trust",
      description: "Income-focused commercial real estate portfolio across multiple property sectors and geographies.",
      firm: "Starwood Capital",
      minimumInvestment: "$5,000",
      tags: ["Real Estate", "Income", "Commercial"]
    }
  ],
  "collectibles": [
    {
      id: "co-1",
      name: "Masterworks Art Investment Platform",
      description: "Fractional ownership in blue-chip art masterpieces with historical appreciation.",
      firm: "Masterworks",
      minimumInvestment: "$15,000",
      tags: ["Art", "Fractional Ownership", "Blue Chip"]
    }
  ],
  "structured-investments": [
    {
      id: "si-1",
      name: "Goldman Sachs Structured Notes",
      description: "Customized structured products with defined risk/return profiles based on underlying assets.",
      firm: "Goldman Sachs",
      minimumInvestment: "$10,000",
      tags: ["Structured Notes", "Tailored", "Defined Outcome"]
    }
  ]
};

const AssetCategoryOfferings: React.FC<AssetCategoryOfferingsProps> = ({ category, onBack }) => {
  // Get offerings for the selected category
  const offerings = offeringsByCategory[category.id] || [];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="border-gray-700 text-white hover:bg-gray-800"
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Categories
        </Button>
        <h3 className="text-lg font-medium">{category.name}</h3>
      </div>
      
      <p className="text-gray-400 mb-6">{category.description}</p>
      
      {offerings.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-700 rounded-lg">
          <p className="text-gray-400">No offerings available in this category at the moment.</p>
          <p className="text-gray-500 text-sm mt-2">
            Contact your advisor to discuss potential opportunities.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {offerings.map((offering) => (
            <Card 
              key={offering.id}
              className="border rounded-lg p-6 bg-[#0f1628] border-gray-800"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-xl font-medium text-white mb-2">{offering.name}</h4>
                  <p className="text-gray-300 mb-4">{offering.description}</p>
                  
                  <div className="flex gap-2 flex-wrap mb-4">
                    {offering.tags.map((tag: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="bg-secondary/10 text-secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-400">Minimum Investment</p>
                      <p className="text-gray-300">{offering.minimumInvestment}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-400">Firm</p>
                      <p className="text-gray-300">{offering.firm}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 justify-end w-full md:w-auto">
                  <InterestedButton 
                    assetName={offering.name} 
                    variant="outline"
                    className="w-full md:w-auto border-gray-700 text-white hover:bg-[#1c2e4a]"
                  />
                  <ScheduleMeetingDialog 
                    assetName={offering.name}
                    variant="outline"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetCategoryOfferings;
