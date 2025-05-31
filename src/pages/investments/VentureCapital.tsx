
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { OfferingCard } from "@/components/investments/OfferingCard";
import { Badge } from "@/components/ui/badge";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const VentureCapital = () => {
  const navigate = useNavigate();
  
  const ventureCapitalOfferings = [
    {
      id: 1,
      name: "Early Stage Technology Fund IV",
      description: "Invests in seed and Series A technology companies with disruptive potential and strong founding teams.",
      firm: "Early Stage Ventures",
      minimumInvestment: "$500,000",
      performance: "+32.8%",
      lockupPeriod: "7-10 years",
      tags: ["Early Stage", "Technology", "Seed"],
      featured: true
    },
    {
      id: 2,
      name: "Healthcare Innovation Fund",
      description: "Focuses on breakthrough healthcare technologies, biotech, and medical device innovations.",
      firm: "HealthTech Ventures",
      minimumInvestment: "$250,000",
      performance: "+28.4%",
      lockupPeriod: "8-12 years",
      tags: ["Healthcare", "Biotech", "Innovation"]
    },
    {
      id: 3,
      name: "Fintech Growth Capital Fund",
      description: "Targets late-stage fintech companies with proven business models and scalable technology platforms.",
      firm: "Fintech Growth Partners",
      minimumInvestment: "$1,000,000",
      performance: "+24.6%",
      lockupPeriod: "5-7 years",
      tags: ["Fintech", "Growth Stage", "B2B"],
      featured: true
    },
    {
      id: 4,
      name: "Clean Energy Ventures Fund",
      description: "Invests in early-stage companies developing clean energy solutions and sustainability technologies.",
      firm: "Clean Energy VC",
      minimumInvestment: "$500,000",
      performance: "+36.2%",
      lockupPeriod: "8-10 years",
      tags: ["Clean Energy", "ESG", "Deep Tech"]
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
                <h2 className="text-2xl font-semibold">Venture Capital</h2>
              </div>
              <p className="text-muted-foreground text-base">
                Investments in early-stage and growth companies with high potential for innovation and market disruption
              </p>
              
              <div className="grid grid-cols-1 gap-6 mb-8">
                {ventureCapitalOfferings.map((offering) => (
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

export default VentureCapital;
