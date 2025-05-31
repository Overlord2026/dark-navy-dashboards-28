
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar } from "lucide-react";
import { InterestedButton } from "./InterestedButton";
import { ScheduleMeetingDialog } from "./ScheduleMeetingDialog";

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
    featured: true
  },
  {
    id: 6,
    name: "AMG Pantheon Fund, LLC (Class 1)",
    description: "AMG Pantheon Fund, LLC (Class 1) seeks to provide Accredited Investors exposure to a diversified private equity portfolio with diversification by manager, stage, vintage year, and industry. It features a lower investment minimum, a perpetual 'evergreen' strategy, and enhanced potential liquidity.",
    minimumInvestment: "$25,000",
    firm: "Pantheon Ventures",
    tags: ["Private Equity", "Global", "Evergreen"],
    featured: false
  },
  {
    id: 7,
    name: "Ares Private Markets Fund iCapital Offshore Access Fund SP 1",
    description: "Ares Private Markets Fund (APMF) is a diversified private equity investment solution, anchored in secondary investments, designed to deliver attractive long-term capital appreciation through market cycles.",
    minimumInvestment: "$100,000",
    firm: "Ares Management",
    tags: ["Private Equity", "Secondaries", "Offshore"],
    featured: false
  },
  {
    id: 8,
    name: "BlackRock Private Investment Fund",
    description: "BlackRock Private Investments Fund ('BPIF') provides access to private equity investments, especially during periods when public market returns are muted, and aims to amplify investor returns through continuous offering.",
    minimumInvestment: "$50,000",
    firm: "BlackRock",
    tags: ["Private Equity", "Continuous Offering"],
    featured: false
  },
  {
    id: 9,
    name: "BlackRock Private Investments Fund iCapital Offshore Access Fund, L.P.",
    description: "BlackRock Private Investments Fund offers access to institutional-quality private equity investments through a continuously offered fund structure, providing a robust private markets solution.",
    minimumInvestment: "$100,000",
    firm: "BlackRock",
    tags: ["Private Equity", "Institutional", "Offshore"],
    featured: false
  },
  {
    id: 10,
    name: "Bonaccord Capital Partners Fund III",
    description: "Bonaccord Capital Partners Fund III is a middle-market GP stakes fund focusing on growth capital investments in mid-market private sponsors across private equity, private credit, real estate, and real assets. It aims to deliver attractive risk-adjusted returns driven by both elevated yields and capital appreciation.",
    minimumInvestment: "$500,000",
    firm: "Aberdeen Standard Investments",
    tags: ["Private Equity", "GP Stakes", "Middle Market"],
    featured: false
  }
];

export const PrivateMarketsTab = () => {
  const handleLike = (assetName: string) => {
    console.log(`Liked asset: ${assetName}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" className="flex items-center gap-2 p-0">
              <ChevronLeft className="h-4 w-4" />
              Back to Categories
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-white">Private Equity</h1>
          <p className="text-gray-400 mt-1">Assets (10)</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-300">
          Investments in private companies or buyouts of public companies resulting in a delisting of public equity.
        </p>
      </div>

      <div className="space-y-6">
        {privateEquityOfferings.map((offering) => (
          <Card key={offering.id} className="bg-gray-900 border-gray-700 text-white">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl text-white">{offering.name}</CardTitle>
                    {offering.featured && (
                      <Badge className="bg-yellow-500 text-black font-medium">Featured</Badge>
                    )}
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-4">{offering.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {offering.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-6">
                  <InterestedButton assetName={offering.name} onInterested={() => handleLike(offering.name)} />
                  <ScheduleMeetingDialog assetName={offering.name} />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-400">Minimum Investment</p>
                  <p className="text-lg font-semibold text-white">{offering.minimumInvestment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Firm</p>
                  <p className="text-lg font-medium text-white">{offering.firm}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
