
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScheduleMeetingDialog } from "@/components/common/ScheduleMeetingDialog";
import PortfolioFilterDialog from "../PortfolioFilterDialog";
import GroupManagementDialog from "../GroupManagementDialog";
import ModelsTable from "./ModelsTable";
import { IAModel } from "./types";
import { iaModels } from "./modelData";

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

  const handleApplyFilters = (filters: any) => {
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
      <TabHeader 
        onFilterClick={() => setIsFilterDialogOpen(true)}
        onGroupClick={() => setIsGroupDialogOpen(true)}
      />

      <SearchInput 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ModelsTable 
        models={filteredModels}
        onInterested={handleInterested}
      />

      {filteredModels.length === 0 && <EmptyState />}

      <ScheduleAdvisorButton />

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

const TabHeader: React.FC<{
  onFilterClick: () => void;
  onGroupClick: () => void;
}> = ({ onFilterClick, onGroupClick }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
    <div>
      <h3 className="text-lg font-medium">Intelligent Allocation Models</h3>
      <p className="text-sm text-gray-400">
        Explore our AI-driven intelligent allocation models
      </p>
    </div>
    <div className="flex flex-wrap gap-2">
      <Button 
        onClick={onFilterClick} 
        variant="outline" 
        className="border-gray-700 text-white hover:bg-[#0f172a]"
      >
        Filter Models
      </Button>
      <Button 
        onClick={onGroupClick} 
        variant="outline" 
        className="border-gray-700 text-white hover:bg-[#0f172a]"
      >
        Manage Groups
      </Button>
    </div>
  </div>
);

const SearchInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => (
  <div className="relative">
    <Input
      placeholder="Search models by name or tags..."
      className="bg-[#0f172a] border-gray-700 mb-4 pl-4"
      value={value}
      onChange={onChange}
    />
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-8 bg-[#0f172a]/30 rounded-md border border-gray-800 mt-4">
    <p className="text-gray-400">No models found matching your search criteria.</p>
  </div>
);

const ScheduleAdvisorButton: React.FC = () => (
  <div className="mt-6 flex justify-center">
    <Button 
      className="bg-blue-800 hover:bg-blue-900 text-white"
      onClick={() => window.open("https://calendly.com/tonygomes/60min", "_blank")}
    >
      <Calendar className="mr-2 h-4 w-4" />
      Schedule a Meeting with an Advisor
    </Button>
  </div>
);

export default IntelligentAllocationTab;
