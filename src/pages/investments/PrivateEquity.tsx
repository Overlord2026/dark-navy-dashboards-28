
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { OfferingCard } from "@/components/investments/OfferingCard";
import { Badge } from "@/components/ui/badge";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { adaptLegacyOffering, type LegacyOffering } from "@/utils/investmentDataAdapter";

const PrivateEquity = () => {
  const navigate = useNavigate();
  
  const privateEquityOfferings: LegacyOffering[] = [
    {
      id: 1,
      name: "AMG Pantheon Fund, LLC",
      description: "AMG Pantheon Fund, LLC provides Accredited Investors unique exposure to a diversified private equity portfolio sourced by Pantheon's Global Investment Team. The Fund offers diversification by manager, stage, vintage year, and industry through a single allocation.",
      firm: "Pantheon Ventures",
      minimumInvestment: "$50,000",
      performance: "+18.5%",
      lockupPeriod: "5-7 years",
      tags: ["Private Equity", "Global", "Diversified"],
      featured: true
    },
    {
      id: 2,
      name: "Ares Private Markets Fund",
      description: "Ares Private Markets Fund ('The Fund') seeks to build a diversified private equity investment solution that aims to deliver attractive, long-term capital appreciation. It features dynamic allocation, which aims to reduce the J-curve and vintage risk, and offers enhanced diversification across managers and investments.",
      firm: "Ares Management",
      minimumInvestment: "$100,000",
      performance: "+22.3%",
      lockupPeriod: "7-10 years",
      tags: ["Private Equity", "Diversified", "Dynamic Allocation"],
      featured: true
    },
    {
      id: 3,
      name: "Blackstone Private Equity Strategies Fund, (TE) L.P. ('BXPE Tax-Exempt')",
      description: "BXPE seeks to provide qualified individual investors broad exposure to Blackstone's private equity platform and its 15+ strategies through a single fund. Blackstone is the world's largest alternatives asset manager, and BXPE leverages its immense scale and expertise.",
      firm: "Blackstone",
      minimumInvestment: "$250,000",
      performance: "+24.7%",
      lockupPeriod: "8-12 years",
      tags: ["Private Equity", "Multi-Strategy", "Tax-Exempt"],
      featured: true
    },
    {
      id: 4,
      name: "CAIS Vista Foundation Fund V, L.P.",
      description: "Vista Foundation Fund V, L.P. ('VFF V') was formed by Vista Equity Partners Management, LLC to acquire controlling interests in middle-market and 'Mid Cap' enterprise software, data, and technology-enabled solutions companies. It targets companies with enterprise values between $250 million and $750 million+.",
      firm: "Vista Equity Partners",
      minimumInvestment: "$500,000",
      performance: "+26.9%",
      lockupPeriod: "7-10 years",
      tags: ["Private Equity", "Technology", "Middle Market"],
      featured: true
    },
    {
      id: 5,
      name: "JP Morgan Private Markets Fund",
      description: "JP Morgan Private Markets Fund has a small mid-market private equity focus, offering multi-manager exposure with simplified structure and terms, backed by the extensive resources of one of the largest financial institutions in the world.",
      firm: "JP Morgan",
      minimumInvestment: "$250,000",
      performance: "+19.2%",
      lockupPeriod: "6-8 years",
      tags: ["Private Equity", "Mid Market", "Multi-Manager"],
      featured: true
    },
    {
      id: 6,
      name: "AMG Pantheon Fund, LLC (Class 1)",
      description: "AMG Pantheon Fund, LLC (Class 1) seeks to provide Accredited Investors exposure to a diversified private equity portfolio with diversification by manager, stage, vintage year, and industry. It features a lower investment minimum, a perpetual 'evergreen' strategy, and enhanced potential liquidity.",
      firm: "Pantheon Ventures",
      minimumInvestment: "$25,000",
      performance: "+16.5%",
      lockupPeriod: "Evergreen",
      tags: ["Private Equity", "Global", "Evergreen"]
    },
    {
      id: 7,
      name: "Ares Private Markets Fund iCapital Offshore Access Fund SP 1",
      description: "Ares Private Markets Fund (APMF) is a diversified private equity investment solution, anchored in secondary investments, designed to deliver attractive long-term capital appreciation through market cycles.",
      firm: "Ares Management",
      minimumInvestment: "$100,000",
      performance: "+20.1%",
      lockupPeriod: "5-7 years",
      tags: ["Private Equity", "Secondaries", "Offshore"]
    },
    {
      id: 8,
      name: "BlackRock Private Investment Fund",
      description: "BlackRock Private Investments Fund ('BPIF') provides access to private equity investments, especially during periods when public market returns are muted, and aims to amplify investor returns through continuous offering.",
      firm: "BlackRock",
      minimumInvestment: "$50,000",
      performance: "+17.8%",
      lockupPeriod: "Continuous",
      tags: ["Private Equity", "Continuous Offering"]
    },
    {
      id: 9,
      name: "BlackRock Private Investments Fund iCapital Offshore Access Fund, L.P.",
      description: "BlackRock Private Investments Fund offers access to institutional-quality private equity investments through a continuously offered fund structure, providing a robust private markets solution.",
      firm: "BlackRock",
      minimumInvestment: "$100,000",
      performance: "+18.3%",
      lockupPeriod: "Continuous",
      tags: ["Private Equity", "Institutional", "Offshore"]
    },
    {
      id: 10,
      name: "Bonaccord Capital Partners Fund III",
      description: "Bonaccord Capital Partners Fund III is a middle-market GP stakes fund focusing on growth capital investments in mid-market private sponsors across private equity, private credit, real estate, and real assets. It aims to deliver attractive risk-adjusted returns driven by both elevated yields and capital appreciation.",
      firm: "Aberdeen Standard Investments",
      minimumInvestment: "$500,000",
      performance: "+21.4%",
      lockupPeriod: "7-9 years",
      tags: ["Private Equity", "GP Stakes", "Middle Market"]
    }
  ];

  // Convert legacy offerings to new format
  const adaptedOfferings = privateEquityOfferings.map(offering => 
    adaptLegacyOffering(offering, 'private-equity')
  );
  
  return (
    <ThreeColumnLayout activeMainItem="investments" title="Investment Management" secondaryMenuItems={[]}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-base">
            Explore a curated selection of investment options tailored to your financial goals. 
            Our solutions range from model portfolios to exclusive alternative assets.
          </p>
        </div>

        <Tabs value="private-markets" className="w-full">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="intelligent-alloc" className="flex-1" onClick={() => navigate("/client-investments?tab=intelligent-alloc")}>
              Intelligent Alloc.
            </TabsTrigger>
            <TabsTrigger value="private-markets" className="flex-1">
              Private Markets
            </TabsTrigger>
            <TabsTrigger value="bfo-models" className="flex-1 relative cursor-not-allowed opacity-60" disabled>
              <span className="flex items-center gap-2">
                BFO Models
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                  Coming Soon
                </Badge>
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="private-markets" className="space-y-8">
            <div className="space-y-6">
              <div className="mb-8 flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/client-investments?tab=private-markets")}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-2xl font-semibold">Private Equity Investments</h2>
              </div>
              <p className="text-muted-foreground text-base">
                Investments in private companies or buyouts of public companies resulting in a delisting of public equity
              </p>
              
              <div className="grid grid-cols-1 gap-6 mb-8">
                {adaptedOfferings.map((offering) => (
                  <OfferingCard key={offering.id} offering={offering} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default PrivateEquity;
