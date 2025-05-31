
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
      name: "Goldman Sachs Structured Notes",
      description: "Customized structured products with defined risk/return profiles based on underlying assets.",
      firm: "Goldman Sachs",
      minimumInvestment: "$10,000",
      performance: "+8.4%",
      lockupPeriod: "3-5 years",
      tags: ["Structured Notes", "Tailored", "Defined Outcome"],
      featured: true
    },
    {
      id: 2,
      name: "JPMorgan Principal Protected Notes",
      description: "Principal-protected structured notes that provide downside protection while participating in market upside. These investments combine the security of principal protection with exposure to various market indices.",
      firm: "JPMorgan Chase",
      minimumInvestment: "$25,000",
      performance: "+7.2%",
      lockupPeriod: "2-4 years",
      tags: ["Principal Protection", "Market-Linked", "Downside Buffer"],
      featured: true
    },
    {
      id: 3,
      name: "Morgan Stanley Buffered PLUS",
      description: "Buffered Performance Leveraged Upside Securities (PLUS) offering enhanced returns on the upside with limited downside risk through a buffer zone that protects against moderate market declines.",
      firm: "Morgan Stanley",
      minimumInvestment: "$15,000",
      performance: "+9.8%",
      lockupPeriod: "2-3 years",
      tags: ["Buffered", "Enhanced Upside", "Market-Linked"]
    },
    {
      id: 4,
      name: "Barclays Autocallable Notes",
      description: "Structured investments that automatically call (redeem) if the underlying asset reaches a predetermined level on specified observation dates, potentially providing above-market returns for sideways or slightly bullish markets.",
      firm: "Barclays",
      minimumInvestment: "$10,000",
      performance: "+6.5%",
      lockupPeriod: "1-2 years",
      tags: ["Autocallable", "Early Redemption", "Enhanced Yield"]
    },
    {
      id: 5,
      name: "Citigroup Callable Yield Notes",
      description: "Income-focused structured products that offer above-market coupon rates with issuer call features, providing investors with enhanced yield potential in exchange for giving the issuer redemption flexibility.",
      firm: "Citigroup",
      minimumInvestment: "$10,000",
      performance: "+5.8%",
      lockupPeriod: "1-3 years",
      tags: ["Income", "Callable", "Enhanced Yield"],
      featured: true
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
