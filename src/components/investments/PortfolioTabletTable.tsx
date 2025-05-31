
import React from "react";
import { Badge } from "@/components/ui/badge";
import { InterestedButton } from "./InterestedButton";
import { ScheduleMeetingDialog } from "./ScheduleMeetingDialog";
import { PortfolioModel } from "./data/portfolioModels";

interface PortfolioTabletTableProps {
  models: PortfolioModel[];
  selectedModels: string[];
  onModelRowClick: (modelId: string) => void;
}

export const PortfolioTabletTable = ({ models, selectedModels, onModelRowClick }: PortfolioTabletTableProps) => {
  return (
    <div className="bg-card rounded-lg border shadow-md overflow-hidden hidden md:block lg:hidden">
      <div className="grid grid-cols-10 gap-3 p-4 bg-muted/50 text-sm font-medium">
        <div className="col-span-3">NAME</div>
        <div className="col-span-1">TARGETS</div>
        <div className="col-span-2">UPDATED</div>
        <div className="col-span-2">BENCHMARK</div>
        <div className="col-span-2">ACTION</div>
      </div>
      
      {models.map((model) => (
        <div 
          key={model.id} 
          className={`grid grid-cols-10 gap-3 p-4 border-t items-center hover:bg-accent/10 transition-colors cursor-pointer ${selectedModels.includes(model.id) ? 'bg-primary/5' : ''}`}
          onClick={() => onModelRowClick(model.id)}
        >
          <div className="col-span-3">
            <div className="font-medium text-sm">{model.name}</div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge 
                variant="outline" 
                className={`text-xs ${model.type === 'Model' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
              >
                {model.type}
              </Badge>
              <Badge variant="outline" className="bg-primary/5 text-xs">
                {model.tags[0]}
              </Badge>
              {model.tags.length > 1 && (
                <span className="text-xs text-muted-foreground">+{model.tags.length - 1}</span>
              )}
            </div>
          </div>
          <div className="col-span-1 flex justify-center">
            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
              {model.allocation}
            </div>
          </div>
          <div className="col-span-2 text-xs text-muted-foreground">
            {model.updatedDate}
          </div>
          <div className="col-span-2 flex items-center">
            <span className="text-xs truncate">{model.benchmark}</span>
          </div>
          <div className="col-span-2 flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
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
