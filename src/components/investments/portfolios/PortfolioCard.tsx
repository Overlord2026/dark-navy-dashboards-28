
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { PortfolioModel } from "@/data/investments/portfolioModels";

interface PortfolioCardProps {
  portfolio: PortfolioModel;
  onViewDetails: (e: React.MouseEvent, portfolio: PortfolioModel) => void;
  onScheduleAppointment: (e: React.MouseEvent, portfolioName: string) => void;
  onClick: () => void;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ 
  portfolio, 
  onViewDetails, 
  onScheduleAppointment,
  onClick
}) => {
  return (
    <div 
      className="bg-card hover:bg-accent text-card-foreground rounded-lg border shadow-sm p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Briefcase className="h-10 w-10 text-blue-500" />
          <Badge 
            className={`bg-${portfolio.badge.color}-50 text-${portfolio.badge.color}-700 dark:bg-${portfolio.badge.color}-900 dark:text-${portfolio.badge.color}-300 border-${portfolio.badge.color}-200 dark:border-${portfolio.badge.color}-800`}
          >
            {portfolio.badge.text}
          </Badge>
        </div>
        <div>
          <h4 className="text-lg font-medium">{portfolio.name}</h4>
          <p className="text-muted-foreground text-sm mt-1">{portfolio.description}</p>
          <p className="text-xs text-blue-600 mt-1">Provider: {portfolio.provider}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
          <div>
            <p className="text-muted-foreground">Return (5Y)</p>
            <p className="font-medium text-emerald-500">{portfolio.returnRate}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Risk Level</p>
            <p className="font-medium">{portfolio.riskLevel}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            size="sm" 
            className="w-full mt-2"
            onClick={(e) => onViewDetails(e, portfolio)}
          >
            View Details
          </Button>
          <Button 
            variant="outline"
            size="sm" 
            className="w-full mt-2"
            onClick={(e) => onScheduleAppointment(e, portfolio.name)}
          >
            <CalendarClock className="h-3 w-3 mr-1" /> Consult
          </Button>
        </div>
      </div>
    </div>
  );
};
