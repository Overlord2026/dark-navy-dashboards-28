
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { HorizontalOfferingCard } from "@/components/investments/HorizontalOfferingCard";

const privateEquityOfferings = [
  {
    id: 1,
    name: "AMG Pantheon Fund, LLC",
    description: "AMG Pantheon Fund, LLC provides Accredited Investors unique exposure to a diversified private equity portfolio sourced by Pantheon's Global Investment Team. The Fund offers diversification by manager, stage, vintage year, and industry through a single allocation.",
    minimumInvestment: "$50,000",
    firm: "Pantheon Ventures",
    tags: ["Private Equity", "Global", "Diversified"],
    featured: true
  },
  {
    id: 2,
    name: "Ares Private Markets Fund",
    description: "Ares Private Markets Fund ('The Fund') seeks to build a diversified private equity investment solution that aims to deliver attractive, long-term capital appreciation. It features dynamic allocation, which aims to reduce the J-curve and vintage risk, and offers enhanced diversification across managers and investments.",
    minimumInvestment: "$100,000",
    firm: "Ares Management",
    tags: ["Private Equity", "Diversified", "Dynamic Allocation"],
    featured: true
  },
  {
    id: 3,
    name: "Blackstone Private Equity Strategies Fund, (TE) L.P. ('BXPE Tax-Exempt')",
    description: "BXPE seeks to provide qualified individual investors broad exposure to Blackstone's private equity platform and its 15+ strategies through a single fund. Blackstone is the world's largest alternatives asset manager, and BXPE leverages its immense scale and expertise.",
    minimumInvestment: "$250,000",
    firm: "Blackstone",
    tags: ["Private Equity", "Multi-Strategy", "Tax-Exempt"],
    featured: true
  },
  {
    id: 4,
    name: "CAIS Vista Foundation Fund V, L.P.",
    description: "Vista Foundation Fund V, L.P. ('VFF V') was formed by Vista Equity Partners Management, LLC to acquire controlling interests in middle-market and 'Mid Cap' enterprise software, data, and technology-enabled solutions companies. It targets companies with enterprise values between $250 million and $750 million+.",
    minimumInvestment: "$500,000",
    firm: "Vista Equity Partners",
    tags: ["Private Equity", "Technology", "Middle Market"],
    featured: true
  },
  {
    id: 5,
    name: "JP Morgan Private Markets Fund",
    description: "JP Morgan Private Markets Fund has a small mid-market private equity focus, offering multi-manager exposure with simplified structure and terms, backed by the extensive resources of one of the largest financial institutions in the world.",
    minimumInvestment: "$250,000",
    firm: "JP Morgan",
    tags: ["Private Equity", "Mid Market", "Multi-Manager"],
    featured: false
  }
];

const PrivateEquity = () => {
  const navigate = useNavigate();
  
  const handleLike = (assetName: string) => {
    console.log(`Liked asset: ${assetName}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto py-8 px-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/investments")}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Categories
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Private Equity</h1>
          <p className="text-gray-400">Assets ({privateEquityOfferings.length})</p>
        </div>

        <div className="mb-6">
          <p className="text-gray-300">
            Investments in private companies or buyouts of public companies resulting in a delisting of public equity.
          </p>
        </div>

        <div className="space-y-6">
          {privateEquityOfferings.map((offering) => (
            <HorizontalOfferingCard
              key={offering.id}
              {...offering}
              onLike={handleLike}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivateEquity;
