
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { OfferingCard } from "@/components/investments/OfferingCard";
import { Badge } from "@/components/ui/badge";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const Collectibles = () => {
  const navigate = useNavigate();
  
  const collectiblesOfferings = [
    {
      id: 1,
      name: "Masterworks",
      description: "Masterworks is the first and only platform providing investment products to gain exposure to Contemporary art. Headquartered in New York City, the firm employs over 180 individuals to research, source, and manage a portfolio of blue-chip art. Masterworks has reviewed more than $20 billion of art for its investment vehicles.",
      firm: "Masterworks",
      minimumInvestment: "$15,000",
      performance: "+18.5%",
      lockupPeriod: "3-7 years",
      tags: ["Art", "Contemporary Art", "Blue Chip"],
      featured: true
    },
    {
      id: 2,
      name: "Wine and Spirits Arbitrage Fund \"Vint Diversified Offering II\"",
      description: "Vint runs a tax-advantaged wine and spirits fund, sourcing investment-grade bottles from Europe at a 20-40% discount to US market value, importing them into the US, and selling them in the US market. The fund has historically generated around 24% net returns for investors and is expected to qualify under IRS code section 1202 (QSBS) for a federal income tax exemption on returns after 5 years.",
      firm: "Vint",
      minimumInvestment: "$25,000",
      performance: "+24.0%",
      lockupPeriod: "5+ years",
      tags: ["Wine", "Spirits", "Tax-Advantaged", "Arbitrage"],
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
                <h2 className="text-2xl font-semibold">Collectibles</h2>
              </div>
              <p className="text-muted-foreground text-base">
                Alternative investments in tangible collectible assets including art, wine, classic cars, and luxury items
              </p>
              
              <div className="grid grid-cols-1 gap-6 mb-8">
                {collectiblesOfferings.map((offering) => (
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

export default Collectibles;
