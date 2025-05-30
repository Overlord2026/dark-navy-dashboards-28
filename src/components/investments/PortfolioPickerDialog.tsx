
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface PortfolioPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PortfolioPickerDialog: React.FC<PortfolioPickerDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [selectedFirm, setSelectedFirm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");
  const [selectedAllocation, setSelectedAllocation] = useState("");
  const [selectedTaxStatus, setSelectedTaxStatus] = useState("");

  const handleViewPortfolio = () => {
    // Handle portfolio selection logic here
    console.log("Selected portfolio:", {
      firm: selectedFirm,
      series: selectedSeries,
      allocation: selectedAllocation,
      taxStatus: selectedTaxStatus,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 text-white border-slate-700">
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Asset Management Firm</label>
            <Select value={selectedFirm} onValueChange={setSelectedFirm}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select a firm" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="blackrock">BlackRock</SelectItem>
                <SelectItem value="vanguard">Vanguard</SelectItem>
                <SelectItem value="dimensional">Dimensional Fund Advisors</SelectItem>
                <SelectItem value="boutique">Boutique Family Office</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Model Series</label>
            <Select value={selectedSeries} onValueChange={setSelectedSeries}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select model series" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="growth">Growth Series</SelectItem>
                <SelectItem value="income">Income Series</SelectItem>
                <SelectItem value="balanced">Balanced Series</SelectItem>
                <SelectItem value="aggressive">Aggressive Series</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Asset Allocation</label>
            <Select value={selectedAllocation} onValueChange={setSelectedAllocation}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select allocation" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="60/40">60/40 Growth</SelectItem>
                <SelectItem value="40/60">40/60 Income</SelectItem>
                <SelectItem value="80/20">80/20 Aggressive</SelectItem>
                <SelectItem value="conservative">Conservative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Tax Status</label>
            <Select value={selectedTaxStatus} onValueChange={setSelectedTaxStatus}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select tax status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="tax-aware">Tax-Aware</SelectItem>
                <SelectItem value="tax-exempt">Tax-Exempt</SelectItem>
                <SelectItem value="taxable">Taxable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleViewPortfolio}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            disabled={!selectedFirm || !selectedSeries || !selectedAllocation || !selectedTaxStatus}
          >
            View Portfolio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
