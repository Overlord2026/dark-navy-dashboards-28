
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { OfferingCard } from "@/components/investments/OfferingCard";
import { Badge } from "@/components/ui/badge";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const StructuredInvestments = () => {
  const navigate = useNavigate();
  
  const structuredInvestmentsOfferings = [
    {
      id: 1,
      name: "Market-Linked CD Portfolio",
      description: "Principal-protected certificates of deposit linked to equity market performance with upside potential.",
      firm: "Structured Products Capital",
      minimumInvestment: "$100,000",
      performance: "+8.4%",
      lockupPeriod: "3-5 years",
      tags: ["Principal Protected", "Market Linked", "CDs"],
      featured: true
    },
    {
      id: 2,
      name: "Barrier Reverse Convertible Notes",
      description: "Enhanced yield notes with barrier protection, offering higher income potential with defined risk parameters.",
      firm: "Fixed Income Innovations",
      minimumInvestment: "$250,000",
      performance: "+12.6%",
      lockupPeriod: "1-3 years",
      tags: ["Enhanced Yield", "Barrier Protection", "Notes"]
    },
    {
      id: 3,
      name: "Multi-Asset Autocallable Securities",
      description: "Structured products with automatic early redemption features linked to a basket of underlying assets.",
      firm: "Multi-Asset Structured Solutions",
      minimumInvestment: "$500,000",
      performance: "+10.8%",
      lockupPeriod: "2-6 years",
      tags: ["Autocallable", "Multi-Asset", "Structured"],
      featured: true
    },
    {
      id: 4,
      name: "Commodity-Linked Structured Notes",
      description: "Exposure to commodity markets through structured notes with built-in risk management features.",
      firm: "Commodity Structured Partners",
      minimumInvestment: "$250,000",
      performance: "+14.3%",
      lockupPeriod: "2-4 years",
      tags: ["Commodities", "Structured Notes", "Risk Management"]
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
                <h2 className="text-2xl font-semibold">Structured Investments</h2>
              </div>
              <p className="text-muted-foreground text-base">
                Sophisticated financial instruments combining traditional securities with derivatives to create customized risk-return profiles
              </p>
              
              <div className="grid grid-cols-1 gap-6 mb-8">
                {structuredInvestmentsOfferings.map((offering) => (
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

export default StructuredInvestments;
