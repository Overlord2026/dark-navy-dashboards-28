
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";

interface ModelPortfolioDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModelPortfolioDialog: React.FC<ModelPortfolioDialogProps> = ({ isOpen, onClose }) => {
  const [firm, setFirm] = useState("");
  const [modelSeries, setModelSeries] = useState("");
  const [assetAllocation, setAssetAllocation] = useState("");
  const [taxStatus, setTaxStatus] = useState("");
  
  const handleSubmit = () => {
    // Handle selection submission
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-[#0f1628] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Pick a Model Portfolio
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="firm">Asset Management Firm</Label>
            <Select value={firm} onValueChange={setFirm}>
              <SelectTrigger id="firm" className="w-full bg-[#1a283e] border-gray-700">
                <SelectValue placeholder="Select a firm" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a283e] border-gray-700 text-white">
                <SelectItem value="adelante">Adelante</SelectItem>
                <SelectItem value="trowe">T. Rowe Price</SelectItem>
                <SelectItem value="blackrock">BlackRock</SelectItem>
                <SelectItem value="vanguard">Vanguard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="modelSeries">Model Series</Label>
            <Select value={modelSeries} onValueChange={setModelSeries}>
              <SelectTrigger id="modelSeries" className="w-full bg-[#1a283e] border-gray-700">
                <SelectValue placeholder="Select model series" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a283e] border-gray-700 text-white">
                <SelectItem value="us-real-estate">US Real Estate</SelectItem>
                <SelectItem value="global-equity">Global Equity</SelectItem>
                <SelectItem value="fixed-income">Fixed Income</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assetAllocation">Asset Allocation</Label>
            <Select value={assetAllocation} onValueChange={setAssetAllocation}>
              <SelectTrigger id="assetAllocation" className="w-full bg-[#1a283e] border-gray-700">
                <SelectValue placeholder="Select allocation" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a283e] border-gray-700 text-white">
                <SelectItem value="100-0">100/0</SelectItem>
                <SelectItem value="80-20">80/20</SelectItem>
                <SelectItem value="60-40">60/40</SelectItem>
                <SelectItem value="40-60">40/60</SelectItem>
                <SelectItem value="20-80">20/80</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="taxStatus">Tax Status</Label>
            <Select value={taxStatus} onValueChange={setTaxStatus}>
              <SelectTrigger id="taxStatus" className="w-full bg-[#1a283e] border-gray-700">
                <SelectValue placeholder="Select tax status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a283e] border-gray-700 text-white">
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="taxable">Taxable</SelectItem>
                <SelectItem value="tax-exempt">Tax-Exempt</SelectItem>
                <SelectItem value="tax-aware">Tax-Aware</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit} 
            className="bg-primary text-white hover:bg-primary/90"
          >
            View Portfolio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModelPortfolioDialog;
