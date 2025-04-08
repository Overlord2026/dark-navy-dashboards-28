
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
      description: "AMG Pantheon Fund, LLC provides Accredited Investors unique exposure to a diversified private equity portfolio sourced by Pantheon's Global Investment Team. The Fund offers diversification by manager, stage, vintage year, and industry through a single allocation.",
      firm: "Pantheon Ventures",
      minimumInvestment: "$50,000",
      tags: ["Private Equity", "Global", "Diversified"],
      featured: true
    },
    {
      id: "pe-2",
      name: "Ares Private Markets Fund",
      description: "Ares Private Markets Fund ('The Fund') seeks to build a diversified private equity investment solution that aims to deliver attractive, long-term capital appreciation. It features dynamic allocation, which aims to reduce the J-curve and vintage risk, and offers enhanced diversification across managers and investments.",
      firm: "Ares Management",
      minimumInvestment: "$100,000",
      tags: ["Private Equity", "Diversified", "Dynamic Allocation"],
      featured: true
    },
    {
      id: "pe-3",
      name: "Blackstone Private Equity Strategies Fund, (TE) L.P. ('BXPE Tax-Exempt')",
      description: "BXPE seeks to provide qualified individual investors broad exposure to Blackstone's private equity platform and its 15+ strategies through a single fund. Blackstone is the world's largest alternatives asset manager, and BXPE leverages its immense scale and expertise.",
      firm: "Blackstone",
      minimumInvestment: "$250,000",
      tags: ["Private Equity", "Multi-Strategy", "Tax-Exempt"],
      featured: true
    },
    {
      id: "pe-4",
      name: "CAIS Vista Foundation Fund V, L.P.",
      description: "Vista Foundation Fund V, L.P. ('VFF V') was formed by Vista Equity Partners Management, LLC to acquire controlling interests in middle-market and 'Mid Cap' enterprise software, data, and technology-enabled solutions companies. It targets companies with enterprise values between $250 million and $750 million+.",
      firm: "Vista Equity Partners",
      minimumInvestment: "$500,000",
      tags: ["Private Equity", "Technology", "Middle Market"],
      featured: true
    },
    {
      id: "pe-5",
      name: "JP Morgan Private Markets Fund",
      description: "JP Morgan Private Markets Fund has a small mid-market private equity focus, offering multi-manager exposure with simplified structure and terms, backed by the extensive resources of one of the largest financial institutions in the world.",
      firm: "JP Morgan",
      minimumInvestment: "$250,000",
      tags: ["Private Equity", "Mid Market", "Multi-Manager"],
      featured: true
    },
    {
      id: "pe-6",
      name: "AMG Pantheon Fund, LLC (Class 1)",
      description: "AMG Pantheon Fund, LLC (Class 1) seeks to provide Accredited Investors exposure to a diversified private equity portfolio with diversification by manager, stage, vintage year, and industry. It features a lower investment minimum, a perpetual 'evergreen' strategy, and enhanced potential liquidity.",
      firm: "Pantheon Ventures",
      minimumInvestment: "$25,000",
      tags: ["Private Equity", "Global", "Evergreen"]
    },
    {
      id: "pe-7",
      name: "Ares Private Markets Fund iCapital Offshore Access Fund SP 1",
      description: "Ares Private Markets Fund (APMF) is a diversified private equity investment solution, anchored in secondary investments, designed to deliver attractive long-term capital appreciation through market cycles.",
      firm: "Ares Management",
      minimumInvestment: "$100,000",
      tags: ["Private Equity", "Secondaries", "Offshore"]
    },
    {
      id: "pe-8",
      name: "BlackRock Private Investment Fund",
      description: "BlackRock Private Investments Fund ('BPIF') provides access to private equity investments, especially during periods when public market returns are muted, and aims to amplify investor returns through continuous offering.",
      firm: "BlackRock",
      minimumInvestment: "$50,000",
      tags: ["Private Equity", "Continuous Offering"]
    },
    {
      id: "pe-9",
      name: "BlackRock Private Investments Fund iCapital Offshore Access Fund, L.P.",
      description: "BlackRock Private Investments Fund offers access to institutional-quality private equity investments through a continuously offered fund structure, providing a robust private markets solution.",
      firm: "BlackRock",
      minimumInvestment: "$100,000",
      tags: ["Private Equity", "Institutional", "Offshore"]
    },
    {
      id: "pe-10",
      name: "Bonaccord Capital Partners Fund III",
      description: "Bonaccord Capital Partners Fund III is a middle-market GP stakes fund focusing on growth capital investments in mid-market private sponsors across private equity, private credit, real estate, and real assets. It aims to deliver attractive risk-adjusted returns driven by both elevated yields and capital appreciation.",
      firm: "Aberdeen Standard Investments",
      minimumInvestment: "$500,000",
      tags: ["Private Equity", "GP Stakes", "Middle Market"]
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
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-medium text-white">{offering.name}</h4>
                    {offering.featured && (
                      <Badge className="bg-primary text-white">
                        Featured
                      </Badge>
                    )}
                  </div>
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
