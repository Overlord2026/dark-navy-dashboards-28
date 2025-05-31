
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useBFOModels, PortfolioFilters } from "@/hooks/useBFOModels";
import { Badge } from "@/components/ui/badge";

interface PortfolioPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PortfolioPickerDialog: React.FC<PortfolioPickerDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { filteredPortfolios, assignPortfolio, loading, filterPortfolios, getFilterOptions } = useBFOModels();
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [filters, setFilters] = useState<PortfolioFilters>({});

  const filterOptions = getFilterOptions();

  const handleFilterChange = (key: keyof PortfolioFilters, value: string) => {
    const newFilters = { ...filters, [key]: value === "all" ? undefined : value };
    setFilters(newFilters);
    filterPortfolios(newFilters);
    setSelectedPortfolio(""); // Reset selection when filters change
  };

  const handleAssignPortfolio = async () => {
    if (!selectedPortfolio) return;

    setIsAssigning(true);
    const success = await assignPortfolio(selectedPortfolio);
    
    if (success) {
      setSelectedPortfolio("");
      setFilters({});
      onOpenChange(false);
    }
    setIsAssigning(false);
  };

  const selectedPortfolioData = filteredPortfolios.find(p => p.id === selectedPortfolio);

  useEffect(() => {
    if (open) {
      // Reset filters when dialog opens
      setFilters({});
      setSelectedPortfolio("");
      filterPortfolios({});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Pick a Model Portfolio</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-300">Loading portfolios...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Filter Controls */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Asset Management Firms */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Asset Management Firms</label>
                    <Select 
                      value={filters.provider || "all"} 
                      onValueChange={(value) => handleFilterChange('provider', value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="All Firms" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Firms</SelectItem>
                        {filterOptions.providers.map((provider) => (
                          <SelectItem key={provider} value={provider}>
                            {provider}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Model Series */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Model Series</label>
                    <Select 
                      value={filters.series_type || "all"} 
                      onValueChange={(value) => handleFilterChange('series_type', value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="All Series" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Series</SelectItem>
                        {filterOptions.seriesTypes.map((series) => (
                          <SelectItem key={series} value={series}>
                            {series}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Asset Allocation */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Asset Allocation</label>
                    <Select 
                      value={filters.asset_allocation || "all"} 
                      onValueChange={(value) => handleFilterChange('asset_allocation', value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="All Allocations" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Allocations</SelectItem>
                        {filterOptions.assetAllocations.map((allocation) => (
                          <SelectItem key={allocation} value={allocation}>
                            {allocation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tax Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Tax Status</label>
                    <Select 
                      value={filters.tax_status || "all"} 
                      onValueChange={(value) => handleFilterChange('tax_status', value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                        <SelectValue placeholder="All Tax Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="all">All Tax Status</SelectItem>
                        {filterOptions.taxStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Portfolio Results */}
              {filteredPortfolios.length === 0 ? (
                <div className="text-center p-8">
                  <p className="text-slate-300 mb-2">No portfolios match the selected filters.</p>
                  <p className="text-sm text-slate-400">Try adjusting your filter criteria.</p>
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-slate-300">
                    Found {filteredPortfolios.length} portfolio{filteredPortfolios.length !== 1 ? 's' : ''} matching your criteria.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {!loading && (
          <div className="flex justify-end pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
