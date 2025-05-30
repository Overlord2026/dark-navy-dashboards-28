
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useBFOModels } from "@/hooks/useBFOModels";
import { Badge } from "@/components/ui/badge";

interface PortfolioPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PortfolioPickerDialog: React.FC<PortfolioPickerDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { availablePortfolios, assignPortfolio, loading } = useBFOModels();
  const [selectedPortfolio, setSelectedPortfolio] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssignPortfolio = async () => {
    if (!selectedPortfolio) return;

    setIsAssigning(true);
    const success = await assignPortfolio(selectedPortfolio);
    
    if (success) {
      setSelectedPortfolio("");
      onOpenChange(false);
    }
    setIsAssigning(false);
  };

  const selectedPortfolioData = availablePortfolios.find(p => p.id === selectedPortfolio);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-slate-900 text-white border-slate-700">
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
          ) : availablePortfolios.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-slate-300 mb-2">All available portfolios have been assigned.</p>
              <p className="text-sm text-slate-400">You can manage your existing portfolios from the main page.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Available Model Portfolios</label>
                <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select a portfolio" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {availablePortfolios.map((portfolio) => (
                      <SelectItem key={portfolio.id} value={portfolio.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{portfolio.name}</span>
                          <span className="text-xs text-slate-400 ml-2">({portfolio.provider})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPortfolioData && (
                <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white">{selectedPortfolioData.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={`border-${selectedPortfolioData.badge_color}-500 text-${selectedPortfolioData.badge_color}-300`}
                    >
                      {selectedPortfolioData.badge_text}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-300">{selectedPortfolioData.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Provider:</span>
                      <span className="text-white ml-2">{selectedPortfolioData.provider}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Return Rate:</span>
                      <span className="text-emerald-400 ml-2">{selectedPortfolioData.return_rate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Risk Level:</span>
                      <span className="text-white ml-2">{selectedPortfolioData.risk_level}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Allocation:</span>
                      <span className="text-white ml-2">{selectedPortfolioData.asset_allocation}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {!loading && availablePortfolios.length > 0 && (
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAssignPortfolio}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
              disabled={!selectedPortfolio || isAssigning}
            >
              {isAssigning ? "Assigning..." : "Assign Portfolio"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
