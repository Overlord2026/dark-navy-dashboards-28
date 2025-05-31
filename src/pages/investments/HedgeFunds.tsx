
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

const HedgeFunds = () => {
  const navigate = useNavigate();
  
  const hedgeFundOfferings: LegacyOffering[] = [
    {
      id: 1,
      name: "Brevan Howard PT Fund LP",
      description: "BHMF is Brevan Howard's flagship fund, launched in April 2003. It pursues a multi-trader model combining macro directional and macro relative value strategies, aiming to deliver compelling, asymmetric returns.",
      firm: "Brevan Howard",
      minimumInvestment: "$5,000,000",
      performance: "+16.8%",
      lockupPeriod: "1-2 years",
      tags: ["Multi-Trader", "Macro Directional", "Macro Relative Value"],
      featured: true
    },
    {
      id: 2,
      name: "CAIS Monroe PCF V (Onshore), L.P.",
      description: "CAIS Monroe PCF V (Onshore), L.P. will invest nearly all of its assets into Monroe Capital Private Credit Fund V, focusing on senior secured loans, unitranche, and opportunistic investments in lower middle market companies in North America.",
      firm: "Monroe Capital",
      minimumInvestment: "$100,000",
      performance: "+12.3%",
      lockupPeriod: "6-12 months",
      tags: ["Senior Secured", "Unitranche", "North America"],
      featured: true
    },
    {
      id: 3,
      name: "KKR FS Income Trust (\"K-FIT\")",
      description: "K-FIT is a privately offered business development company that grants direct access to KKR's comprehensive Private Credit Platform, targeting allocations in corporate direct lending and asset-based finance.",
      firm: "KKR",
      minimumInvestment: "$50,000",
      performance: "+19.7%",
      lockupPeriod: "1-3 years",
      tags: ["BDC", "Direct Lending", "Asset-Based Finance"],
      featured: true
    },
    {
      id: 4,
      name: "ACRE Credit II Offshore LP",
      description: "ACRE Credit Offshore II is an offshore investment fund in the Cayman Islands that focuses on providing innovative credit solutions through its diversified investment approach.",
      firm: "Asia Capital Real Estate",
      minimumInvestment: "$250,000",
      performance: "+14.5%",
      lockupPeriod: "2-3 years",
      tags: ["Offshore", "Cayman Islands", "Credit Solutions"]
    },
    {
      id: 5,
      name: "ACRE Credit Partners II LP",
      description: "ACRE Credit Partners II is a real estate debt fund managed by Asia Capital Real Estate, dedicated to delivering credit solutions in the real estate sector.",
      firm: "Asia Capital Real Estate",
      minimumInvestment: "$250,000",
      performance: "+11.2%",
      lockupPeriod: "2-4 years",
      tags: ["Real Estate Debt", "Credit Solutions"]
    },
    {
      id: 6,
      name: "AG Twin Brook Capital Income Fund (\"TCAP\")",
      description: "TCAP aims to generate attractive, consistent total returns by targeting private debt opportunities with favorable risk-adjusted returns, predominantly through current income.",
      firm: "Angelo Gordon",
      minimumInvestment: "$100,000",
      performance: "+13.8%",
      lockupPeriod: "1-2 years",
      tags: ["Current Income", "Consistent Returns", "Private Debt"]
    },
    {
      id: 7,
      name: "Apollo Asset Backed Credit Company LLC",
      description: "Apollo Asset Backed Credit Company is a semi-liquid turnkey solution providing investors access to high-quality, asset-backed instruments across diverse sectors.",
      firm: "Apollo Global Management",
      minimumInvestment: "$100,000",
      performance: "+15.9%",
      lockupPeriod: "1-3 years",
      tags: ["Asset-Backed", "High Yield", "Diverse Sectors"]
    },
    {
      id: 8,
      name: "Apollo Debt Solutions BDC",
      description: "Apollo Debt Solutions BDC is a registered, non-listed business development company that offers individual investors exclusive access to private debt investments, focusing on senior secured loans and broadly syndicated deals.",
      firm: "Apollo Global Management",
      minimumInvestment: "$50,000",
      performance: "+12.7%",
      lockupPeriod: "1-2 years",
      tags: ["BDC", "Senior Secured", "Broadly Syndicated"]
    }
  ];

  // Convert legacy offerings to new format
  const adaptedOfferings = hedgeFundOfferings.map(offering => 
    adaptLegacyOffering(offering, 'hedge-fund')
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
                <h2 className="text-2xl font-semibold">Hedge Funds</h2>
              </div>
              <p className="text-muted-foreground text-base">
                Alternative investment strategies designed to generate alpha through sophisticated trading and risk management techniques
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

export default HedgeFunds;
