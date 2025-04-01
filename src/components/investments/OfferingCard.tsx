
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ExternalLink, DollarSign } from "lucide-react";
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
    <Card key={offering.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-gray-200">
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
            <Badge key={i} variant="outline" className={`text-xs ${i === 0 ? "bg-blue-50" : i === 1 ? "bg-green-50" : "bg-purple-50"}`}>{tag}</Badge>
          ))}
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md flex items-center">
          <DollarSign className="h-5 w-5 text-blue-500 mr-2" />
          <div>
            <p className="text-sm font-semibold text-blue-700">Minimum Investment</p>
            <p className="font-bold text-blue-900">{offering.minimumInvestment}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
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
          {offering.investorQualification && (
            <div>
              <p className="text-sm text-muted-foreground">Investor Type</p>
              <p className="font-medium">{offering.investorQualification}</p>
            </div>
          )}
          {offering.platform && (
            <div>
              <p className="text-sm text-muted-foreground">Platform</p>
              <p className="font-medium">{offering.platform}</p>
            </div>
          )}
          {offering.liquidity && (
            <div>
              <p className="text-sm text-muted-foreground">Liquidity</p>
              <p className="font-medium">{offering.liquidity}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1">View Details</Button>
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
          <ScheduleMeetingDialog assetName={offering.name} />
          <InterestedButton assetName={offering.name} />
        </div>
      </CardContent>
    </Card>
  );
};
