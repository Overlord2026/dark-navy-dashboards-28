
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { OfferingCard } from "@/components/investments/OfferingCard";
import { Badge } from "@/components/ui/badge";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const PrivateDebt = () => {
  const navigate = useNavigate();
  
  const privateDebtOfferings = [
    {
      id: 1,
      name: "Senior Credit Opportunities Fund III",
      description: "Focused on senior secured credit investments in middle-market companies with strong cash flows.",
      firm: "Credit Partners Capital",
      minimumInvestment: "$500,000",
      performance: "+9.2%",
      lockupPeriod: "3-5 years",
      tags: ["Senior Secured", "Credit", "Middle Market"],
      featured: true
    },
    {
      id: 2,
      name: "Direct Lending Fund IV",
      description: "Provides direct lending solutions to small and mid-cap companies across various industries.",
      firm: "Direct Capital Management",
      minimumInvestment: "$250,000",
      performance: "+8.7%",
      lockupPeriod: "4-6 years",
      tags: ["Direct Lending", "Mid-Cap", "Diversified"]
    },
    {
      id: 3,
      name: "Distressed Debt Recovery Fund",
      description: "Specializes in distressed debt investments with active workout strategies and value creation.",
      firm: "Distressed Solutions Group",
      minimumInvestment: "$1,000,000",
      performance: "+15.3%",
      lockupPeriod: "2-4 years",
      tags: ["Distressed", "Special Situations", "High Yield"],
      featured: true
    },
    {
      id: 4,
      name: "Mezzanine Capital Fund II",
      description: "Provides mezzanine financing to support growth, acquisitions, and management buyouts.",
      firm: "Mezzanine Investment Partners",
      minimumInvestment: "$500,000",
      performance: "+11.8%",
      lockupPeriod: "5-7 years",
      tags: ["Mezzanine", "Growth Capital", "Hybrid"]
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
                <h2 className="text-2xl font-semibold">Private Debt Investments</h2>
              </div>
              <p className="text-muted-foreground text-base">
                Investments in private credit markets including direct lending, distressed debt, and mezzanine financing
              </p>
              
              <div className="grid grid-cols-1 gap-6 mb-8">
                {privateDebtOfferings.map((offering) => (
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

export default PrivateDebt;
