
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { OfferingCard } from "@/components/investments/OfferingCard";
import { Badge } from "@/components/ui/badge";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const RealAssets = () => {
  const navigate = useNavigate();
  
  const realAssetsOfferings = [
    {
      id: 1,
      name: "Blue Owl Real Estate Net Lease Trust",
      description: "Blue Owl Real Estate Net Lease Trust (ORENT) aims to deliver a resilient real estate strategy by acquiring and managing a diversified portfolio of single-tenant commercial properties that are net leased on long-term contracts to creditworthy tenants. The structure provides tax-advantaged, predictable income distributions.",
      firm: "Blue Owl",
      minimumInvestment: "$50,000",
      performance: "+12.4%",
      lockupPeriod: "5-7 years",
      tags: ["Real Estate", "Net Lease", "Income"],
      featured: true
    },
    {
      id: 2,
      name: "CIM Opportunity Zone Fund, L.P.",
      description: "CIM Opportunity Zone Fund is a low-leverage, open-ended 'develop-to-core' vehicle designed for infrastructure and real estate investments in designated Opportunity Zones. The fund leverages CIM's twenty-year experience in Opportunity Zones and focuses on investments in urban areas.",
      firm: "CIM Group",
      minimumInvestment: "$100,000",
      performance: "+9.8%",
      lockupPeriod: "7-10 years",
      tags: ["Opportunity Zones", "Urban Development", "Tax-Advantaged"],
      featured: true
    },
    {
      id: 3,
      name: "Clarion Ventures Qualified Opportunity Zone Partners",
      description: "Clarion Ventures Qualified Opportunity Zone Partners focuses on real estate investments through a 'Create-to-Core' strategy in designated Qualified Opportunity Zones, leveraging Clarion's expertise in value-add and opportunistic investments.",
      firm: "Clarion Partners",
      minimumInvestment: "$250,000",
      performance: "+8.6%",
      lockupPeriod: "5-8 years",
      tags: ["Opportunity Zones", "Create-to-Core", "Value-Add"]
    },
    {
      id: 4,
      name: "KKR Infrastructure Conglomerate LLC ('K-INFRA')",
      description: "K-INFRA offers investors exposure to private infrastructure opportunities alongside an institutional manager, with a diversified strategy spanning different sectors, geographies, and asset allocations.",
      firm: "KKR",
      minimumInvestment: "$500,000",
      performance: "+14.2%",
      lockupPeriod: "6-9 years",
      tags: ["Infrastructure", "Diversified", "Global"],
      featured: true
    },
    {
      id: 5,
      name: "iCapital Infrastructure Investments Access Fund, L.P.",
      description: "iCapital Infrastructure Investments Access Fund is a diversified portfolio focused on essential services, holding private companies and assets across multiple sectors, providing robust and stable returns.",
      firm: "iCapital",
      minimumInvestment: "$100,000",
      performance: "+11.3%",
      lockupPeriod: "5-8 years",
      tags: ["Infrastructure", "Essential Services", "Stable Returns"]
    },
    {
      id: 6,
      name: "1031 Exchange DSTs",
      description: "1031 Exchange DSTs allow investors who have appreciated real estate to defer taxes by exchanging into like-kind properties, offering a streamlined mechanism to access high-quality commercial real estate investments.",
      firm: "Various Sponsors",
      minimumInvestment: "$25,000",
      performance: "+9.5%",
      lockupPeriod: "3-5 years",
      tags: ["1031 Exchange", "Tax Deferral", "Commercial Real Estate"],
      featured: true
    },
    {
      id: 7,
      name: "Apollo Realty Income Solutions, Inc.",
      description: "Apollo Realty Income Solutions is Apollo's flagship direct real estate income product, designed as a perpetually-offered, non-traded REIT that provides individual investors access to a diversified, income-generating portfolio of commercial properties.",
      firm: "Apollo Global Management",
      minimumInvestment: "$50,000",
      performance: "+10.7%",
      lockupPeriod: "3-5 years",
      tags: ["REIT", "Commercial Real Estate", "Income"],
      featured: true
    },
    {
      id: 8,
      name: "Ares Diversified Real Estate Exchange - Diversified V DST",
      description: "Ares Diversified Real Estate Exchange is a 1031 exchange program enabling investors to transition appreciated real estate into a diversified portfolio of high-quality commercial properties.",
      firm: "Ares Management",
      minimumInvestment: "$100,000",
      performance: "+8.9%",
      lockupPeriod: "4-6 years",
      tags: ["1031 Exchange", "Diversified Portfolio", "Commercial Real Estate"]
    },
    {
      id: 9,
      name: "Ares Industrial Real Estate Exchange - Portfolio 7 DST",
      description: "Ares Industrial Real Estate Exchange is a 1031 exchange option focused on providing investors with access to high-quality industrial properties through a diversified portfolio structure.",
      firm: "Ares Management",
      minimumInvestment: "$100,000",
      performance: "+9.2%",
      lockupPeriod: "4-6 years",
      tags: ["1031 Exchange", "Industrial Real Estate", "Portfolio"]
    },
    {
      id: 10,
      name: "Ares Industrial Real Estate Income Trust Inc.",
      description: "Ares Industrial Real Estate Income Trust is a non-exchange traded REIT offering investors exposure to industrial real estate, focusing on well-leased distribution warehouses and aiming to deliver consistent monthly income distributions.",
      firm: "Ares Management",
      minimumInvestment: "$50,000",
      performance: "+10.1%",
      lockupPeriod: "3-5 years",
      tags: ["REIT", "Industrial Real Estate", "Monthly Income"],
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
                <h2 className="text-2xl font-semibold">Real Assets</h2>
              </div>
              <p className="text-muted-foreground text-base">
                Tangible asset investments including real estate, infrastructure, and natural resources for portfolio diversification
              </p>
              
              <div className="grid grid-cols-1 gap-6 mb-8">
                {realAssetsOfferings.map((offering) => (
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

export default RealAssets;
