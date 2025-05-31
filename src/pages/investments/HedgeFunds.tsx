
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { OfferingCard } from "@/components/investments/OfferingCard";
import { Badge } from "@/components/ui/badge";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const HedgeFunds = () => {
  const navigate = useNavigate();
  
  const hedgeFundOfferings = [
    {
      id: 1,
      name: "Global Macro Opportunities Fund",
      description: "Systematic global macro strategy utilizing quantitative models and fundamental analysis across markets.",
      firm: "Macro Capital Management",
      minimumInvestment: "$1,000,000",
      performance: "+16.8%",
      lockupPeriod: "1-2 years",
      tags: ["Global Macro", "Systematic", "Multi-Asset"],
      featured: true
    },
    {
      id: 2,
      name: "Long/Short Equity Fund",
      description: "Market-neutral equity strategy with long positions in undervalued stocks and short positions in overvalued securities.",
      firm: "Equity Alpha Partners",
      minimumInvestment: "$500,000",
      performance: "+12.3%",
      lockupPeriod: "6-12 months",
      tags: ["Long/Short", "Market Neutral", "Equity"]
    },
    {
      id: 3,
      name: "Event-Driven Strategies Fund",
      description: "Focuses on corporate events including mergers, acquisitions, spin-offs, and special situations.",
      firm: "Event Capital Group",
      minimumInvestment: "$250,000",
      performance: "+19.7%",
      lockupPeriod: "1-3 years",
      tags: ["Event Driven", "M&A", "Special Situations"],
      featured: true
    },
    {
      id: 4,
      name: "Multi-Strategy Hedge Fund",
      description: "Diversified approach combining multiple hedge fund strategies to optimize risk-adjusted returns.",
      firm: "Multi-Strategy Capital",
      minimumInvestment: "$500,000",
      performance: "+14.5%",
      lockupPeriod: "2-3 years",
      tags: ["Multi-Strategy", "Diversified", "Risk Management"]
    }
  ];
  
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
                <h2 className="text-2xl font-semibold">Hedge Funds</h2>
              </div>
              <p className="text-muted-foreground text-base">
                Alternative investment strategies designed to generate alpha through sophisticated trading and risk management techniques
              </p>
              
              <div className="grid grid-cols-1 gap-6 mb-8">
                {hedgeFundOfferings.map((offering) => (
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

export default HedgeFunds;
