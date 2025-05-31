
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { OfferingCard } from "@/components/investments/OfferingCard";
import { Badge } from "@/components/ui/badge";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const DigitalAssets = () => {
  const navigate = useNavigate();
  
  const digitalAssetsOfferings = [
    {
      id: 1,
      name: "Institutional Crypto Fund",
      description: "Diversified exposure to major cryptocurrencies with institutional-grade security and custody solutions.",
      firm: "Digital Asset Capital",
      minimumInvestment: "$250,000",
      performance: "+67.4%",
      lockupPeriod: "1-3 years",
      tags: ["Bitcoin", "Ethereum", "DeFi"],
      featured: true
    },
    {
      id: 2,
      name: "Blockchain Infrastructure Fund",
      description: "Invests in companies building the infrastructure for the next generation of blockchain technology.",
      firm: "Blockchain Ventures",
      minimumInvestment: "$500,000",
      performance: "+34.8%",
      lockupPeriod: "3-5 years",
      tags: ["Infrastructure", "Layer 1", "Web3"]
    },
    {
      id: 3,
      name: "NFT and Gaming Assets Fund",
      description: "Focuses on non-fungible tokens, gaming assets, and metaverse-related digital investments.",
      firm: "Metaverse Capital Partners",
      minimumInvestment: "$100,000",
      performance: "+28.6%",
      lockupPeriod: "2-4 years",
      tags: ["NFT", "Gaming", "Metaverse"],
      featured: true
    },
    {
      id: 4,
      name: "DeFi Yield Strategies Fund",
      description: "Systematic approach to decentralized finance yield farming and liquidity provision strategies.",
      firm: "DeFi Investment Group",
      minimumInvestment: "$500,000",
      performance: "+42.1%",
      lockupPeriod: "1-2 years",
      tags: ["DeFi", "Yield Farming", "Liquidity"]
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
                <h2 className="text-2xl font-semibold">Digital Assets</h2>
              </div>
              <p className="text-muted-foreground text-base">
                Institutional-grade exposure to cryptocurrencies, blockchain infrastructure, and next-generation digital technologies
              </p>
              
              <div className="grid grid-cols-1 gap-6 mb-8">
                {digitalAssetsOfferings.map((offering) => (
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

export default DigitalAssets;
