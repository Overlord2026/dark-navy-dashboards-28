
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Clock, Building } from "lucide-react";
import { InterestedButton } from "./InterestedButton";
import { ScheduleMeetingDialog } from "./ScheduleMeetingDialog";

interface OfferingCardProps {
  offering: {
    id: number;
    name: string;
    description: string;
    firm: string;
    minimumInvestment: string;
    performance: string;
    lockupPeriod: string;
    tags: string[];
    featured?: boolean;
  };
}

export const OfferingCard: React.FC<OfferingCardProps> = ({ offering }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{offering.name}</CardTitle>
              {offering.featured && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {offering.description}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {offering.tags.map((tag, i) => (
            <Badge 
              key={i} 
              variant="outline" 
              className="text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="bg-blue-50 p-3 rounded-md">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Minimum Investment</span>
          </div>
          <p className="text-lg font-bold text-blue-900">{offering.minimumInvestment}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-muted-foreground">Performance</p>
              <p className="font-medium text-green-600">{offering.performance}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-muted-foreground">Lock-up</p>
              <p className="font-medium">{offering.lockupPeriod}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Building className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-muted-foreground">Firm</p>
              <p className="font-medium">{offering.firm}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t">
          <Button variant="outline" className="flex-1" size="sm">
            View Details
          </Button>
          <InterestedButton assetName={offering.name} />
          <ScheduleMeetingDialog assetName={offering.name} consultationType="investment" />
        </div>
      </CardContent>
    </Card>
  );
};
