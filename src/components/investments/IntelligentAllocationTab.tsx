
import React, { useState } from "react";
import { toast } from "sonner";
import { PortfolioFilterDialog } from "./PortfolioFilterDialog";
import { IntelligentAllocationHeader } from "./IntelligentAllocationHeader";
import { PortfolioDesktopTable } from "./PortfolioDesktopTable";
import { PortfolioTabletTable } from "./PortfolioTabletTable";
import { PortfolioMobileCards } from "./PortfolioMobileCards";
import { portfolioModels } from "./data/portfolioModels";

export const IntelligentAllocationTab = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
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
      <IntelligentAllocationHeader onFindPortfolios={handleFindPortfolios} />

      <PortfolioDesktopTable 
        models={portfolioModels}
        selectedModels={selectedModels}
        onModelRowClick={handleModelRowClick}
      />

      <PortfolioTabletTable 
        models={portfolioModels}
        selectedModels={selectedModels}
        onModelRowClick={handleModelRowClick}
      />

      <PortfolioMobileCards 
        models={portfolioModels}
        selectedModels={selectedModels}
        onModelRowClick={handleModelRowClick}
      />

      <PortfolioFilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen} 
      />
    </div>
  );
};
