
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { InterestedButton } from "./InterestedButton";
import { ScheduleMeetingDialog } from "./ScheduleMeetingDialog";
import { OfferingDetailsTabs } from "./OfferingDetailsTabs";

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

interface OfferingCardProps {
  offering: Offering;
  categoryId: string;
}

export const OfferingCard: React.FC<OfferingCardProps> = ({ offering, categoryId }) => {
  return (
    <Card key={offering.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-xl mb-1">{offering.name}</CardTitle>
            <CardDescription className="line-clamp-2">{offering.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {offering.tags.map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Minimum</p>
            <p className="font-medium">{offering.minimumInvestment}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Performance</p>
            <p className="font-medium text-green-500">{offering.performance}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Lock-up Period</p>
            <p className="font-medium">{offering.lockupPeriod}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Firm</p>
            <p className="font-medium">{offering.firm}</p>
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <Sheet>
            <SheetTrigger asChild>
              <ScheduleMeetingDialog assetName={offering.name} />
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/investments/alternative/${categoryId}`}>
                      <ChevronLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                  <SheetTitle className="text-xl">{offering.name}</SheetTitle>
                </div>
                <SheetDescription>
                  {offering.description}
                </SheetDescription>
              </SheetHeader>
              
              <OfferingDetailsTabs offering={offering} />
            </SheetContent>
          </Sheet>
          <InterestedButton assetName={offering.name} />
        </div>
      </CardContent>
    </Card>
  );
};
