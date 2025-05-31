
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { HorizontalOfferingCard } from "@/components/investments/HorizontalOfferingCard";

const PrivateEquity = () => {
  const navigate = useNavigate();
  
  const offerings = [
    {
      title: "AMG Pantheon Fund, LLC",
      description: "AMG Pantheon Fund, LLC provides Accredited Investors unique exposure to a diversified private equity portfolio sourced by Pantheon's Global Investment Team. The Fund offers diversification by manager, stage, vintage year, and industry through a single allocation.",
      tags: ["Private Equity", "Multi-Strategy", "Fund-of-Funds"],
      minimumInvestment: "$250,000",
      firm: "AMG Pantheon",
      featured: true
    }
  ];
  
  return (
    <ThreeColumnLayout activeMainItem="investments" title="">
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/client-investments?tab=private-markets")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Private Markets
          </Button>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Private Equity Investments</h1>
          <p className="text-muted-foreground text-lg">
            Explore exclusive private equity investment opportunities with institutional-quality access and potential for significant long-term growth.
          </p>
        </div>
        
        <div className="space-y-4">
          {offerings.map((offering, index) => (
            <HorizontalOfferingCard
              key={index}
              title={offering.title}
              description={offering.description}
              tags={offering.tags}
              minimumInvestment={offering.minimumInvestment}
              firm={offering.firm}
              featured={offering.featured}
            />
          ))}
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default PrivateEquity;
