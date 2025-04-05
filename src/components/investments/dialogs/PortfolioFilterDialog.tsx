import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, Search, X, Filter } from "lucide-react";
import { toast } from "sonner";

interface PortfolioFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PortfolioFilterDialog: React.FC<PortfolioFilterDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [selectedPortfolioTypes, setSelectedPortfolioTypes] = useState<string[]>([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>([]);
  const [selectedAssetClasses, setSelectedAssetClasses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const portfolioTypes = ["Model", "Sleeve", "Model of Models"];
  const riskLevels = ["Low", "Medium", "High"];
  const assetClasses = ["Equity", "Fixed Income", "Alternative", "Cash", "Multi-Asset"];
  
  const toggleSelection = (item: string, currentSelections: string[], setSelections: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (currentSelections.includes(item)) {
      setSelections(currentSelections.filter(i => i !== item));
    } else {
      setSelections([...currentSelections, item]);
    }
  };
  
  const handleApplyFilters = () => {
    toast.success("Filters applied successfully");
    toast.info(`Searching for "${searchTerm || 'all'}" with ${selectedPortfolioTypes.length} types, ${selectedRiskLevels.length} risk levels, and ${selectedAssetClasses.length} asset classes`);
    onOpenChange(false);
  };
  
  const handleClearFilters = () => {
    setSelectedPortfolioTypes([]);
    setSelectedRiskLevels([]);
    setSelectedAssetClasses([]);
    setSearchTerm("");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Find Portfolios
          </DialogTitle>
          <DialogDescription>
            Filter and search through available portfolio models based on your criteria.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, benchmark, or tags..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <Label className="mb-2 block">Portfolio Type</Label>
            <div className="flex flex-wrap gap-2">
              {portfolioTypes.map((type) => (
                <Badge
                  key={type}
                  variant={selectedPortfolioTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSelection(type, selectedPortfolioTypes, setSelectedPortfolioTypes)}
                >
                  {selectedPortfolioTypes.includes(type) && (
                    <Check className="mr-1 h-3 w-3" />
                  )}
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">Risk Level</Label>
            <div className="flex flex-wrap gap-2">
              {riskLevels.map((level) => (
                <Badge
                  key={level}
                  variant={selectedRiskLevels.includes(level) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSelection(level, selectedRiskLevels, setSelectedRiskLevels)}
                >
                  {selectedRiskLevels.includes(level) && (
                    <Check className="mr-1 h-3 w-3" />
                  )}
                  {level}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">Asset Class</Label>
            <div className="flex flex-wrap gap-2">
              {assetClasses.map((assetClass) => (
                <Badge
                  key={assetClass}
                  variant={selectedAssetClasses.includes(assetClass) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleSelection(assetClass, selectedAssetClasses, setSelectedAssetClasses)}
                >
                  {selectedAssetClasses.includes(assetClass) && (
                    <Check className="mr-1 h-3 w-3" />
                  )}
                  {assetClass}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
