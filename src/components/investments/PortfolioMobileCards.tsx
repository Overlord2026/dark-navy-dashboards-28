
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InterestedButton } from "./InterestedButton";
import { ScheduleMeetingDialog } from "./ScheduleMeetingDialog";
import { PortfolioModel } from "./data/portfolioModels";

interface PortfolioMobileCardsProps {
  models: PortfolioModel[];
  selectedModels: string[];
  onModelRowClick: (modelId: string) => void;
}

export const PortfolioMobileCards = ({ models, selectedModels, onModelRowClick }: PortfolioMobileCardsProps) => {
  return (
    <div className="space-y-4 md:hidden">
      {models.map((model) => (
        <Card 
          key={model.id} 
          className={`cursor-pointer transition-colors hover:bg-accent/10 ${selectedModels.includes(model.id) ? 'bg-primary/5 border-primary/20' : ''}`}
          onClick={() => onModelRowClick(model.id)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm leading-tight">{model.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${model.type === 'Model' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}
                    >
                      {model.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{model.updatedDate}</p>
                  </div>
                </div>
                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium ml-2">
                  {model.allocation}
                </div>
              </div>

              {/* Benchmark */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Benchmark:</span>
                <span className="text-xs">{model.benchmark}</span>
              </div>

              {/* Tags */}
              <div className="flex gap-1 flex-wrap">
                {model.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/5 text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                <InterestedButton assetName={model.name} />
                <ScheduleMeetingDialog assetName={model.name} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
