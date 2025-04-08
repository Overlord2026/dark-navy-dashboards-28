
import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ScheduleMeetingDialog } from "@/components/common/ScheduleMeetingDialog";
import PortfolioFilterDialog from "./PortfolioFilterDialog";
import GroupManagementDialog from "./GroupManagementDialog";

// Sample IA model data
const iaModels = [
  {
    id: "1",
    name: "2006 Domestic Core Equity Strategy 1",
    type: "Strategy",
    targets: "100/0",
    created: "2023-06-15",
    updated: "2024-02-20",
    benchmark: "S&P 500",
    tags: ["equity", "domestic", "core"]
  },
  {
    id: "2",
    name: "Aggressive Growth Strategy SMH 100%",
    type: "Strategy",
    targets: "100/0",
    created: "2023-07-01",
    updated: "2024-01-15",
    benchmark: "NASDAQ 100",
    tags: ["aggressive", "growth", "technology"]
  },
  {
    id: "3",
    name: "Bitcoin ETF Core Sleeve",
    type: "Sleeve",
    targets: "N/A",
    created: "2024-01-10",
    updated: "2024-03-05",
    benchmark: "Bitcoin Price Index",
    tags: ["cryptocurrency", "digital assets", "alternative"]
  },
  {
    id: "4",
    name: "Domestic Aggressive 90 Equity / 10 FI",
    type: "Model",
    targets: "90/10",
    created: "2023-05-20",
    updated: "2024-02-10",
    benchmark: "S&P 500",
    tags: ["aggressive", "equity", "fixed income"]
  },
  {
    id: "5",
    name: "Domestic Conservative+ 65 Equity / 35 FI",
    type: "Model",
    targets: "65/35",
    created: "2023-04-15",
    updated: "2024-03-01",
    benchmark: "Blended Index",
    tags: ["conservative", "balanced"]
  },
  {
    id: "6",
    name: "Domestic Equity Bit10 SMH10",
    type: "Model",
    targets: "80/20",
    created: "2023-09-01",
    updated: "2024-02-25",
    benchmark: "Custom Blend",
    tags: ["balanced", "digital", "equity"]
  },
  {
    id: "7",
    name: "Domestic Growth 80 Equity / 20 FI",
    type: "Model",
    targets: "80/20",
    created: "2023-03-10",
    updated: "2024-01-20",
    benchmark: "Russell 1000 Growth",
    tags: ["growth", "domestic", "balanced"]
  },
  {
    id: "8",
    name: "Domestic Moderate 70 Equity / 30 FI",
    type: "Model",
    targets: "70/30",
    created: "2023-02-05",
    updated: "2024-03-10",
    benchmark: "Blended Index",
    tags: ["moderate", "balanced"]
  },
  {
    id: "9",
    name: "Global Aggressive 90 Equity / 10 FI",
    type: "Model",
    targets: "90/10",
    created: "2023-08-12",
    updated: "2024-02-15",
    benchmark: "MSCI World Index",
    tags: ["global", "aggressive", "growth"]
  },
  {
    id: "10",
    name: "Global Growth 80 Equity / 20 FI",
    type: "Model",
    targets: "80/20",
    created: "2023-07-25",
    updated: "2024-01-30",
    benchmark: "MSCI ACWI",
    tags: ["global", "growth", "balanced"]
  },
  {
    id: "11",
    name: "Global Moderate 70 Equity / 30 FI",
    type: "Model",
    targets: "70/30",
    created: "2023-06-30",
    updated: "2024-02-28",
    benchmark: "MSCI World Blend",
    tags: ["global", "moderate", "balanced"]
  },
  {
    id: "12",
    name: "Income 1 Sleeve",
    type: "Sleeve",
    targets: "20/80",
    created: "2023-05-15",
    updated: "2024-03-12",
    benchmark: "Bloomberg Aggregate Bond",
    tags: ["income", "fixed income", "conservative"]
  },
  {
    id: "13",
    name: "Income Conservative 2 Sleeve",
    type: "Sleeve",
    targets: "10/90",
    created: "2023-04-20",
    updated: "2024-02-05",
    benchmark: "Bloomberg US Treasury",
    tags: ["income", "conservative", "treasury"]
  },
  {
    id: "14",
    name: "Tactical Fixed Income Sleeve 1",
    type: "Sleeve",
    targets: "0/100",
    created: "2023-09-10",
    updated: "2024-01-25",
    benchmark: "Bloomberg US Corporate",
    tags: ["tactical", "fixed income", "corporate"]
  }
];

const IntelligentAllocationTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState<boolean>(false);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [groups, setGroups] = useState<string[]>([]);
  const [filters, setFilters] = useState<any>({});

  const filteredModels = iaModels.filter(model => 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInterested = (modelId: string) => {
    setSelectedModel(modelId);
    toast.success("Interest noted", {
      description: `We've recorded your interest in this model. An advisor will contact you.`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleApplyFilters = (filters: any) => {
    // This would typically filter the models based on the selected filters
    setFilters(filters);
    toast.info("Filters applied", {
      description: "The models have been filtered based on your selections.",
    });
  };

  const handleSaveGroups = (newGroups: string[]) => {
    setGroups(newGroups);
    toast.success("Groups updated", {
      description: "Your groups have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h3 className="text-lg font-medium">Intelligent Allocation Models</h3>
          <p className="text-sm text-gray-400">
            Explore our AI-driven intelligent allocation models
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => setIsFilterDialogOpen(true)} 
            variant="outline" 
            className="border-gray-700 text-white hover:bg-[#0f172a]"
          >
            Filter Models
          </Button>
          <Button 
            onClick={() => setIsGroupDialogOpen(true)} 
            variant="outline" 
            className="border-gray-700 text-white hover:bg-[#0f172a]"
          >
            Manage Groups
          </Button>
        </div>
      </div>

      <div className="relative">
        <Input
          placeholder="Search models by name or tags..."
          className="bg-[#0f172a] border-gray-700 mb-4 pl-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border border-gray-800 overflow-auto">
        <Table className="min-w-full">
          <TableHeader className="bg-[#0f172a]">
            <TableRow>
              <TableHead className="text-white whitespace-nowrap w-1/4">Name</TableHead>
              <TableHead className="text-white whitespace-nowrap">Type</TableHead>
              <TableHead className="text-white whitespace-nowrap">Targets</TableHead>
              <TableHead className="text-white whitespace-nowrap">Updated</TableHead>
              <TableHead className="text-white whitespace-nowrap">Benchmark</TableHead>
              <TableHead className="text-white whitespace-nowrap">Tags</TableHead>
              <TableHead className="text-white whitespace-nowrap text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredModels.map((model) => (
              <TableRow key={model.id} className="hover:bg-[#0f172a]/50 border-t border-gray-800">
                <TableCell className="font-medium text-white">{model.name}</TableCell>
                <TableCell className="text-gray-300">{model.type}</TableCell>
                <TableCell className="text-gray-300">{model.targets}</TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex flex-col">
                    <span>{formatDate(model.updated)}</span>
                    <span className="text-xs text-gray-400">Created: {formatDate(model.created)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">{model.benchmark}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {model.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="border-gray-600 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="interested" 
                      size="sm" 
                      className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium"
                      onClick={() => handleInterested(model.id)}
                    >
                      I'm Interested
                    </Button>
                    <ScheduleMeetingDialog 
                      assetName={model.name} 
                      variant="outline" 
                      className="text-xs py-1 h-auto border-gray-600 hover:bg-[#0f172a]" 
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-8 bg-[#0f172a]/30 rounded-md border border-gray-800 mt-4">
          <p className="text-gray-400">No models found matching your search criteria.</p>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button 
          className="bg-blue-800 hover:bg-blue-900 text-white"
          onClick={() => window.open("https://calendly.com/tonygomes/60min", "_blank")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Schedule a Meeting with an Advisor
        </Button>
      </div>

      <PortfolioFilterDialog 
        isOpen={isFilterDialogOpen} 
        onClose={() => setIsFilterDialogOpen(false)} 
        onApplyFilters={handleApplyFilters}
      />
      
      <GroupManagementDialog 
        isOpen={isGroupDialogOpen} 
        onClose={() => setIsGroupDialogOpen(false)} 
        groups={groups}
        onSaveGroups={handleSaveGroups}
      />
    </div>
  );
};

export default IntelligentAllocationTab;
