
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
      name: "Fine Art Investment Fund",
      description: "Curated portfolio of museum-quality artworks from established and emerging artists with strong market demand.",
      firm: "Art Capital Partners",
      minimumInvestment: "$250,000",
      performance: "+13.7%",
      lockupPeriod: "3-5 years",
      tags: ["Fine Art", "Museum Quality", "Blue Chip"],
      featured: true
    },
    {
      id: 2,
      name: "Vintage Wine Collection Fund",
      description: "Investment in rare and collectible wines from premier vineyards with proven appreciation potential.",
      firm: "Wine Investment Group",
      minimumInvestment: "$100,000",
      performance: "+11.2%",
      lockupPeriod: "5-10 years",
      tags: ["Wine", "Collectibles", "Vintage"]
    },
    {
      id: 3,
      name: "Classic Automobiles Fund",
      description: "Portfolio of classic and vintage automobiles with strong collector demand and historical significance.",
      firm: "Classic Car Capital",
      minimumInvestment: "$500,000",
      performance: "+18.9%",
      lockupPeriod: "3-7 years",
      tags: ["Classic Cars", "Vintage", "Collectibles"],
      featured: true
    },
    {
      id: 4,
      name: "Luxury Collectibles Fund",
      description: "Diversified investments in luxury watches, jewelry, rare books, and other high-value collectibles.",
      firm: "Luxury Assets Management",
      minimumInvestment: "$250,000",
      performance: "+15.4%",
      lockupPeriod: "2-5 years",
      tags: ["Luxury", "Watches", "Rare Items"]
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
