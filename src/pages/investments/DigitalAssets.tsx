
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
      name: "Galaxy Bitcoin Fund LP",
      description: "The Galaxy Bitcoin Fund / Galaxy Institutional Bitcoin Fund are low management fee, institutional grade vehicles for bitcoin exposure. They offer streamlined execution, secure third-party custody, familiar reporting, and dedicated client service. The Fund invests directly in bitcoin and is priced based on the Bloomberg Bitcoin Cryptocurrency Fixing Rate (\"XBT\"), aiming to mitigate the complexities of investing in digital assets.",
      firm: "Galaxy Digital",
      minimumInvestment: "$100,000",
      performance: "+67.4%",
      lockupPeriod: "1-3 years",
      tags: ["Bitcoin", "Cryptocurrency", "Institutional Grade"],
      featured: true
    },
    {
      id: 2,
      name: "Galaxy Crypto Index Fund LP",
      description: "The Galaxy Crypto Index Fund seeks to provide diversified, dynamic, institutionally-wrapped exposure to digital assets by tracking and rebalancing monthly to the rules-based Bloomberg Galaxy Crypto Index (ticker: BGCI). It offers institutional-grade exposure while mitigating many of the complexities of digital asset investing.",
      firm: "Galaxy Digital",
      minimumInvestment: "$250,000",
      performance: "+34.8%",
      lockupPeriod: "3-5 years",
      tags: ["Diversified", "Crypto Index", "Monthly Rebalancing"],
      featured: true
    },
    {
      id: 3,
      name: "Galaxy Institutional Bitcoin Fund LP",
      description: "The Galaxy Institutional Bitcoin Fund is designed to provide institutional-quality exposure to bitcoin by investing directly in bitcoin, with pricing based on the Bloomberg Galaxy Bitcoin Index (\"BTC\"). It aims to simplify digital asset investment with outsourced trading, operations, finance, and custody services.",
      firm: "Galaxy Digital",
      minimumInvestment: "$500,000",
      performance: "+28.6%",
      lockupPeriod: "2-4 years",
      tags: ["Bitcoin", "Institutional", "Direct Exposure"],
      featured: true
    },
    {
      id: 4,
      name: "Galaxy Institutional Bitcoin Fund Ltd",
      description: "Galaxy Institutional Bitcoin Fund Ltd provides institutional-quality bitcoin exposure by investing directly in bitcoin, priced based on the Bloomberg Galaxy Bitcoin Index (\"BTC\"). It offers a streamlined and secure approach to digital asset investment with dedicated services for trading and custody.",
      firm: "Galaxy Digital",
      minimumInvestment: "$500,000",
      performance: "+42.1%",
      lockupPeriod: "1-2 years",
      tags: ["Bitcoin", "Offshore", "Institutional"]
    },
    {
      id: 5,
      name: "Galaxy Institutional Ethereum Fund LP",
      description: "The Galaxy Institutional Ethereum Fund provides institutional-grade exposure to ETH by investing directly in Ethereum. It is priced using the Bloomberg Galaxy Ethereum Index, and the Fund is designed to mitigate digital asset investment complexities through outsourced services for trading, operations, and custody.",
      firm: "Galaxy Digital",
      minimumInvestment: "$250,000",
      performance: "+31.2%",
      lockupPeriod: "2-3 years",
      tags: ["Ethereum", "Institutional", "Direct Exposure"],
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
