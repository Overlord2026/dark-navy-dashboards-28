
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { OfferingCard } from "./OfferingCard";

interface Strategy {
  overview: string;
  approach: string;
  target: string;
  stage: string;
  geography: string;
  sectors: string[];
  expectedReturn: string;
  benchmarks: string[];
}

interface Offering {
  id: number;
  name: string;
  description: string;
  minimumInvestment: string;
  performance: string;
  lockupPeriod: string;
  lockUp: string;
  firm: string;
  tags: string[];
  strategy: Strategy;
  platform?: string;
  category?: string;
  investorQualification?: string;
  liquidity?: string;
  subscriptions?: string;
}

interface OfferingsListProps {
  offerings: Offering[];
  categoryId: string;
}

export const OfferingsList: React.FC<OfferingsListProps> = ({ offerings, categoryId }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Available Offerings</h2>
          <p className="text-sm text-muted-foreground">Current investment opportunities</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offerings.map(offering => (
          <OfferingCard key={offering.id} offering={offering} categoryId={categoryId} />
        ))}
      </div>
    </div>
  );
};
