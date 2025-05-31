
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { OfferingCard } from "@/components/investments/OfferingCard";

const PrivateEquity = () => {
  const navigate = useNavigate();
  
  const privateEquityOfferings = [
    {
      id: 1,
      name: "Healthcare Growth Partners III",
      description: "Focused on growth-stage healthcare companies with proven business models and strong management teams.",
      firm: "Healthcare Growth Partners",
      minimumInvestment: "$250,000",
      performance: "+18.5%",
      lockupPeriod: "5-7 years",
      tags: ["Healthcare", "Growth", "Mid-Market"],
      featured: true
    },
    {
      id: 2,
      name: "Technology Innovation Fund IV",
      description: "Invests in B2B software companies with recurring revenue models and scalable platforms.",
      firm: "TechVenture Capital",
      minimumInvestment: "$500,000",
      performance: "+22.3%",
      lockupPeriod: "7-10 years",
      tags: ["Technology", "B2B Software", "SaaS"]
    },
    {
      id: 3,
      name: "Consumer Brands Equity Fund",
      description: "Partners with established consumer brands seeking capital for expansion and operational improvements.",
      firm: "Brand Equity Partners",
      minimumInvestment: "$100,000",
      performance: "+14.7%",
      lockupPeriod: "4-6 years",
      tags: ["Consumer", "Brands", "Retail"],
      featured: true
    },
    {
      id: 4,
      name: "Industrial Growth Partners II",
      description: "Focuses on middle-market industrial companies with strong competitive positions.",
      firm: "Industrial Capital Group",
      minimumInvestment: "$1,000,000",
      performance: "+16.9%",
      lockupPeriod: "6-8 years",
      tags: ["Industrial", "Manufacturing", "B2B"]
    },
    {
      id: 5,
      name: "Energy Transition Fund",
      description: "Invests in companies driving the transition to clean energy and sustainable technologies.",
      firm: "Green Energy Ventures",
      minimumInvestment: "$250,000",
      performance: "+19.2%",
      lockupPeriod: "8-12 years",
      tags: ["Energy", "ESG", "Clean Tech"]
    },
    {
      id: 6,
      name: "Financial Services Growth",
      description: "Targets fintech and financial services companies with innovative business models.",
      firm: "FinTech Capital Partners",
      minimumInvestment: "$500,000",
      performance: "+21.1%",
      lockupPeriod: "5-7 years",
      tags: ["FinTech", "Financial Services", "Innovation"]
    }
  ];
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/client-investments?tab=private-markets")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Private Markets
        </Button>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Private Equity Investments</h1>
        <p className="text-muted-foreground text-lg">
          Explore exclusive private equity investment opportunities across various sectors and stages.
          Our carefully curated offerings provide access to institutional-quality investments.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {privateEquityOfferings.map((offering) => (
          <OfferingCard key={offering.id} offering={offering} />
        ))}
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Why Private Equity?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Private equity investments offer the potential for attractive returns through direct ownership 
            in high-quality companies. Our platform provides access to top-tier fund managers and 
            exclusive investment opportunities typically reserved for institutional investors.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Diversification beyond public markets</li>
            <li>Access to experienced fund managers</li>
            <li>Potential for enhanced returns over time</li>
            <li>Direct impact on company operations and strategy</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivateEquity;
