
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { OfferingCard } from "@/components/investments/OfferingCard";
import { Badge } from "@/components/ui/badge";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { adaptLegacyOffering, type LegacyOffering } from "@/utils/investmentDataAdapter";

const PrivateDebt = () => {
  const navigate = useNavigate();
  
  const privateDebtOfferings: LegacyOffering[] = [
    {
      id: 1,
      name: "Blackstone Private Credit Fund (\"BCRED\")",
      description: "Blackstone Private Credit Fund (\"BCRED\") is a non-exchange traded business development company (BDC) that expects to invest at least 80% of its total assets in private credit investments, including loans, bonds, and other credit instruments issued in private offerings or by private companies.",
      firm: "Blackstone",
      minimumInvestment: "$25,000",
      performance: "+8.5%",
      lockupPeriod: "3-5 years",
      tags: ["BDC", "Private Credit", "Fixed Income"],
      featured: true
    },
    {
      id: 2,
      name: "Blue Owl Credit Income Corp. (OCIC)",
      description: "OCIC is an income-focused private credit strategy that invests primarily in senior secured, floating rate debt of upper middle market companies throughout the United States.",
      firm: "Blue Owl",
      minimumInvestment: "$50,000",
      performance: "+9.2%",
      lockupPeriod: "3-5 years",
      tags: ["Senior Secured", "Floating Rate", "Middle Market"],
      featured: true
    },
    {
      id: 3,
      name: "Blue Owl Technology Income Corp. (OTIC)",
      description: "OTIC seeks to provide an efficient, risk-adjusted approach to investing in the rapidly growing software and technology sector, constructing a diversified portfolio of senior secured floating rate loans and, to a lesser extent, equity investments.",
      firm: "Blue Owl",
      minimumInvestment: "$50,000",
      performance: "+10.1%",
      lockupPeriod: "4-6 years",
      tags: ["Technology", "Software", "Senior Secured"],
      featured: true
    },
    {
      id: 4,
      name: "CAIS Monroe PCF V (Onshore), L.P.",
      description: "CAIS Monroe PCF V (Onshore), L.P. will invest substantially all of its assets into Monroe Capital Private Credit Fund V, focusing on senior secured loans, unitranche, and opportunistic investments in lower middle market companies based in North America.",
      firm: "Monroe Capital",
      minimumInvestment: "$100,000",
      performance: "+8.8%",
      lockupPeriod: "5-7 years",
      tags: ["Lower Middle Market", "Unitranche", "North America"],
      featured: true
    },
    {
      id: 5,
      name: "KKR FS Income Trust (\"K-FIT\")",
      description: "K-FIT is a privately offered BDC that provides direct access to KKR's extensive Private Credit Platform, targeting allocations to both corporate direct lending and asset-based finance.",
      firm: "KKR",
      minimumInvestment: "$50,000",
      performance: "+9.5%",
      lockupPeriod: "3-5 years",
      tags: ["BDC", "Direct Lending", "Asset-Based Finance"],
      featured: true
    },
    {
      id: 6,
      name: "ACRE Credit II Offshore LP",
      description: "ACRE Credit Offshore II is an investment fund based in the Cayman Islands, raised from multiple investors with a focus on providing credit solutions with a minimum investment requirement.",
      firm: "Asia Capital Real Estate",
      minimumInvestment: "$250,000",
      performance: "+7.9%",
      lockupPeriod: "4-6 years",
      tags: ["Offshore", "Cayman Islands", "Credit Solutions"]
    },
    {
      id: 7,
      name: "ACRE Credit Partners II LP",
      description: "ACRE Credit Partners II is a real estate debt fund managed by Asia Capital Real Estate, focused on delivering credit solutions in the real estate sector.",
      firm: "Asia Capital Real Estate",
      minimumInvestment: "$250,000",
      performance: "+8.3%",
      lockupPeriod: "5-7 years",
      tags: ["Real Estate Debt", "Credit Solutions"]
    },
    {
      id: 8,
      name: "AG Twin Brook Capital Income Fund (\"TCAP\")",
      description: "TCAP's objective is to generate consistent total returns through investments in private debt opportunities, targeting attractive risk-adjusted returns primarily via current income.",
      firm: "Angelo Gordon",
      minimumInvestment: "$100,000",
      performance: "+8.1%",
      lockupPeriod: "3-5 years",
      tags: ["Current Income", "Consistent Returns", "Private Debt"]
    },
    {
      id: 9,
      name: "Apollo Asset Backed Credit Company LLC",
      description: "Apollo Asset Backed Credit Company is a turnkey solution offering access to high-quality, asset-backed instruments across diverse sectors to generate yield in excess of publicly traded credit.",
      firm: "Apollo Global Management",
      minimumInvestment: "$100,000",
      performance: "+9.7%",
      lockupPeriod: "4-6 years",
      tags: ["Asset-Backed", "High Yield", "Diverse Sectors"]
    },
    {
      id: 10,
      name: "Apollo Debt Solutions BDC",
      description: "Apollo Debt Solutions BDC is a registered, non-listed business development company that provides access to exclusive private debt investments, emphasizing senior secured loans and broadly syndicated deals for individual investors.",
      firm: "Apollo Global Management",
      minimumInvestment: "$50,000",
      performance: "+8.9%",
      lockupPeriod: "3-5 years",
      tags: ["BDC", "Senior Secured", "Broadly Syndicated"]
    },
    {
      id: 11,
      name: "Cliffwater Corporate Lending Fund",
      description: "Focused on direct lending to middle market companies, providing income generation and capital preservation.",
      firm: "Cliffwater LLC",
      minimumInvestment: "$25,000",
      performance: "+7.8%",
      lockupPeriod: "3-5 years",
      tags: ["Direct Lending", "Middle Market", "Income"]
    }
  ];

  // Convert legacy offerings to new format
  const adaptedOfferings = privateDebtOfferings.map(offering => 
    adaptLegacyOffering(offering, 'private-debt')
  );
  
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
                {adaptedOfferings.map((offering) => (
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
