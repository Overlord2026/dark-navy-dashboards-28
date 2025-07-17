
import React from "react";
import { Badge } from "@/components/ui/badge";
import { InterestedButton } from "./InterestedButton";
import { ScheduleMeetingDialog } from "./ScheduleMeetingDialog";
import { PortfolioModel } from "./data/portfolioModels";
import { StrategyDetails } from "./StrategyDetailModal";

interface PortfolioDesktopTableProps {
  models: PortfolioModel[];
  selectedModels: string[];
  onModelRowClick: (modelId: string) => void;
  onViewDetails?: (strategy: StrategyDetails) => void;
}

export const PortfolioDesktopTable = ({ models, selectedModels, onModelRowClick }: PortfolioDesktopTableProps) => {
  return (
    <div className="bg-card rounded-lg border shadow-md overflow-hidden hidden lg:block">
      <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 text-sm font-medium">
        <div className="col-span-4">NAME</div>
        <div className="col-span-1 text-center">TARGETS</div>
        <div className="col-span-2">UPDATED</div>
        <div className="col-span-2">BENCHMARK</div>
        <div className="col-span-3">ACTION</div>
      </div>
      
      {models.map((model) => (
        <div 
          key={model.id} 
          className={`grid grid-cols-12 gap-4 p-4 border-t items-center hover:bg-accent/10 transition-colors cursor-pointer ${selectedModels.includes(model.id) ? 'bg-primary/5' : ''}`}
          onClick={() => onModelRowClick(model.id)}
        >
          <div className="col-span-4">
            <div className="font-medium">{model.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="outline" 
                className={`text-xs ${model.type === 'Model' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
              >
                {model.type}
              </Badge>
              <div className="flex gap-1 flex-wrap">
                {model.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/5 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-1 flex justify-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
              {model.allocation}
            </div>
          </div>
          <div className="col-span-2 text-sm">
            <div className="text-muted-foreground">{model.updatedDate}</div>
          </div>
          <div className="col-span-2 flex items-center">
            <span className="text-sm">{model.benchmark}</span>
          </div>
          <div className="col-span-3 flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
            <div className="w-full">
              <InterestedButton assetName={model.name} />
            </div>
            <div className="w-full">
              <ScheduleMeetingDialog assetName={model.name} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
