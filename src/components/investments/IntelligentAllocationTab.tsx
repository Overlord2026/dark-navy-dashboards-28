import React, { useState } from "react";
import { toast } from "sonner";
import { PortfolioFilterDialog } from "./PortfolioFilterDialog";
import { IntelligentAllocationHeader } from "./IntelligentAllocationHeader";
import { PortfolioDesktopTable } from "./PortfolioDesktopTable";
import { PortfolioTabletTable } from "./PortfolioTabletTable";
import { PortfolioMobileCards } from "./PortfolioMobileCards";
import { InvestmentFilters } from "./InvestmentFilters";
import { StrategyDetailModal, StrategyDetails } from "./StrategyDetailModal";
import { StrategyComparisonModal } from "./StrategyComparisonModal";
import { useInvestmentStrategies } from "@/hooks/useInvestmentStrategies";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScheduleMeetingDialog } from "./ScheduleMeetingDialog";
import { GanttChart, Award } from "lucide-react";
import { useUser } from "@/context/UserContext";

export const IntelligentAllocationTab = () => {
  const { userProfile } = useUser();
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyDetails | null>(null);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [scheduleMeetingOpen, setScheduleMeetingOpen] = useState(false);
  const [selectedStrategies, setSelectedStrategies] = useState<StrategyDetails[]>([]);
  const [selectedStrategyName, setSelectedStrategyName] = useState("");

  // Use the investment strategies hook
  const {
    filteredStrategies,
    recommendedStrategies,
    loading,
    searchTerm,
    setSearchTerm,
    selectedRiskLevel,
    setSelectedRiskLevel,
    selectedInvestmentType,
    setSelectedInvestmentType,
    selectedTimeHorizon,
    setSelectedTimeHorizon,
    filterOptions,
    clearFilters,
    activeFilterCount,
    trackEngagement,
    educationalContent
  } = useInvestmentStrategies(userProfile?.client_segment);

  // Convert strategies to portfolio models format
  const convertToPortfolioModel = (strategy: any) => ({
    ...strategy,
    type: strategy.strategy_type,
    createdDate: strategy.created_at,
    updatedDate: strategy.updated_at
  });

  const portfolioModels = filteredStrategies.map(convertToPortfolioModel);

  const handleFindPortfolios = () => {
    setFilterDialogOpen(true);
  };

  const handleModelRowClick = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter(id => id !== modelId));
      toast.info(`Deselected model: ${filteredStrategies.find(m => m.id === modelId)?.name}`);
    } else {
      setSelectedModels([...selectedModels, modelId]);
      toast.info(`Selected model: ${filteredStrategies.find(m => m.id === modelId)?.name}`);
    }
  };

  const handleViewDetails = (strategy: StrategyDetails) => {
    setSelectedStrategy({
      ...strategy,
      educationalContent: educationalContent[strategy.id] || []
    });
    setDetailModalOpen(true);
    trackEngagement(strategy.id, 'view_details');
  };

  const handleCompare = () => {
    if (selectedModels.length < 2) {
      toast.error("Please select at least 2 strategies to compare");
      return;
    }

    if (selectedModels.length > 3) {
      toast.warning("You can compare up to 3 strategies at once");
      setSelectedModels(selectedModels.slice(0, 3));
    }

    const strategiesToCompare = filteredStrategies.filter(s => 
      selectedModels.includes(s.id)
    );

    setSelectedStrategies(strategiesToCompare);
    setComparisonModalOpen(true);
  };

  const handleScheduleMeeting = (strategy?: StrategyDetails) => {
    if (strategy) {
      setSelectedStrategyName(strategy.name);
      trackEngagement(strategy.id, 'schedule_meeting');
    } else if (selectedStrategy) {
      setSelectedStrategyName(selectedStrategy.name);
      trackEngagement(selectedStrategy.id, 'schedule_meeting');
    }
    setScheduleMeetingOpen(true);
    setDetailModalOpen(false);
    setComparisonModalOpen(false);
  };

  const handleExpressInterest = () => {
    if (selectedStrategy) {
      toast.success(`You've expressed interest in ${selectedStrategy.name}`);
      trackEngagement(selectedStrategy.id, 'express_interest');
    }
    setDetailModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <IntelligentAllocationHeader onFindPortfolios={handleFindPortfolios} />

      {/* Recommendations Section (if user has a segment) */}
      {recommendedStrategies.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" />
              Recommended for You
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedStrategies.slice(0, 3).map(strategy => (
              <div 
                key={strategy.id}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg border border-slate-700 p-4 cursor-pointer transition-all duration-200"
                onClick={() => handleViewDetails(strategy)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-semibold">{strategy.name}</h4>
                    <span className="text-emerald-400 font-medium">{strategy.performance}</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-3 flex-grow">{strategy.description || `${strategy.allocation} allocation managed by ${strategy.manager}`}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 text-xs">
                      {strategy.strategy_type}
                    </Badge>
                    <Badge variant="outline" className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs">
                      {strategy.risk_level}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <InvestmentFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        riskLevels={filterOptions.riskLevels}
        selectedRiskLevel={selectedRiskLevel}
        onRiskLevelChange={setSelectedRiskLevel}
        investmentTypes={filterOptions.investmentTypes}
        selectedInvestmentType={selectedInvestmentType}
        onInvestmentTypeChange={setSelectedInvestmentType}
        timeHorizons={filterOptions.timeHorizons}
        selectedTimeHorizon={selectedTimeHorizon}
        onTimeHorizonChange={setSelectedTimeHorizon}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Compare Button */}
      {selectedModels.length >= 2 && (
        <div className="flex justify-end">
          <Button 
            onClick={handleCompare}
            className="bg-primary hover:bg-primary/90"
          >
            <GanttChart className="h-4 w-4 mr-2" />
            Compare Selected ({selectedModels.length})
          </Button>
        </div>
      )}

      {/* Tables */}
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

      {/* Modals */}
      <PortfolioFilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen} 
      />

      {selectedStrategy && (
        <StrategyDetailModal 
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          strategy={selectedStrategy}
          onScheduleMeeting={() => handleScheduleMeeting()}
          onExpressInterest={handleExpressInterest}
        />
      )}

      <StrategyComparisonModal 
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        strategies={selectedStrategies}
        onScheduleMeeting={handleScheduleMeeting}
      />

      {scheduleMeetingOpen && (
        <ScheduleMeetingDialog
          assetName={selectedStrategyName}
        />
      )}
    </div>
  );
};
