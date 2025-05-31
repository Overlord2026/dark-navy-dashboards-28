
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PortfolioFilterDialog } from "./PortfolioFilterDialog";
import { InterestedButton } from "./InterestedButton";
import { ScheduleMeetingDialog } from "./ScheduleMeetingDialog";

interface PortfolioModel {
  id: string;
  name: string;
  type: "Model" | "Sleeve";
  allocation: string;
  benchmark: string;
  createdDate: string;
  updatedDate: string;
  tags: string[];
  performance: string;
  manager: string;
}

const portfolioModels: PortfolioModel[] = [
  {
    id: "model1",
    name: "Domestic Core Equity Strategy",
    type: "Sleeve",
    allocation: "100/0",
    benchmark: "SPDR S&P 500",
    createdDate: "Aug 23, 2024",
    updatedDate: "7 Months Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+15.2%",
    manager: "Advanced Wealth Management"
  },
  {
    id: "model2",
    name: "Aggressive Growth Strategy SMH",
    type: "Sleeve",
    allocation: "100/0",
    benchmark: "SPDR S&P 500",
    createdDate: "Jun 28, 2024",
    updatedDate: "9 Months Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+22.7%",
    manager: "Advanced Wealth Management"
  },
  {
    id: "model3",
    name: "Bitcoin ETF Core Sleeve",
    type: "Sleeve",
    allocation: "100/0",
    benchmark: "SPDR S&P 500",
    createdDate: "Jun 7, 2024",
    updatedDate: "10 Months Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+134.2%",
    manager: "Advanced Wealth Management"
  },
  {
    id: "model4",
    name: "Domestic Aggressive 90 Equity/ 10 FI",
    type: "Model",
    allocation: "90/10",
    benchmark: "SPY90AGG10",
    createdDate: "Apr 26, 2023",
    updatedDate: "Almost 2 Years Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+18.9%",
    manager: "Finiat"
  },
  {
    id: "model5",
    name: "Domestic Conservative+ 65 Equity / 35 FI",
    type: "Model",
    allocation: "65/35",
    benchmark: "SPY65AGG35",
    createdDate: "Apr 26, 2023",
    updatedDate: "Almost 2 Years Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+12.3%",
    manager: "Finiat"
  },
  {
    id: "model6",
    name: "Domestic Equity Bit10 SMH10",
    type: "Model",
    allocation: "100/0",
    benchmark: "SPDR S&P 500",
    createdDate: "Jun 28, 2024",
    updatedDate: "9 Months Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+25.4%",
    manager: "Advanced Wealth Management"
  }
];

export const IntelligentAllocationTab = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const handleFindPortfolios = () => {
    setFilterDialogOpen(true);
  };

  const handleModelRowClick = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter(id => id !== modelId));
      toast.info(`Deselected model: ${portfolioModels.find(m => m.id === modelId)?.name}`);
    } else {
      setSelectedModels([...selectedModels, modelId]);
      toast.info(`Selected model: ${portfolioModels.find(m => m.id === modelId)?.name}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Intelligent Allocation™</h2>
          <p className="text-muted-foreground">Professionally managed portfolio models</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleFindPortfolios} className="flex-1 sm:flex-none">
            <Filter className="mr-1 h-4 w-4" /> Find Portfolios
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="bg-card rounded-lg border shadow-md overflow-hidden hidden lg:block">
        <div className="grid grid-cols-12 gap-2 p-4 bg-muted/50 text-sm font-medium">
          <div className="col-span-4">NAME</div>
          <div className="col-span-1 text-center">TARGETS</div>
          <div className="col-span-2">UPDATED</div>
          <div className="col-span-2">BENCHMARK</div>
          <div className="col-span-3">ACTION</div>
        </div>
        
        {portfolioModels.map((model) => (
          <div 
            key={model.id} 
            className={`grid grid-cols-12 gap-2 p-4 border-t items-center hover:bg-accent/10 transition-colors cursor-pointer ${selectedModels.includes(model.id) ? 'bg-primary/5' : ''}`}
            onClick={() => handleModelRowClick(model.id)}
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

      {/* Tablet View */}
      <div className="bg-card rounded-lg border shadow-md overflow-hidden hidden md:block lg:hidden">
        <div className="grid grid-cols-10 gap-2 p-4 bg-muted/50 text-sm font-medium">
          <div className="col-span-3">NAME</div>
          <div className="col-span-1">TARGETS</div>
          <div className="col-span-2">UPDATED</div>
          <div className="col-span-2">BENCHMARK</div>
          <div className="col-span-2">ACTION</div>
        </div>
        
        {portfolioModels.map((model) => (
          <div 
            key={model.id} 
            className={`grid grid-cols-10 gap-2 p-4 border-t items-center hover:bg-accent/10 transition-colors cursor-pointer ${selectedModels.includes(model.id) ? 'bg-primary/5' : ''}`}
            onClick={() => handleModelRowClick(model.id)}
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

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {portfolioModels.map((model) => (
          <Card 
            key={model.id} 
            className={`cursor-pointer transition-colors hover:bg-accent/10 ${selectedModels.includes(model.id) ? 'bg-primary/5 border-primary/20' : ''}`}
            onClick={() => handleModelRowClick(model.id)}
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

      <PortfolioFilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen} 
      />
    </div>
  );
};
