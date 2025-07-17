import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  id: string;
  label: string;
}

export interface InvestmentFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  riskLevels: FilterOption[];
  selectedRiskLevel: string;
  onRiskLevelChange: (level: string) => void;
  investmentTypes: FilterOption[];
  selectedInvestmentType: string;
  onInvestmentTypeChange: (type: string) => void;
  timeHorizons: FilterOption[];
  selectedTimeHorizon: string;
  onTimeHorizonChange: (horizon: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export const InvestmentFilters: React.FC<InvestmentFiltersProps> = ({
  searchTerm,
  onSearchChange,
  riskLevels,
  selectedRiskLevel,
  onRiskLevelChange,
  investmentTypes,
  selectedInvestmentType,
  onInvestmentTypeChange,
  timeHorizons,
  selectedTimeHorizon,
  onTimeHorizonChange,
  onClearFilters,
  activeFilterCount
}) => {
  return (
    <div className="bg-slate-900/40 rounded-lg border border-slate-800 p-4">
      <div className="flex flex-wrap gap-4">
        {/* Search Input */}
        <div className="relative flex-grow min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, manager, or tag..."
            className="pl-10 bg-slate-800 border-slate-700"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground"
              onClick={() => onSearchChange("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Risk Level Filter */}
        <div className="min-w-[150px]">
          <Select value={selectedRiskLevel} onValueChange={onRiskLevelChange}>
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Risk Levels</SelectItem>
              {riskLevels.map(risk => (
                <SelectItem key={risk.id} value={risk.id}>{risk.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Investment Type Filter */}
        <div className="min-w-[150px]">
          <Select value={selectedInvestmentType} onValueChange={onInvestmentTypeChange}>
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue placeholder="Investment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {investmentTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Horizon Filter */}
        <div className="min-w-[150px]">
          <Select value={selectedTimeHorizon} onValueChange={onTimeHorizonChange}>
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue placeholder="Time Horizon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Time Horizon</SelectItem>
              {timeHorizons.map(horizon => (
                <SelectItem key={horizon.id} value={horizon.id}>{horizon.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {activeFilterCount > 0 && (
          <Button 
            variant="outline" 
            className="bg-slate-800 border-slate-700" 
            onClick={onClearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
            <Badge variant="secondary" className="ml-2 text-xs">
              {activeFilterCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
};