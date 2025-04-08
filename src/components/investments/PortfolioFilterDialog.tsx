
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PortfolioFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const PortfolioFilterDialog: React.FC<PortfolioFilterDialogProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
}) => {
  const [filters, setFilters] = useState({
    investmentType: "all",
    minimumAmount: "all",
    tags: [] as string[],
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters((prev) => {
      const currentTags = prev.tags;
      return {
        ...prev,
        tags: currentTags.includes(tag)
          ? currentTags.filter((t) => t !== tag)
          : [...currentTags, tag],
      };
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-[#0f1628] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Filter Investments</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="investmentType" className="text-white">
              Type
            </Label>
            <Select
              value={filters.investmentType}
              onValueChange={(value) => handleFilterChange("investmentType", value)}
            >
              <SelectTrigger className="col-span-3 bg-[#1a283e] border-gray-700">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a283e] border-gray-700 text-white">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="private-equity">Private Equity</SelectItem>
                <SelectItem value="private-debt">Private Debt</SelectItem>
                <SelectItem value="digital-assets">Digital Assets</SelectItem>
                <SelectItem value="real-assets">Real Assets</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="minimumAmount" className="text-white">
              Minimum
            </Label>
            <Select
              value={filters.minimumAmount}
              onValueChange={(value) => handleFilterChange("minimumAmount", value)}
            >
              <SelectTrigger className="col-span-3 bg-[#1a283e] border-gray-700">
                <SelectValue placeholder="Select minimum" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a283e] border-gray-700 text-white">
                <SelectItem value="all">All Amounts</SelectItem>
                <SelectItem value="under100k">Under $100,000</SelectItem>
                <SelectItem value="under250k">Under $250,000</SelectItem>
                <SelectItem value="under500k">Under $500,000</SelectItem>
                <SelectItem value="under1m">Under $1,000,000</SelectItem>
                <SelectItem value="over1m">Over $1,000,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label className="text-white">Tags</Label>
            <div className="grid grid-cols-2 gap-2">
              {["Growth Equity", "Buyout", "Venture Capital", "Mezzanine", "Secondaries"].map(
                (tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={filters.tags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                      className="border-gray-600"
                    />
                    <label
                      htmlFor={tag}
                      className="text-sm font-medium leading-none text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tag}
                    </label>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-gray-700 text-white hover:bg-gray-800">
            Cancel
          </Button>
          <Button onClick={handleApply} className="bg-primary text-white hover:bg-primary/90">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioFilterDialog;
