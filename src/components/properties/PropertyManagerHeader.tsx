
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PropertyManagerHeaderProps {
  filterTitle: string;
  onAddProperty: () => void;
}

export const PropertyManagerHeader: React.FC<PropertyManagerHeaderProps> = ({
  filterTitle,
  onAddProperty
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div></div>
      <Button 
        onClick={onAddProperty} 
        className="bg-yellow-500 hover:bg-yellow-600 text-black w-full sm:w-auto"
      >
        <Plus className="mr-2 h-4 w-4" /> Add Property
      </Button>
    </div>
  );
};
